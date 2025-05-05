using Abp.Authorization;
using EventManagement.Authorization.Roles;
using EventManagement.Authorization.Users;

namespace EventManagement.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
