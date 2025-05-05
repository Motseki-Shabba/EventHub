using EventManagement.Configuration.Dto;
using System.Threading.Tasks;

namespace EventManagement.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
