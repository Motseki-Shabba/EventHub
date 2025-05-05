using Abp.Application.Services;
using EventManagement.MultiTenancy.Dto;

namespace EventManagement.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

