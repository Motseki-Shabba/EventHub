using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using EventManagement.EntityFrameworkCore;
using EventManagement.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace EventManagement.Web.Tests;

[DependsOn(
    typeof(EventManagementWebMvcModule),
    typeof(AbpAspNetCoreTestBaseModule)
)]
public class EventManagementWebTestModule : AbpModule
{
    public EventManagementWebTestModule(EventManagementEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
    }

    public override void PreInitialize()
    {
        Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(EventManagementWebTestModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        IocManager.Resolve<ApplicationPartManager>()
            .AddApplicationPartsIfNotAddedBefore(typeof(EventManagementWebMvcModule).Assembly);
    }
}