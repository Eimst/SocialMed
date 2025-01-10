using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EncryptedMessage",
                table: "Messages",
                newName: "EncryptedMessageForSender");

            migrationBuilder.AddColumn<string>(
                name: "EncryptedMessageForReceiver",
                table: "Messages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EncryptedMessageForReceiver",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "EncryptedMessageForSender",
                table: "Messages",
                newName: "EncryptedMessage");
        }
    }
}
