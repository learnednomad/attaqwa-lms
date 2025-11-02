#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import { CoolifyClient } from './utils/coolify-client.js';
import {
  createDeploymentTools,
  handleDeploymentTool,
} from './tools/deployment.js';
import { createDatabaseTools, handleDatabaseTool } from './tools/database.js';
import {
  createEnvironmentTools,
  handleEnvironmentTool,
} from './tools/environment.js';
import {
  createMonitoringTools,
  handleMonitoringTool,
} from './tools/monitoring.js';

// Load environment variables
config();

// Validate required environment variables
const COOLIFY_URL = process.env.COOLIFY_URL;
const COOLIFY_API_TOKEN = process.env.COOLIFY_API_TOKEN;

if (!COOLIFY_URL || !COOLIFY_API_TOKEN) {
  console.error(
    'Error: COOLIFY_URL and COOLIFY_API_TOKEN environment variables are required'
  );
  console.error('Please set them in your .env file or environment');
  process.exit(1);
}

// Initialize Coolify client
const coolifyClient = new CoolifyClient({
  url: COOLIFY_URL,
  apiToken: COOLIFY_API_TOKEN,
  defaultProjectId: process.env.COOLIFY_DEFAULT_PROJECT_ID,
  defaultTeamId: process.env.COOLIFY_DEFAULT_TEAM_ID,
});

// Create MCP server
const server = new Server(
  {
    name: '@attaqwa/coolify-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Combine all tools
const allTools: Tool[] = [
  ...createDeploymentTools(coolifyClient),
  ...createDatabaseTools(coolifyClient),
  ...createEnvironmentTools(coolifyClient),
  ...createMonitoringTools(coolifyClient),
];

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allTools,
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: any;

    // Route to appropriate tool handler
    const deploymentTools = [
      'list_applications',
      'get_application',
      'deploy_application',
      'restart_application',
      'stop_application',
      'start_application',
      'list_deployments',
      'get_deployment',
      'cancel_deployment',
    ];

    const databaseTools = [
      'list_databases',
      'get_database',
      'create_database',
      'stop_database',
      'start_database',
      'backup_database',
    ];

    const environmentTools = [
      'list_environment_variables',
      'set_environment_variable',
      'delete_environment_variable',
      'list_projects',
      'get_project',
      'list_teams',
    ];

    const monitoringTools = [
      'get_logs',
      'health_check',
      'get_deployment_status',
      'get_application_status',
      'get_database_status',
    ];

    if (deploymentTools.includes(name)) {
      result = await handleDeploymentTool(name, args, coolifyClient);
    } else if (databaseTools.includes(name)) {
      result = await handleDatabaseTool(name, args, coolifyClient);
    } else if (environmentTools.includes(name)) {
      result = await handleEnvironmentTool(name, args, coolifyClient);
    } else if (monitoringTools.includes(name)) {
      result = await handleMonitoringTool(name, args, coolifyClient);
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: errorMessage,
              tool: name,
              args,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Error handling
server.onerror = (error) => {
  console.error('[MCP Error]', error);
};

process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Coolify MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
