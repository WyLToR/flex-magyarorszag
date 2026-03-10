using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(origin => new Uri(origin).IsLoopback)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddDbContext<ApplicationDbContext>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors();

app.MapGet("/api/products", async (string? search, ApplicationDbContext context) =>
{
    var query = context.Products.AsQueryable();

    if (!string.IsNullOrWhiteSpace(search))
    {
        var term = search.Trim();

        query = query.Where(product =>
            product.Name.Contains(term) ||
            (product.Description != null && product.Description.Contains(term)));

        if (int.TryParse(term, out var parsedId))
        {
            query = query.Union(context.Products.Where(product => product.Id == parsedId));
        }

        if (Enum.TryParse<ProductType>(term, true, out var parsedType))
        {
            query = query.Union(context.Products.Where(product => product.ProductType == parsedType));
        }

        if (Enum.TryParse<ProductStatus>(term, true, out var parsedStatus))
        {
            query = query.Union(context.Products.Where(product => product.Status == parsedStatus));
        }
    }

    var products = await query
        .OrderBy(product => product.Id)
        .ToListAsync();

    return products.Select(product => product.ToReadDto());
})
.WithName("GetProducts")
.WithOpenApi();

app.MapGet("/api/products/{id:int}", async (int id, ApplicationDbContext context) =>
{
    var product = await context.Products.FindAsync(id);
    return product is null ? Results.NotFound() : Results.Ok(product.ToReadDto());
})
.WithName("GetProductById")
.WithOpenApi();

app.MapPost("/api/products", async (ProductCreateDto request, ApplicationDbContext context) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
    {
        return Results.BadRequest("Name is required.");
    }

    var product = new Product
    {
        Name = request.Name.Trim(),
        ProductType = request.ProductType,
        Description = NormalizeNullableText(request.Description),
        Created = DateTime.UtcNow,
        Status = request.Status
    };

    context.Products.Add(product);
    await context.SaveChangesAsync();

    return Results.Created($"/api/products/{product.Id}", product.ToReadDto());
})
.WithName("CreateProduct")
.WithOpenApi();

app.MapPut("/api/products/{id:int}", async (int id, ProductUpdateDto request, ApplicationDbContext context) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
    {
        return Results.BadRequest("Name is required.");
    }

    var product = await context.Products.FindAsync(id);
    if (product is null)
    {
        return Results.NotFound();
    }

    var normalizedName = request.Name.Trim();
    var normalizedDescription = NormalizeNullableText(request.Description);
    var changedFieldOldValues = GetChangedFieldOldValues(product, normalizedName, request.ProductType, normalizedDescription, request.Status);

    product.Name = normalizedName;
    product.ProductType = request.ProductType;
    product.Description = normalizedDescription;
    product.Status = request.Status;

    if (changedFieldOldValues.Count > 0)
    {
        product.ModifiedTime = DateTime.UtcNow;
        product.LastUpdate = string.Join("; ", changedFieldOldValues);
    }

    await context.SaveChangesAsync();
    return Results.Ok(product.ToReadDto());
})
.WithName("UpdateProduct")
.WithOpenApi();

app.MapDelete("/api/products/{id:int}", async (int id, ApplicationDbContext context) =>
{
    var product = await context.Products.FindAsync(id);
    if (product is null)
    {
        return Results.NotFound();
    }

    context.Products.Remove(product);
    await context.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeleteProduct")
.WithOpenApi();

app.Run();

static string? NormalizeNullableText(string? value)
{
    if (string.IsNullOrWhiteSpace(value))
    {
        return null;
    }

    return value.Trim();
}

static List<string> GetChangedFieldOldValues(Product product, string newName, ProductType newProductType, string? newDescription, ProductStatus newStatus)
{
    var changedFields = new List<string>();

    if (!string.Equals(product.Name, newName, StringComparison.Ordinal))
    {
        changedFields.Add($"Name={product.Name}");
    }

    if (product.ProductType != newProductType)
    {
        changedFields.Add($"ProductType={product.ProductType}");
    }

    if (!string.Equals(product.Description, newDescription, StringComparison.Ordinal))
    {
        changedFields.Add($"Description={product.Description ?? "<null>"}");
    }

    if (product.Status != newStatus)
    {
        changedFields.Add($"Status={product.Status}");
    }

    return changedFields;
}
