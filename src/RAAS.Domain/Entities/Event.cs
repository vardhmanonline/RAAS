using RAAS.Domain.Common;
using RAAS.Domain.Enums;

namespace RAAS.Domain.Entities;

public class Event : BaseEntity
{
    public EventType EventType { get; set; }
    public Guid? UserId { get; set; }
    public Guid? ProductId { get; set; }
    public Guid? OrderId { get; set; }
    public string? SessionId { get; set; }
    public string? Metadata { get; set; }
    public string? UserAgent { get; set; }
    public string? IpAddress { get; set; }

    public User? User { get; set; }
    public Product? Product { get; set; }
}
