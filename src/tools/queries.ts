import { NinjaOneClient } from '../client.js';
import { clean } from '../utils.js';
import { ToolDef } from './types.js';

const basePaginationProps = {
  df: { type: 'string', description: 'Device filter expression' },
  pageSize: { type: 'number', description: 'Max results to return' },
  cursor: { type: 'string', description: 'Pagination cursor from previous response' },
};

function queryTool(
  name: string,
  description: string,
  path: string,
  extraProps: Record<string, unknown> = {},
): ToolDef {
  return {
    tool: {
      name,
      description,
      inputSchema: {
        type: 'object',
        properties: { ...basePaginationProps, ...extraProps },
      },
    },
    handler: async (args, client: NinjaOneClient) => client.get(path, clean(args)),
  };
}

export const queryTools: ToolDef[] = [
  queryTool(
    'ninja_query_antivirus_status',
    'Query antivirus product status across all managed devices.',
    '/queries/antivirus-status',
  ),
  queryTool(
    'ninja_query_antivirus_threats',
    'Query antivirus threats detected across all managed devices.',
    '/queries/antivirus-threats',
  ),
  queryTool(
    'ninja_query_device_health',
    'Query device health status report (online/offline, alerts, patch compliance).',
    '/queries/device-health',
  ),
  queryTool(
    'ninja_query_os_patches',
    'Query pending, failed, or rejected OS patches across all managed devices.',
    '/queries/os-patches',
    {
      status: {
        type: 'string',
        description: 'Filter by patch status: PENDING, FAILED, REJECTED, APPROVED',
      },
      type: { type: 'string', description: 'Filter by patch type' },
    },
  ),
  queryTool(
    'ninja_query_software_patches',
    'Query pending, failed, or rejected software patches across all managed devices.',
    '/queries/software-patches',
    {
      status: { type: 'string', description: 'Filter by patch status' },
      productIdentifier: { type: 'string', description: 'Filter by software product identifier' },
      impact: { type: 'string', description: 'Filter by impact level' },
      type: { type: 'string', description: 'Filter by patch type' },
    },
  ),
  queryTool(
    'ninja_query_installed_os_patches',
    'Query OS patch install history across all managed devices.',
    '/queries/os-patch-installs',
    {
      status: { type: 'string', description: 'Filter by install status' },
      installedBefore: { type: 'string', description: 'Filter patches installed before this date' },
      installedAfter: { type: 'string', description: 'Filter patches installed after this date' },
    },
  ),
  queryTool(
    'ninja_query_installed_software_patches',
    'Query software patch install history across all managed devices.',
    '/queries/software-patch-installs',
    {
      status: { type: 'string', description: 'Filter by install status' },
      installedBefore: { type: 'string', description: 'Filter patches installed before this date' },
      installedAfter: { type: 'string', description: 'Filter patches installed after this date' },
    },
  ),
  queryTool(
    'ninja_query_software',
    'Query software inventory across all managed devices.',
    '/queries/software',
    {
      name: { type: 'string', description: 'Filter by software name (partial match)' },
    },
  ),
  queryTool(
    'ninja_query_logged_on_users',
    'Query the last logged-on user across all managed devices.',
    '/queries/logged-on-users',
  ),
  queryTool(
    'ninja_query_computer_systems',
    'Query computer system hardware information (make, model, serial number) across all devices.',
    '/queries/computer-systems',
  ),
  queryTool(
    'ninja_query_operating_systems',
    'Query operating system details (name, version, build) across all devices.',
    '/queries/operating-systems',
  ),
  queryTool(
    'ninja_query_network_interfaces',
    'Query network interface information (IPs, MACs, adapters) across all devices.',
    '/queries/network-interfaces',
  ),
  queryTool(
    'ninja_query_disks',
    'Query physical disk drive information across all devices.',
    '/queries/disks',
  ),
  queryTool(
    'ninja_query_volumes',
    'Query disk volume information (capacity, free space) across all devices.',
    '/queries/volumes',
  ),
  queryTool(
    'ninja_query_windows_services',
    'Query Windows service status across all managed devices.',
    '/queries/windows-services',
    {
      name: { type: 'string', description: 'Filter by service name' },
      state: { type: 'string', description: 'Filter by service state (RUNNING, STOPPED, etc.)' },
    },
  ),
  queryTool(
    'ninja_query_custom_fields',
    'Query custom field values across all devices and organizations.',
    '/queries/custom-fields',
    {
      fields: {
        type: 'string',
        description: 'Comma-separated list of field names to include',
      },
      updatedAfter: {
        type: 'number',
        description: 'Return fields updated after this epoch timestamp (seconds)',
      },
      withInheritance: {
        type: 'boolean',
        description: 'Include inherited values',
      },
      scopes: {
        type: 'string',
        description: 'Comma-separated entity scopes to filter by',
      },
    },
  ),
  queryTool(
    'ninja_query_processors',
    'Query CPU/processor information across all managed devices.',
    '/queries/processors',
  ),
  queryTool(
    'ninja_query_backup_usage',
    'Query backup storage usage across all managed devices.',
    '/queries/backup/usage',
  ),
];
