using RAAS.Domain.Common;

namespace RAAS.Domain.Entities;

public class ProductView : BaseEntity
{
    public Guid ProductId { get; set; }
    public Guid? UserId { get; set; }
    public string? SessionId { get; set; }

    public Product Product { get; set; } = null!;
    public User? User { get; set; }
}
