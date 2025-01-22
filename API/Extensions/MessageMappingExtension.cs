using API.DTOs;
using Core.Entities;

namespace API.Extensions;

public static class MessageMappingExtension
{
    public static Message ToEntity(UserProfile currentUserProfile, UserProfile receiverProfile,
        string encryptedMessageForSender, string encryptedMessageForReceiver)
    {
        return new Message
        {
            SenderId = currentUserProfile.Id,
            ReceiverId = receiverProfile.Id,
            EncryptedMessageForSender = encryptedMessageForSender,
            EncryptedMessageForReceiver = encryptedMessageForReceiver,
            Sender = currentUserProfile,
            Receiver = receiverProfile
        };
    }
    
    public static MessageDto ToDto(this Message message, string decryptedMessage)
    {
        return new MessageDto
        {
            Message = decryptedMessage,
            Sender = message.Sender.ToDto(),
            Receiver = message.Receiver.ToDto(),
            DateCreated = message.DateCreated,
            IsRead = message.IsRead,
        };
    }
    
}