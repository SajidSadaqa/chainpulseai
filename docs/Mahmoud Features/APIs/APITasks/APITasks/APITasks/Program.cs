using APITasks.Controllers;
using APITasks.Data;
using APITasks.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddHttpClient<IMarketProviderClient, CoinGeckoMarketProviderClient>(client =>
{
    var baseUrl = builder.Configuration["MarketProvider:BaseUrl"];

    client.BaseAddress = new Uri(baseUrl!);
    client.Timeout = TimeSpan.FromSeconds(30);
});

var connectionString =
    builder.Configuration.GetConnectionString("ConnectionDb");

var connectionBuilder =
    new Npgsql.NpgsqlConnectionStringBuilder(connectionString);

Console.WriteLine($"DATABASE HOST: {connectionBuilder.Host}");
Console.WriteLine($"DATABASE PORT: {connectionBuilder.Port}");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));


builder.Services.AddHealthChecks();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseExceptionHandler();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    db.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHealthChecks("/health");

app.Run();
