using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.SignalR;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController(
    IUnitOfWork unit,
    IHybridEncryptionService hybridEncryptionService,
    IHybridDecryptionService hybridDecryptionService,
    IPrivateKeyCache privateKeyCache,
    IMessageRepository messageRepository,
    IHubContext<NotificationHub> hubContext) : ControllerBase
{
    [Authorize]
    [HttpGet("{messageId}")]
    public async Task<ActionResult<MessageDto>> GetMessage(string messageId)
    {
        var message = await messageRepository.GetByIdWithSpecsAsync(MessageSpecification.ByMessageId(messageId));

        var currentUserProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);

        if (message == null || currentUserProfile == null ||
            (currentUserProfile.Id != message.ReceiverId && currentUserProfile.Id != message.SenderId))
        {
            return Forbid();
        }

        try
        {
            var decryptedPrivateKey = privateKeyCache.GetPrivateKey(currentUserProfile.UserId);

            if (decryptedPrivateKey == null)
                return StatusCode(500, "An error occurred while accessing your session. Please try re-logging.");

            var messageContent = await hybridDecryptionService.DecryptMessage(decryptedPrivateKey,
                currentUserProfile.Id == message.ReceiverId
                    ? message.EncryptedMessageForReceiver
                    : message.EncryptedMessageForSender);

            return Ok(message.ToDto(messageContent));
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An unexpected error occurred.");
        }
    }

    [Authorize]
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<MessageDto>>> GetChatHistoryWithUser(string userId)
    {
        var currentUserProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);
        if (currentUserProfile == null)
            return Forbid();

        var messages =
            await messageRepository.GetListWithSpecsAsync(MessageSpecification.ByUserId(currentUserProfile.Id, userId));

        if (messages.Count == 0)
            return NoContent();

        if (currentUserProfile.Id == userId)
            return BadRequest("You can't see chat history with yourself.");

        try
        {
            var decryptedPrivateKey = privateKeyCache.GetPrivateKey(currentUserProfile.UserId);

            if (decryptedPrivateKey == null)
                return StatusCode(500, "An error occurred while accessing your session. Please try re-logging.");

            var decryptedMessages = await DecryptAllMessages(messages, decryptedPrivateKey, currentUserProfile.Id);

            return Ok(decryptedMessages);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An unexpected error occurred.");
        }
    }

    private async Task<List<MessageDto>> DecryptAllMessages(List<Message> messages, string privateKey,
        string currentUserProfileId)
    {
        var decryptedMessages = await Task.WhenAll(messages.Select(async m =>
            m.ToDto(await hybridDecryptionService.DecryptMessage(privateKey,
                currentUserProfileId == m.ReceiverId
                    ? m.EncryptedMessageForReceiver
                    : m.EncryptedMessageForSender))));

        return decryptedMessages.ToList();
    }


    [Authorize]
    [HttpPost("user/{userId}")]
    public async Task<ActionResult> SendMessage(string userId, SendMessageDto sendMessageDto)
    {
        var currentUserProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);
        
        if (currentUserProfile == null || currentUserProfile.Id == userId)
            return BadRequest("You can't send a message to yourself.");
        
        var message = sendMessageDto.Message;

        Friend? currentRelation;
        try
        {
            currentRelation = await FriendHelper.GetExistingRelation(unit, User, userId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

        if (currentRelation is not { Status: Status.Friend })
            return BadRequest("You cant write a message to this user, because your are not friends.");

        var receiverProfile = await unit.Repository<UserProfile>().GetByIdAsync(userId);

        if (receiverProfile == null)
            return NotFound("User not found.");

        try
        {
            var encryptedMessageReceiver =
                await hybridEncryptionService.EncryptMessage(message, receiverProfile.PublicKey);
            var encryptedMessageSender = await
                hybridEncryptionService.EncryptMessage(message, currentUserProfile.PublicKey);

            var messageEntity = MessageMappingExtension.ToEntity(currentUserProfile, receiverProfile,
                encryptedMessageSender, encryptedMessageReceiver);

            messageRepository.Add(messageEntity);

            if (await messageRepository.Complete())
            {
                if (NotificationHub.IsUserConnected(receiverProfile.Id))
                {
                    var connectionId = NotificationHub.GetConnectionId(receiverProfile.Id);
                    
                    if (connectionId != null)
                        await hubContext.Clients.Client(connectionId)
                            .SendAsync("MessageCreated", messageEntity.ToDto(message));
                }

                return CreatedAtAction(nameof(GetMessage), new { messageId = messageEntity.Id },
                    messageEntity.ToDto(message));
            }
        }
        catch
        {
            return StatusCode(500, "An unexpected error occurred.");
        }

        return BadRequest("Failed to send the message.");
    }

    [Authorize]
    [HttpPut("user/{userId}")]
    public async Task<ActionResult> ChangeMessagesStatusToRead(string userId)
    {
        var currentUserProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);

        if (currentUserProfile == null || currentUserProfile.Id == userId)
            return Forbid();

        await messageRepository.MarkMessagesAsRead(currentUserProfile.Id, userId);

        var receiverProfile = await unit.Repository<UserProfile>().GetByIdAsync(userId);
        
        if (receiverProfile != null && NotificationHub.IsUserConnected(receiverProfile.Id))
        {
            var connectionId = NotificationHub.GetConnectionId(receiverProfile.Id);
                    
            if (connectionId != null)
                await hubContext.Clients.Client(connectionId)
                    .SendAsync("MessageRead", currentUserProfile.Id);
        }

        return NoContent();
    }
}