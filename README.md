# NinjaOne MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for the [NinjaOne RMM platform](https://www.ninjaone.com). Gives Claude and other MCP clients direct access to your NinjaOne environment — query devices, manage alerts, run scripts, create tickets, and more.

## Features

- **75 tools** spanning all major NinjaOne API areas
- OAuth2 `client_credentials` authentication with automatic token refresh
- Pagination and device filter (`df`) support on all list endpoints
- Zero runtime dependencies beyond `axios` and the MCP SDK

## Prerequisites

- [Node.js](https://nodejs.org) 18 or later
- A NinjaOne account with API access
- OAuth2 API credentials (see [Obtaining Credentials](#obtaining-credentials))

## Obtaining Credentials

1. Log in to your NinjaOne portal and go to **Administration → Apps → API**
2. Click **Add** to create a new API application
3. Select **Client Credentials** as the authorization flow
4. Grant the scopes your use case requires:
   - `monitoring` — read-only device/alert data
   - `management` — manage devices, organizations, policies
   - `control` — run scripts, trigger patch jobs, reboot devices
5. Copy the **Client ID** and **Client Secret** — the secret is only shown once

Your instance base URL depends on your region:

| Region | Base URL |
|--------|----------|
| US | `https://app.ninjarmm.com` |
| EU | `https://eu.ninjarmm.com` |
| OC | `https://oc.ninjarmm.com` |
| CA | `https://ca.ninjarmm.com` |

## Installation

### Option 1 — Clone and build (recommended)

```bash
git clone https://github.com/Allied-Business-Solutions/ninjaone-mcp.git
cd ninjaone-mcp
npm install
npm run build
```

### Option 2 — Run directly with `tsx` (dev/testing)

```bash
git clone https://github.com/Allied-Business-Solutions/ninjaone-mcp.git
cd ninjaone-mcp
npm install
```

Then use `npm run dev` instead of `node dist/index.js` in the config below.

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NINJA_BASE_URL` | Yes | NinjaOne instance URL (e.g. `https://app.ninjarmm.com`) |
| `NINJA_CLIENT_ID` | Yes | OAuth2 client ID from the NinjaOne Developer Portal |
| `NINJA_CLIENT_SECRET` | Yes | OAuth2 client secret from the NinjaOne Developer Portal |

Create a `.env` file by copying the example:

```bash
cp .env.example .env
# then edit .env with your credentials
```

### Claude Desktop

Add the following to your `claude_desktop_config.json`:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ninjaone": {
      "command": "node",
      "args": ["/absolute/path/to/ninjaone-mcp/dist/index.js"],
      "env": {
        "NINJA_BASE_URL": "https://app.ninjarmm.com",
        "NINJA_CLIENT_ID": "your_client_id",
        "NINJA_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

Restart Claude Desktop after saving.

### Claude Code (CLI)

Add the server to your project or global MCP config:

```bash
claude mcp add ninjaone \
  -e NINJA_BASE_URL=https://app.ninjarmm.com \
  -e NINJA_CLIENT_ID=your_client_id \
  -e NINJA_CLIENT_SECRET=your_client_secret \
  -- node /absolute/path/to/ninjaone-mcp/dist/index.js
```

### Other MCP Clients

The server uses **stdio transport** and follows the standard MCP protocol. Point any MCP-compatible client at `node dist/index.js` with the three environment variables set.

## Available Tools

### Devices (30 tools)

| Tool | Description |
|------|-------------|
| `ninja_list_devices` | List all managed devices with optional device filter (`df`) and pagination |
| `ninja_get_device` | Get full details for a single device by ID |
| `ninja_get_devices_detailed` | List devices with detailed settings and policy assignments |
| `ninja_search_devices` | Search devices by name, hostname, or serial number |
| `ninja_update_device` | Update device display name, location, role, or policy |
| `ninja_get_device_activities` | Get the activity log for a device |
| `ninja_get_device_alerts` | Get active alerts on a device |
| `ninja_get_device_software` | List installed software on a device |
| `ninja_get_device_os_patches` | Get pending/failed/rejected OS patches |
| `ninja_get_device_installed_os_patches` | Get OS patch install history |
| `ninja_get_device_software_patches` | Get pending/failed/rejected software patches |
| `ninja_get_device_installed_software_patches` | Get software patch install history |
| `ninja_get_device_volumes` | Get disk volume info (capacity, free space, filesystem) |
| `ninja_get_device_disks` | Get physical disk drive info |
| `ninja_get_device_network_interfaces` | Get network adapters, IPs, and MAC addresses |
| `ninja_get_device_processors` | Get CPU/processor details |
| `ninja_get_device_windows_services` | Get Windows service status |
| `ninja_get_device_last_logged_on_user` | Get the last user who logged on |
| `ninja_get_device_active_jobs` | Get currently running jobs on a device |
| `ninja_get_device_dashboard_url` | Get the direct URL to a device in the NinjaOne dashboard |
| `ninja_get_device_scripting_options` | List scripts and actions available for a device |
| `ninja_get_device_custom_fields` | Get custom field values for a device |
| `ninja_update_device_custom_fields` | Update custom field values on a device |
| `ninja_reboot_device` | Reboot a device (NORMAL or FORCED mode) |
| `ninja_run_script` | Run a custom script or built-in action on a device |
| `ninja_submit_os_patch_scan` | Trigger an OS patch scan |
| `ninja_submit_os_patch_apply` | Apply OS patches |
| `ninja_submit_software_patch_scan` | Trigger a software patch scan |
| `ninja_submit_software_patch_apply` | Apply software patches |
| `ninja_approve_devices` | Approve or reject pending device registrations |

### Organizations (10 tools)

| Tool | Description |
|------|-------------|
| `ninja_list_organizations` | List all organizations (clients) with pagination |
| `ninja_get_organizations_detailed` | List organizations with full settings and policy mappings |
| `ninja_get_organization` | Get details for a specific organization |
| `ninja_create_organization` | Create a new organization |
| `ninja_update_organization` | Update an organization's name, description, or approval mode |
| `ninja_get_organization_devices` | List all devices in an organization |
| `ninja_get_organization_locations` | List all locations for an organization |
| `ninja_create_organization_location` | Create a new location for an organization |
| `ninja_get_organization_custom_fields` | Get custom field values for an organization |
| `ninja_get_organization_end_users` | Get end users associated with an organization |

### Alerts (2 tools)

| Tool | Description |
|------|-------------|
| `ninja_list_alerts` | Get all active alerts across all devices |
| `ninja_reset_alert` | Dismiss/reset an alert by UID, optionally adding a resolution note |

### Activities (1 tool)

| Tool | Description |
|------|-------------|
| `ninja_list_activities` | Query the system activity log with filters for class, date range, type, user, and device |

### Ticketing (12 tools)

| Tool | Description |
|------|-------------|
| `ninja_create_ticket` | Create a new support ticket |
| `ninja_get_ticket` | Get a ticket by ID |
| `ninja_update_ticket` | Update ticket status, assignee, severity, priority, or tags |
| `ninja_add_ticket_comment` | Add a public or private comment to a ticket |
| `ninja_get_ticket_log` | Get the change log for a ticket |
| `ninja_get_tickets_by_board` | Query tickets on a specific board |
| `ninja_list_boards` | List all ticketing boards |
| `ninja_list_ticket_statuses` | List all available ticket statuses |
| `ninja_list_ticket_forms` | List all ticket forms |
| `ninja_get_ticket_form` | Get details and fields for a specific ticket form |
| `ninja_list_ticketing_users` | List app users and contacts available in ticketing |
| `ninja_get_ticket_attributes` | Get custom attribute definitions for tickets |

### Queries / Reports (19 tools)

All query tools support `df` (device filter), `pageSize`, and `cursor` for pagination.

| Tool | Description |
|------|-------------|
| `ninja_query_antivirus_status` | AV product status across all devices |
| `ninja_query_antivirus_threats` | AV threats detected across all devices |
| `ninja_query_device_health` | Device health report (online/offline, alerts, patch compliance) |
| `ninja_query_os_patches` | Pending/failed/rejected OS patches fleet-wide |
| `ninja_query_software_patches` | Pending/failed/rejected software patches fleet-wide |
| `ninja_query_installed_os_patches` | OS patch install history fleet-wide |
| `ninja_query_installed_software_patches` | Software patch install history fleet-wide |
| `ninja_query_software` | Software inventory fleet-wide |
| `ninja_query_logged_on_users` | Last logged-on user fleet-wide |
| `ninja_query_computer_systems` | Hardware info (make, model, serial) fleet-wide |
| `ninja_query_operating_systems` | OS name, version, and build fleet-wide |
| `ninja_query_network_interfaces` | Network interface info fleet-wide |
| `ninja_query_disks` | Physical disk info fleet-wide |
| `ninja_query_volumes` | Disk volume info fleet-wide |
| `ninja_query_windows_services` | Windows service status fleet-wide |
| `ninja_query_custom_fields` | Custom field values fleet-wide |
| `ninja_query_processors` | CPU info fleet-wide |
| `ninja_query_backup_usage` | Backup storage usage fleet-wide |
| `ninja_query_policy_overrides` | Policy overrides fleet-wide |

### Policies (4 tools)

| Tool | Description |
|------|-------------|
| `ninja_list_policies` | List all policies |
| `ninja_get_device_policy_overrides` | Get policy overrides for a specific device |
| `ninja_query_policy_overrides` | Query policy overrides across all devices |
| `ninja_list_node_roles` | List all available device/node roles |

### Users (7 tools)

| Tool | Description |
|------|-------------|
| `ninja_list_users` | List all users (technicians and end users) |
| `ninja_list_technicians` | List all technician accounts |
| `ninja_get_technician` | Get a technician by ID |
| `ninja_list_end_users` | List all end users |
| `ninja_get_end_user` | Get an end user by ID |
| `ninja_list_user_roles` | List all user roles |
| `ninja_list_contacts` | List all contacts |

### Backup (2 tools)

| Tool | Description |
|------|-------------|
| `ninja_get_backup_jobs` | Get backup job history and status |
| `ninja_get_integrity_check_jobs` | Get backup integrity check results |

### System (10 tools)

| Tool | Description |
|------|-------------|
| `ninja_list_groups` | List all device groups |
| `ninja_get_group_device_ids` | Get device IDs for a specific group |
| `ninja_list_scheduled_tasks` | List all scheduled automation tasks |
| `ninja_list_automation_scripts` | List all automation scripts |
| `ninja_list_notification_channels` | List all configured notification channels |
| `ninja_list_custom_fields` | List all custom field definitions |
| `ninja_list_locations` | List all locations across all organizations |
| `ninja_list_software_products` | List all tracked software products |
| `ninja_configure_webhook` | Configure a webhook endpoint for NinjaOne events |
| `ninja_disable_webhook` | Disable the configured webhook |

## Device Filter Syntax

Many tools accept a `df` parameter for filtering devices. Examples:

```
org = 1                          # Devices in organization with ID 1
status = APPROVED                # Approved devices only
class in (WINDOWS_WORKSTATION, WINDOWS_SERVER)
location = 5 AND class = MAC
```

## Development

```bash
# Run in dev mode (no build step required)
npm run dev

# Type-check and compile
npm run build

# Start the compiled server
npm start
```

## Project Structure

```
src/
  index.ts          # MCP server entry point and request routing
  client.ts         # NinjaOne HTTP client with OAuth2 token management
  utils.ts          # Shared utilities
  tools/
    types.ts        # ToolDef interface
    index.ts        # Aggregates all tool arrays
    devices.ts      # Device management tools
    organizations.ts # Organization management tools
    alerts.ts       # Alert tools
    activities.ts   # Activity log tools
    ticketing.ts    # Ticketing tools
    queries.ts      # Fleet-wide query/report tools
    policies.ts     # Policy tools
    users.ts        # User management tools
    backup.ts       # Backup tools
    system.ts       # System/admin tools
```

## License

MIT
