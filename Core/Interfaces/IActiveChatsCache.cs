namespace Core.Interfaces;

public interface IActiveChatsCache
{
    HashSet<string>  AddActiveUserChat(string userId, string userChatId);

    HashSet<string> RemoveActiveUserChat(string userId, string userChatId);
}