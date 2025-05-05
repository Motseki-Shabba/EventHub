using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventManagement.Migrations
{
    /// <inheritdoc />
    public partial class Attendeenew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Attendees");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Attendees");

            migrationBuilder.DropColumn(
                name: "Surname",
                table: "Attendees");

            migrationBuilder.CreateIndex(
                name: "IX_Attendees_UserId",
                table: "Attendees",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendees_AbpUsers_UserId",
                table: "Attendees",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendees_AbpUsers_UserId",
                table: "Attendees");

            migrationBuilder.DropIndex(
                name: "IX_Attendees_UserId",
                table: "Attendees");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Attendees",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Attendees",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Surname",
                table: "Attendees",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
