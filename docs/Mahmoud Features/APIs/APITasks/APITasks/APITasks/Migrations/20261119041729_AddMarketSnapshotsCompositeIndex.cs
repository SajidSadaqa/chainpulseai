using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APITasks.Migrations
{
    /// <inheritdoc />
    public partial class AddMarketSnapshotsCompositeIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MarketSnapshots_CoinId",
                table: "MarketSnapshots");

            migrationBuilder.CreateIndex(
                name: "IX_MarketSnapshots_CoinId_CapturedAt_Id",
                table: "MarketSnapshots",
                columns: new[] { "CoinId", "CapturedAt", "Id" },
                descending: new[] { false, true, true });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MarketSnapshots_CoinId_CapturedAt_Id",
                table: "MarketSnapshots");

            migrationBuilder.CreateIndex(
                name: "IX_MarketSnapshots_CoinId",
                table: "MarketSnapshots",
                column: "CoinId");
        }
    }
}
