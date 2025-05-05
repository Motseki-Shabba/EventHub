using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace EventManagement.Controllers
{
    public abstract class EventManagementControllerBase : AbpController
    {
        protected EventManagementControllerBase()
        {
            LocalizationSourceName = EventManagementConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
