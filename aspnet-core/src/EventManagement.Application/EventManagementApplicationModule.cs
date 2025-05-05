using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using EventManagement.Authorization;

namespace EventManagement;

[DependsOn(
    typeof(EventManagementCoreModule),
    typeof(AbpAutoMapperModule))]
public class EventManagementApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<EventManagementAuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(EventManagementApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            // Scan the assembly for classes which inherit from AutoMapper.Profile
            cfg => cfg.AddMaps(thisAssembly)
        );
    }
}
