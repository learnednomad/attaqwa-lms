import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { CoolifyClient } from '../utils/coolify-client.js';
import { GetLogsInputSchema } from '../types/index.js';

export function createMonitoringTools(client: CoolifyClient): Tool[] {
  return [
    {
      name: 'get_logs',
      description:
        'Get logs from an application or database. Can filter by time range or tail recent lines.',
      inputSchema: {
        type: 'object',
        properties: {
          resourceId: {
            type: 'string',
            description: 'Application or database ID',
          },
          since: {
            type: 'string',
            description: 'Start timestamp in ISO 8601 format (e.g., 2024-01-01T00:00:00Z)',
          },
          tail: {
            type: 'number',
            description: 'Number of lines from the end (e.g., 100 for last 100 lines)',
          },
          follow: {
            type: 'boolean',
            description: 'Stream logs in real-time (use with caution)',
          },
        },
        required: ['resourceId'],
      },
    },
    {
      name: 'health_check',
      description: 'Check the health status of the Coolify instance',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'get_deployment_status',
      description: 'Get the current status of a deployment including logs',
      inputSchema: {
        type: 'object',
        properties: {
          deploymentId: {
            type: 'string',
            description: 'The ID of the deployment',
          },
        },
        required: ['deploymentId'],
      },
    },
    {
      name: 'get_application_status',
      description: 'Get comprehensive status information about an application',
      inputSchema: {
        type: 'object',
        properties: {
          applicationId: {
            type: 'string',
            description: 'The ID of the application',
          },
        },
        required: ['applicationId'],
      },
    },
    {
      name: 'get_database_status',
      description: 'Get comprehensive status information about a database',
      inputSchema: {
        type: 'object',
        properties: {
          databaseId: {
            type: 'string',
            description: 'The ID of the database',
          },
        },
        required: ['databaseId'],
      },
    },
  ];
}

export async function handleMonitoringTool(
  name: string,
  args: any,
  client: CoolifyClient
): Promise<any> {
  switch (name) {
    case 'get_logs': {
      const validated = GetLogsInputSchema.parse(args);
      return await client.getLogs({
        resourceId: validated.resourceId,
        since: validated.since,
        tail: validated.tail,
      });
    }

    case 'health_check':
      return await client.healthCheck();

    case 'get_deployment_status': {
      const deployment = await client.getDeployment(args.deploymentId);
      return {
        deployment,
        isComplete: ['success', 'failed', 'cancelled'].includes(deployment.status),
        isSuccessful: deployment.status === 'success',
        logs: deployment.deployment_logs,
      };
    }

    case 'get_application_status': {
      const application = await client.getApplication(args.applicationId);
      const recentDeployments = await client.listDeployments(args.applicationId);
      return {
        application,
        status: application.status,
        isRunning: application.status === 'running',
        recentDeployments: recentDeployments.slice(0, 5),
        lastDeployment: recentDeployments[0],
      };
    }

    case 'get_database_status': {
      const database = await client.getDatabase(args.databaseId);
      return {
        database,
        status: database.status,
        isRunning: database.status === 'running',
        connectionUrl: database.internal_db_url,
      };
    }

    default:
      throw new Error(`Unknown monitoring tool: ${name}`);
  }
}
