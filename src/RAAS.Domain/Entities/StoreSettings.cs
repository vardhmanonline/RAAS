using RAAS.Domain.Common;

namespace RAAS.Domain.Entities;

public class StoreSettings : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
