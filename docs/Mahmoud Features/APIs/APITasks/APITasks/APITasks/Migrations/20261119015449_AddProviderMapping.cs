using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APITasks.Migrations
{
    /// <inheritdoc />
    public partial class AddProviderMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProviderCoinId",
                table: "Coin",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProviderName",
                table: "Coin",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProviderCoinId",
                table: "Coin");

            migrationBuilder.DropColumn(
                name: "ProviderName",
                table: "Coin");
        }
    }
}
