-- 
-- Author: Matticusau
-- Purpose: Provides CPU performance data from Extended Events System Health Session
-- 
--          It is possible for the sum of idle and process utilisation to be greater than 100%
--          There is a known behaviour and it occurs at a low level function (I believe within Windows) which is prone to drift under certain circumstances. 
--          Personally I believe this is more likely in Hyperthreading scenarios. That said, it is only under certain scenarios and due to the way the usage 
--          metrics are accumulated as switching occurs between fibres in the quantum switch. 
--          The solution which is typically adopted is to normalise the values using the following queries to ensure that values are never >100.
--          NormalizedProcessUtilization = ProcessUtilization*100/(ProcessUtilization + SystemIdle)
--          NormalizedSystemIdle = SystemIdle *100/(ProcessUtilization + SystemIdle)
--          NormalizedSum = NormalizedProcessUtilization + NormalizedSystemIdle
-- 
-- License: https://github.com/Matticusau/sqlops-mssql-instance-insights/blob/master/LICENSE
-- Credit to: https://troubleshootingsql.com/2009/12/30/how-to-find-out-the-cpu-usage-information-for-the-sql-server-process-using-ring-buffers/
--            https://www.sqlskills.com/blogs/glenn/sql-server-diagnostic-information-queries-detailed-day-16/
--            https://dba.stackexchange.com/questions/148725/why-is-the-processor-different-in-activity-monitor-vs-resource-monitor
--            http://www.sqlserver-dba.com/2015/10/how-to-understand-the-ring_buffer_schedule_monitor.html
-- 

DECLARE @processorGHz float = (SELECT 1.0*cpu_ticks/ms_ticks/(1000000) FROM sys.dm_os_sys_info); -- divided by 1 million as that is 1 billion (GHz) divided by 1000 (ms/s)
DECLARE @ts_now bigint = (SELECT ms_ticks from sys.dm_os_sys_info); --cpu_ticks/(cpu_ticks/ms_ticks) reduces to just ms_ticks. 1/(1/x)=x
DECLARE @processors int = (SELECT cpu_count from sys.dm_os_sys_info);
DECLARE @qs datetime = GETDATE();
-- Top 60 : for the last hour
SELECT TOP(60)
    DATEADD(ms, -1 * (@ts_now - [timestamp]), @qs) AS [Snapshot Time],
    100 - SystemIdle as [Total CPU Burden (%)],
    COALESCE(CAST(
        NULLIF(CONVERT(decimal(18, 4), 100.0 * UMT / (@processorGHz * 1000000 * 60 * @processors)),0.0)
    as varchar(10)),'') as [SQL Server Userspace CPU Usage (%)],
    COALESCE(CAST(
        NULLIF(CONVERT(decimal(18, 4), 100.0 * KMT / (@processorGHz * 1000000 * 60 * @processors)),0.0)
    as varchar(10)),'') as [SQL Server Kernel CPU Usage (%)],
    COALESCE(CAST(
        NULLIF(
            CONVERT(decimal(18, 4), 
                100.0 * UMT / (@processorGHz * 1000000 * 60 * @processors) +
                100.0 * KMT / (@processorGHz * 1000000 * 60 * @processors)),0.0)
    as varchar(10)),'') as [Total CPU Usage by SQL Server (%)],
    SPU as [SQL Processor Usage (% trunc)],
    Mem as [Total System Physical Memory Used (%)]
FROM ( 
    SELECT
        record.value('(./Record/@id)[1]', 'int') AS record_id, 
        record.value('(./Record/SchedulerMonitorEvent/SystemHealth/SystemIdle)[1]', 'int') AS [SystemIdle], 
        record.value('(./Record/SchedulerMonitorEvent/SystemHealth/ProcessUtilization)[1]','int') AS [SPU],
        record.value('(./Record/SchedulerMonitorEvent/SystemHealth/UserModeTime)[1]','int') AS UMT,
        record.value('(./Record/SchedulerMonitorEvent/SystemHealth/KernelModeTime)[1]','int') AS KMT,
        record.value('(./Record/SchedulerMonitorEvent/SystemHealth/MemoryUtilization)[1]','int') AS Mem,
        [timestamp]
    FROM ( 
        SELECT
            [timestamp],
            CONVERT(xml, record) AS [record] 
        FROM sys.dm_os_ring_buffers 
        WHERE 
            ring_buffer_type = N'RING_BUFFER_SCHEDULER_MONITOR' AND
            (record LIKE '%<SystemHealth>%')
    ) AS x 
) AS y 
ORDER BY record_id DESC;


/* Alternative query to use  */


DECLARE @ts_now bigint = (SELECT cpu_ticks/(cpu_ticks/ms_ticks) FROM sys.dm_os_sys_info WITH (NOLOCK)); 

SELECT TOP(256) SQLProcessUtilization*100/(SQLProcessUtilization + SystemIdle) AS [SQL Server Process CPU Utilization], 
                SystemIdle *100/(SQLProcessUtilization + SystemIdle) AS [System Idle Process], 
                100 - (SystemIdle *100/(SQLProcessUtilization + SystemIdle)) - (SQLProcessUtilization*100/(SQLProcessUtilization + SystemIdle)) AS [Other Process CPU Utilization], 
                DATEADD(ms, -1 * (@ts_now - [timestamp]), GETDATE()) AS [Event Time] 
FROM (
    SELECT record.value('(./Record/@id)[1]', 'int') AS record_id, 
        record.value('(./Record/SchedulerMonitorEvent/SystemHealth/SystemIdle)[1]', 'int') AS [SystemIdle], 
        record.value('(./Record/SchedulerMonitorEvent/SystemHealth/ProcessUtilization)[1]', 'int') AS [SQLProcessUtilization], [timestamp] 
    FROM (
        SELECT [timestamp], CONVERT(xml, record) AS [record] 
        FROM sys.dm_os_ring_buffers WITH (NOLOCK)
        WHERE ring_buffer_type = N'RING_BUFFER_SCHEDULER_MONITOR' 
        AND record LIKE N'%<SystemHealth>%'
    ) AS x
) AS y 
ORDER BY record_id DESC OPTION (RECOMPILE);
