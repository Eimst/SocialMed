using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class MessageRepository(MediaContext context) : GenericRepository<Message>(context), IMessageRepository 
{
    private readonly MediaContext _context = context;

    public async Task MarkMessagesAsRead(string receiverId, string senderId)
    {
        var messages = _context.Messages.Where(m => m.ReceiverId == receiverId && m.SenderId == senderId && !m.IsRead);
        await messages.ExecuteUpdateAsync(m => m.SetProperty(p => p.IsRead, true));
    }
    
    public async Task<bool> Complete()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}