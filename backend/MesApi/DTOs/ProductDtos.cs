public sealed class ProductCreateDto
{
    public string Name { get; set; } = string.Empty;
    public ProductType ProductType { get; set; }
    public string? Description { get; set; }
    public ProductStatus Status { get; set; }
}

public sealed class ProductUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public ProductType ProductType { get; set; }
    public string? Description { get; set; }
    public ProductStatus Status { get; set; }
}

public sealed class ProductReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ProductType ProductType { get; set; }
    public string? Description { get; set; }
    public DateTime Created { get; set; }
    public ProductStatus Status { get; set; }
    public DateTime? ModifiedTime { get; set; }
    public string? LastUpdate { get; set; }
}

public static class ProductMappingExtensions
{
    public static ProductReadDto ToReadDto(this Product product)
    {
        return new ProductReadDto
        {
            Id = product.Id,
            Name = product.Name,
            ProductType = product.ProductType,
            Description = product.Description,
            Created = product.Created,
            Status = product.Status,
            ModifiedTime = product.ModifiedTime,
            LastUpdate = product.LastUpdate
        };
    }
}
