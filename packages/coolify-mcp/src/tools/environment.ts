import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { CoolifyClient } from '../utils/coolify-client.js';
import { SetEnvironmentVariableInputSchema } from '../types/index.js';

export function createEnvironmentTools(client: CoolifyClient): Tool[] {
  return [
    {
      name: 'list_environment_variables',
      description:
        'List all environment variables for an application or database. Shows both regular and secret variables.',
      inputSchema: {
        type: 'object',
        properties: {
          resourceId: {
            type: 'string',
            description: 'Application or database ID',
          },
        },
        required: ['resourceId'],
      },
    },
    {
      name: 'set_environment_variable',
      description:
        'Set an environment variable for an application or database. Can mark as secret or build-time variable.',
      inputSchema: {
        type: 'object',
        properties: {
          resourceId: {
            type: 'string',
            description: 'Application or database ID',
          },
          key: {
            type: 'string',
            description: 'Environment variable name (e.g., DATABASE_URL, API_KEY)',
          },
          value: {
            type: 'string',
            description: 'Environment variable value',
          },
          isSecret: {
            type: 'boolean',
            description: 'Mark as secret (hidden in UI)',
          },
          isBuildTime: {
            type: 'boolean',
            description: 'Available during build time',
          },
        },
        required: ['resourceId', 'key', 'value'],
      },
    },
    {
      name: 'delete_environment_variable',
      description: 'Delete an environment variable from an application or database',
      inputSchema: {
        type: 'object',
        properties: {
          resourceId: {
            type: 'string',
            description: 'Application or database ID',
          },
          variableId: {
            type: 'string',
            description: 'Environment variable ID to delete',
          },
        },
        required: ['resourceId', 'variableId'],
      },
    },
    {
      name: 'list_projects',
      description: 'List all projects. Optionally filter by team ID.',
      inputSchema: {
        type: 'object',
        properties: {
          teamId: {
            type: 'string',
            description: 'Optional team ID to filter projects',
          },
        },
      },
    },
    {
      name: 'get_project',
      description: 'Get detailed information about a specific project including environments',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The ID of the project',
          },
        },
        required: ['projectId'],
      },
    },
    {
      name: 'list_teams',
      description: 'List all teams the user has access to',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
  ];
}

export async function handleEnvironmentTool(
  name: string,
  args: any,
  client: CoolifyClient
): Promise<any> {
  switch (name) {
    case 'list_environment_variables':
      return await client.listEnvironmentVariables(args.resourceId);

    case 'set_environment_variable': {
      const validated = SetEnvironmentVariableInputSchema.parse(args);
      return await client.setEnvironmentVariable({
        resourceId: validated.resourceId,
        key: validated.key,
        value: validated.value,
        isSecret: validated.isSecret,
        isBuildTime: validated.isBuildTime,
      });
    }

    case 'delete_environment_variable':
      return await client.deleteEnvironmentVariable(
        args.resourceId,
        args.variableId
      );

    case 'list_projects':
      return await client.listProjects(args.teamId);

    case 'get_project':
      return await client.getProject(args.projectId);

    case 'list_teams':
      return await client.listTeams();

    default:
      throw new Error(`Unknown environment tool: ${name}`);
  }
}
