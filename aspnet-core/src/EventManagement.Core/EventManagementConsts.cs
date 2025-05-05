using EventManagement.Debugging;

namespace EventManagement;

public class EventManagementConsts
{
    public const string LocalizationSourceName = "EventManagement";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = true;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "029b1215332641c480309866e599a126";
}
