using Abp.Modules;
using Abp.Reflection.Extensions;
using EventManagement.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace EventManagement.Web.Host.Startup
{
    [DependsOn(
       typeof(EventManagementWebCoreModule))]
    public class EventManagementWebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public EventManagementWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(EventManagementWebHostModule).GetAssembly());
        }
    }
}
