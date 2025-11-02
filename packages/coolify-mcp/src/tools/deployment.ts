import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { CoolifyClient } from '../utils/coolify-client.js';
import { DeployApplicationInputSchema } from '../types/index.js';

export function createDeploymentTools(client: CoolifyClient): Tool[] {
  return [
    {
      name: 'list_applications',
      description: 'List all applications in Coolify. Optionally filter by environment ID.',
      inputSchema: {
        type: 'object',
        properties: {
          environmentId: {
            type: 'string',
            description: 'Optional environment ID to filter applications',
          },
        },
      },
    },
    {
      name: 'get_application',
      description: 'Get detailed information about a specific application',
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
      name: 'deploy_application',
      description:
        'Deploy an application to Coolify. Can force deployment or deploy specific commit.',
      inputSchema: {
        type: 'object',
        properties: {
          applicationId: {
            type: 'string',
            description: 'The ID of the application to deploy',
          },
          force: {
            type: 'boolean',
            description: 'Force deployment even if no changes detected',
          },
          commitSha: {
            type: 'string',
            description: 'Specific commit SHA to deploy',
          },
        },
        required: ['applicationId'],
      },
    },
    {
      name: 'restart_application',
      description: 'Restart a running application',
      inputSchema: {
        type: 'object',
        properties: {
          applicationId: {
            type: 'string',
            description: 'The ID of the application to restart',
          },
        },
        required: ['applicationId'],
      },
    },
    {
      name: 'stop_application',
      description: 'Stop a running application',
      inputSchema: {
        type: 'object',
        properties: {
          applicationId: {
            type: 'string',
            description: 'The ID of the application to stop',
          },
        },
        required: ['applicationId'],
      },
    },
    {
      name: 'start_application',
      description: 'Start a stopped application',
      inputSchema: {
        type: 'object',
        properties: {
          applicationId: {
            type: 'string',
            description: 'The ID of the application to start',
          },
        },
        required: ['applicationId'],
      },
    },
    {
      name: 'list_deployments',
      description: 'List all deployments for an application',
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
      name: 'get_deployment',
      description: 'Get detailed information about a specific deployment',
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
      name: 'cancel_deployment',
      description: 'Cancel an in-progress deployment',
      inputSchema: {
        type: 'object',
        properties: {
          deploymentId: {
            type: 'string',
            description: 'The ID of the deployment to cancel',
          },
        },
        required: ['deploymentId'],
      },
    },
  ];
}

export async function handleDeploymentTool(
  name: string,
  args: any,
  client: CoolifyClient
): Promise<any> {
  switch (name) {
    case 'list_applications':
      return await client.listApplications(args.environmentId);

    case 'get_application':
      return await client.getApplication(args.applicationId);

    case 'deploy_application': {
      const validated = DeployApplicationInputSchema.parse(args);
      return await client.deployApplication(
        validated.applicationId,
        validated.force,
        validated.commitSha
      );
    }

    case 'restart_application':
      return await client.restartApplication(args.applicationId);

    case 'stop_application':
      return await client.stopApplication(args.applicationId);

    case 'start_application':
      return await client.startApplication(args.applicationId);

    case 'list_deployments':
      return await client.listDeployments(args.applicationId);

    case 'get_deployment':
      return await client.getDeployment(args.deploymentId);

    case 'cancel_deployment':
      return await client.cancelDeployment(args.deploymentId);

    default:
      throw new Error(`Unknown deployment tool: ${name}`);
  }
}
