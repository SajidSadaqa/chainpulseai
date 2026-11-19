using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APITasks.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueProviderIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Coin_ProviderName_ProviderCoinId",
                table: "Coin",
                columns: new[] { "ProviderName", "ProviderCoinId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Coin_ProviderName_ProviderCoinId",
                table: "Coin");
        }
    }
}
