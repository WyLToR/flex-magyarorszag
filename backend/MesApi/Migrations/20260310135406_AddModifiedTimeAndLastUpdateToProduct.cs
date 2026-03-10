using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MesApi.Migrations
{
    /// <inheritdoc />
    public partial class AddModifiedTimeAndLastUpdateToProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LastUpdate",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedTime",
                table: "Products",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "LastUpdate", "ModifiedTime" },
                values: new object[] { new DateTime(2026, 3, 7, 19, 15, 28, 980, DateTimeKind.Local).AddTicks(2170), null, null });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Created", "LastUpdate", "ModifiedTime" },
                values: new object[] { new DateTime(2026, 3, 9, 4, 2, 0, 980, DateTimeKind.Local).AddTicks(2170), null, null });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Created", "LastUpdate", "ModifiedTime" },
                values: new object[] { new DateTime(2026, 3, 9, 5, 35, 21, 980, DateTimeKind.Local).AddTicks(2170), null, null });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Created", "LastUpdate", "ModifiedTime" },
                values: new object[] { new DateTime(2026, 3, 7, 10, 5, 20, 980, DateTimeKind.Local).AddTicks(2170), null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastUpdate",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ModifiedTime",
                table: "Products");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                column: "Created",
                value: new DateTime(2026, 1, 4, 20, 24, 55, 510, DateTimeKind.Local).AddTicks(4518));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "Created",
                value: new DateTime(2026, 1, 5, 0, 9, 8, 510, DateTimeKind.Local).AddTicks(4518));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                column: "Created",
                value: new DateTime(2026, 1, 4, 8, 50, 36, 510, DateTimeKind.Local).AddTicks(4518));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                column: "Created",
                value: new DateTime(2026, 1, 1, 18, 47, 38, 510, DateTimeKind.Local).AddTicks(4518));
        }
    }
}
