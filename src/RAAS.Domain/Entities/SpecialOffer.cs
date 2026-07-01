using System.ComponentModel.DataAnnotations;
using RAAS.Domain.Common;

namespace RAAS.Domain.Entities;

public class SpecialOffer : BaseEntity
{
    [Required(ErrorMessage = "Title is required")]
    [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
    public string Title { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Description is required")]
    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string Description { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Badge text is required")]
    [StringLength(50, ErrorMessage = "Badge text cannot exceed 50 characters")]
    public string BadgeText { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Button text is required")]
    [StringLength(50, ErrorMessage = "Button text cannot exceed 50 characters")]
    public string ButtonText { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Button link is required")]
    [StringLength(200, ErrorMessage = "Button link cannot exceed 200 characters")]
    public string ButtonLink { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Background color is required")]
    [StringLength(50, ErrorMessage = "Background color cannot exceed 50 characters")]
    public string BackgroundColor { get; set; } = "linear-gradient(135deg, var(--maroon), var(--maroon-dark))";
    
    [Required(ErrorMessage = "Text color is required")]
    [StringLength(50, ErrorMessage = "Text color cannot exceed 50 characters")]
    public string TextColor { get; set; } = "var(--cream)";
    
    [Required(ErrorMessage = "Badge color is required")]
    [StringLength(50, ErrorMessage = "Badge color cannot exceed 50 characters")]
    public string BadgeColor { get; set; } = "badge-gold";
    
    [Required(ErrorMessage = "Button color is required")]
    [StringLength(50, ErrorMessage = "Button color cannot exceed 50 characters")]
    public string ButtonColor { get; set; } = "btn-gold";
    
    public int DisplayOrder { get; set; } = 0;
    
    public bool IsActive { get; set; } = true;
    
    public DateTime? ValidFrom { get; set; }
    
    public DateTime? ValidUntil { get; set; }
}
