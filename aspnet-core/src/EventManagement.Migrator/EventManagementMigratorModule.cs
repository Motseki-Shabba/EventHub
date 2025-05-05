using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using EventManagement.Configuration;
using EventManagement.EntityFrameworkCore;
using EventManagement.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;

namespace EventManagement.Migrator;

[DependsOn(typeof(EventManagementEntityFrameworkModule))]
public class EventManagementMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public EventManagementMigratorModule(EventManagementEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(EventManagementMigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            EventManagementConsts.ConnectionStringName
        );

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(
            typeof(IEventBus),
            () => IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            )
        );
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(EventManagementMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
