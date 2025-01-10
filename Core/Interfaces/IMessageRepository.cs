using Core.Entities;

namespace Core.Interfaces;

public interface IMessageRepository : IGenericRepository<Message>
{
    Task<bool> Complete();
    Task MarkMessagesAsRead(string receiverId, string senderId);
}