import { NinjaOneClient } from '../client.js';
import { clean } from '../utils.js';
import { ToolDef } from './types.js';

export const deviceTools: ToolDef[] = [
  {
    tool: {
      name: 'ninja_list_devices',
      description:
        'List all managed devices. Use df for device filter expressions (e.g. "org = 1", "status = APPROVED"). Paginate with pageSize and after (last device ID).',
      inputSchema: {
        type: 'object',
        properties: {
          df: { type: 'string', description: 'Device filter expression' },
          pageSize: { type: 'number', description: 'Max devices to return' },
          after: { type: 'number', description: 'Last device ID for pagination cursor' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) => client.get('/devices', clean(args)),
  },
  {
    tool: {
      name: 'ninja_get_device',
      description: 'Get full details for a single device by ID.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) => client.get(`/device/${id}`),
  },
  {
    tool: {
      name: 'ninja_get_devices_detailed',
      description: 'List all devices with detailed information including custom fields and policy assignments.',
      inputSchema: {
        type: 'object',
        properties: {
          df: { type: 'string', description: 'Device filter expression' },
          pageSize: { type: 'number', description: 'Max devices to return' },
          after: { type: 'number', description: 'Last device ID for pagination cursor' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) => client.get('/devices-detailed', clean(args)),
  },
  {
    tool: {
      name: 'ninja_search_devices',
      description: 'Search for devices by name, serial number, hostname, or other attributes.',
      inputSchema: {
        type: 'object',
        properties: {
          q: { type: 'string', description: 'Search query string' },
          limit: { type: 'number', description: 'Max results to return' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) => client.get('/devices/search', clean(args)),
  },
  {
    tool: {
      name: 'ninja_update_device',
      description: 'Update device settings such as display name, location, role, or policy.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          displayName: { type: 'string', description: 'Device display name' },
          locationId: { type: 'number', description: 'Location ID to assign' },
          nodeRoleId: { type: 'number', description: 'Node role ID to assign' },
          policyId: { type: 'number', description: 'Policy ID to assign' },
          organizationId: { type: 'number', description: 'Organization ID to move device to' },
        },
      },
    },
    handler: async ({ id, ...body }, client: NinjaOneClient) => client.patch(`/device/${id}`, body),
  },
  {
    tool: {
      name: 'ninja_get_device_activities',
      description: 'Get activity log for a specific device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          pageSize: { type: 'number', description: 'Max activities to return (default 200, max 1000)' },
          newerThan: { type: 'number', description: 'Return activities with ID newer than this value' },
          olderThan: { type: 'number', description: 'Return activities with ID older than this value' },
          lang: { type: 'string', description: 'Language tag (e.g. en)' },
        },
      },
    },
    handler: async ({ id, ...params }, client: NinjaOneClient) =>
      client.get(`/device/${id}/activities`, clean(params)),
  },
  {
    tool: {
      name: 'ninja_get_device_alerts',
      description: 'Get active alerts for a specific device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          lang: { type: 'string', description: 'Language tag for localized messages' },
          tz: { type: 'string', description: 'Time zone for timestamps' },
        },
      },
    },
    handler: async ({ id, ...params }, client: NinjaOneClient) =>
      client.get(`/device/${id}/alerts`, clean(params)),
  },
  {
    tool: {
      name: 'ninja_get_device_software',
      description: 'Get installed software on a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) => client.get(`/device/${id}/software`),
  },
  {
    tool: {
      name: 'ninja_get_device_os_patches',
      description: 'Get pending, failed, or rejected OS patches for a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          status: { type: 'string', description: 'Filter by status: PENDING, FAILED, REJECTED, APPROVED' },
          type: { type: 'string', description: 'Filter by patch type' },
        },
      },
    },
    handler: async ({ id, ...params }, client: NinjaOneClient) =>
      client.get(`/device/${id}/os-patches`, clean(params)),
  },
  {
    tool: {
      name: 'ninja_get_device_installed_os_patches',
      description: 'Get OS patch install history for a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          status: { type: 'string', description: 'Filter by install status' },
          installedBefore: { type: 'string', description: 'Filter patches installed before this date' },
          installedAfter: { type: 'string', description: 'Filter patches installed after this date' },
        },
      },
    },
    handler: async ({ id, ...params }, client: NinjaOneClient) =>
      client.get(`/device/${id}/os-patch-installs`, clean(params)),
  },
  {
    tool: {
      name: 'ninja_get_device_software_patches',
      description: 'Get pending, failed, or rejected software patches for a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          status: { type: 'string', description: 'Filter by status' },
          productIdentifier: { type: 'string', description: 'Filter by software product identifier' },
          type: { type: 'string', description: 'Filter by patch type' },
          impact: { type: 'string', description: 'Filter by impact level' },
        },
      },
    },
    handler: async ({ id, ...params }, client: NinjaOneClient) =>
      client.get(`/device/${id}/software-patches`, clean(params)),
  },
  {
    tool: {
      name: 'ninja_get_device_installed_software_patches',
      description: 'Get software patch install history for a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          status: { type: 'string', description: 'Filter by install status' },
          installedBefore: { type: 'string', description: 'Filter patches installed before this date' },
          installedAfter: { type: 'string', description: 'Filter patches installed after this date' },
        },
      },
    },
    handler: async ({ id, ...params }, client: NinjaOneClient) =>
      client.get(`/device/${id}/software-patch-installs`, clean(params)),
  },
  {
    tool: {
      name: 'ninja_get_device_volumes',
      description: 'Get disk volume information for a device (capacity, free space, filesystem type).',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) => client.get(`/device/${id}/volumes`),
  },
  {
    tool: {
      name: 'ninja_get_device_disks',
      description: 'Get physical disk drive information for a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) => client.get(`/device/${id}/disks`),
  },
  {
    tool: {
      name: 'ninja_get_device_network_interfaces',
      description: 'Get network interface information for a device (IP addresses, MAC addresses, adapter type).',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) => client.get(`/device/${id}/network-interfaces`),
  },
  {
    tool: {
      name: 'ninja_get_device_processors',
      description: 'Get CPU/processor information for a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) => client.get(`/device/${id}/processors`),
  },
  {
    tool: {
      name: 'ninja_get_device_windows_services',
      description: 'Get Windows services and their current status for a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          name: { type: 'string', description: 'Filter by service name' },
          state: { type: 'string', description: 'Filter by state (RUNNING, STOPPED, PAUSED, etc.)' },
        },
      },
    },
    handler: async ({ id, ...params }, client: NinjaOneClient) =>
      client.get(`/device/${id}/windows-services`, clean(params)),
  },
  {
    tool: {
      name: 'ninja_get_device_last_logged_on_user',
      description: 'Get the last user who logged on to a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) =>
      client.get(`/device/${id}/last-logged-on-user`),
  },
  {
    tool: {
      name: 'ninja_get_device_active_jobs',
      description: 'Get currently running jobs on a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) => client.get(`/device/${id}/jobs`),
  },
  {
    tool: {
      name: 'ninja_get_device_dashboard_url',
      description: 'Get the direct URL to open a device in the NinjaOne web dashboard.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) => client.get(`/device/${id}/dashboard-url`),
  },
  {
    tool: {
      name: 'ninja_get_device_scripting_options',
      description: 'Get available scripts and built-in actions that can be run on a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          lang: { type: 'string', description: 'Language tag for localized display names' },
        },
      },
    },
    handler: async ({ id, ...params }, client: NinjaOneClient) =>
      client.get(`/device/${id}/scripting/options`, clean(params)),
  },
  {
    tool: {
      name: 'ninja_get_device_custom_fields',
      description: 'Get custom field values assigned to a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          withInheritance: {
            type: 'boolean',
            description: 'Include inherited custom field values from org/location',
          },
        },
      },
    },
    handler: async ({ id, ...params }, client: NinjaOneClient) =>
      client.get(`/device/${id}/custom-fields`, clean(params)),
  },
  {
    tool: {
      name: 'ninja_update_device_custom_fields',
      description: 'Update custom field values for a device.',
      inputSchema: {
        type: 'object',
        required: ['id', 'fields'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          fields: {
            type: 'object',
            description: 'Key-value pairs of custom field names to their new values',
            additionalProperties: true,
          },
        },
      },
    },
    handler: async ({ id, fields }, client: NinjaOneClient) =>
      client.patch(`/device/${id}/custom-fields`, fields),
  },
  {
    tool: {
      name: 'ninja_reboot_device',
      description: 'Reboot a device. NORMAL performs a graceful restart; FORCED immediately reboots without waiting for running processes.',
      inputSchema: {
        type: 'object',
        required: ['id', 'mode'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          mode: {
            type: 'string',
            enum: ['NORMAL', 'FORCED'],
            description: 'Reboot mode: NORMAL (graceful) or FORCED (immediate)',
          },
          reason: { type: 'string', description: 'Reason for the reboot (recorded in activity log)' },
        },
      },
    },
    handler: async ({ id, mode, reason }, client: NinjaOneClient) =>
      client.post(`/device/${id}/reboot/${mode}`, reason ? { reason } : undefined),
  },
  {
    tool: {
      name: 'ninja_run_script',
      description: 'Run a custom script or built-in action on a device. Use ninja_get_device_scripting_options to see what is available.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          type: {
            type: 'string',
            enum: ['ACTION', 'SCRIPT'],
            description: 'Run a built-in ACTION or a custom SCRIPT',
          },
          scriptId: { type: 'number', description: 'Script ID (use when type=SCRIPT)' },
          uid: { type: 'string', description: 'Built-in action UID (use when type=ACTION)' },
          parameters: { type: 'string', description: 'Parameters to pass to the script/action' },
          runAs: { type: 'string', description: 'Credential role to run the script as' },
        },
      },
    },
    handler: async ({ id, scriptId, ...body }, client: NinjaOneClient) =>
      client.post(`/device/${id}/script/run`, { ...body, id: scriptId }),
  },
  {
    tool: {
      name: 'ninja_submit_os_patch_scan',
      description: 'Trigger an OS patch scan on a device to refresh its pending patch list.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) =>
      client.post(`/device/${id}/patch/os/scan`),
  },
  {
    tool: {
      name: 'ninja_submit_os_patch_apply',
      description: 'Apply OS patches on a device. Omit patchIds to apply all approved pending patches.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          patchIds: {
            type: 'array',
            items: { type: 'number' },
            description: 'Specific patch IDs to apply (omit to apply all approved pending patches)',
          },
        },
      },
    },
    handler: async ({ id, patchIds }, client: NinjaOneClient) =>
      client.post(`/device/${id}/patch/os/apply`, patchIds ? { patchIds } : undefined),
  },
  {
    tool: {
      name: 'ninja_submit_software_patch_scan',
      description: 'Trigger a software patch scan on a device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) =>
      client.post(`/device/${id}/patch/software/scan`),
  },
  {
    tool: {
      name: 'ninja_submit_software_patch_apply',
      description: 'Apply software patches on a device. Omit patchIds to apply all approved pending patches.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
          patchIds: {
            type: 'array',
            items: { type: 'number' },
            description: 'Specific patch IDs to apply (omit to apply all approved pending patches)',
          },
        },
      },
    },
    handler: async ({ id, patchIds }, client: NinjaOneClient) =>
      client.post(`/device/${id}/patch/software/apply`, patchIds ? { patchIds } : undefined),
  },
  {
    tool: {
      name: 'ninja_approve_devices',
      description: 'Approve or reject devices that are pending approval.',
      inputSchema: {
        type: 'object',
        required: ['mode', 'deviceIds'],
        properties: {
          mode: {
            type: 'string',
            enum: ['APPROVE', 'REJECT'],
            description: 'Approval action to take',
          },
          deviceIds: {
            type: 'array',
            items: { type: 'number' },
            description: 'Device IDs to approve or reject',
          },
        },
      },
    },
    handler: async ({ mode, deviceIds }, client: NinjaOneClient) =>
      client.post(`/devices/approval/${mode}`, { devices: deviceIds }),
  },
];
