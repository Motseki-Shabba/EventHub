using System.ComponentModel.DataAnnotations;

namespace EventManagement.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}