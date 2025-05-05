using Abp.Authorization;
using Abp.Runtime.Session;
using EventManagement.Configuration.Dto;
using System.Threading.Tasks;

namespace EventManagement.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : EventManagementAppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
