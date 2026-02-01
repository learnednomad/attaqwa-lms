import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { CoolifyClient } from '../utils/coolify-client.js';
import { CreateDatabaseInputSchema, BackupDatabaseInputSchema } from '../types/index.js';

export function createDatabaseTools(client: CoolifyClient): Tool[] {
  return [
    {
      name: 'list_databases',
      description: 'List all databases in Coolify. Optionally filter by environment ID.',
      inputSchema: {
        type: 'object',
        properties: {
          environmentId: {
            type: 'string',
            description: 'Optional environment ID to filter databases',
          },
        },
      },
    },
    {
      name: 'get_database',
      description: 'Get detailed information about a specific database',
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
    {
      name: 'create_database',
      description:
        'Create a new database instance in Coolify. Supports PostgreSQL, MySQL, MongoDB, Redis, and MariaDB.',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name for the database',
          },
          type: {
            type: 'string',
            enum: ['postgresql', 'mysql', 'mongodb', 'redis', 'mariadb'],
            description: 'Database type',
          },
          version: {
            type: 'string',
            description: 'Specific database version (e.g., "14", "8.0")',
          },
          environmentId: {
            type: 'string',
            description: 'Environment ID where database will be created',
          },
          instantDeploy: {
            type: 'boolean',
            description: 'Deploy immediately after creation',
          },
        },
        required: ['name', 'type', 'environmentId'],
      },
    },
    {
      name: 'stop_database',
      description: 'Stop a running database',
      inputSchema: {
        type: 'object',
        properties: {
          databaseId: {
            type: 'string',
            description: 'The ID of the database to stop',
          },
        },
        required: ['databaseId'],
      },
    },
    {
      name: 'start_database',
      description: 'Start a stopped database',
      inputSchema: {
        type: 'object',
        properties: {
          databaseId: {
            type: 'string',
            description: 'The ID of the database to start',
          },
        },
        required: ['databaseId'],
      },
    },
    {
      name: 'backup_database',
      description:
        'Create a backup of a database. Optionally configure S3 storage and backup frequency.',
      inputSchema: {
        type: 'object',
        properties: {
          databaseId: {
            type: 'string',
            description: 'Database ID to backup',
          },
          frequency: {
            type: 'string',
            description: 'Backup frequency (e.g., "daily", "weekly")',
          },
          s3Storage: {
            type: 'object',
            properties: {
              bucket: { type: 'string' },
              region: { type: 'string' },
              accessKey: { type: 'string' },
              secretKey: { type: 'string' },
            },
            description: 'S3 storage configuration for backups',
          },
        },
        required: ['databaseId'],
      },
    },
  ];
}

export async function handleDatabaseTool(
  name: string,
  args: any,
  client: CoolifyClient
): Promise<any> {
  switch (name) {
    case 'list_databases':
      return await client.listDatabases(args.environmentId);

    case 'get_database':
      return await client.getDatabase(args.databaseId);

    case 'create_database': {
      const validated = CreateDatabaseInputSchema.parse(args);
      return await client.createDatabase({
        name: validated.name,
        type: validated.type,
        version: validated.version,
        environmentId: validated.environmentId,
        instantDeploy: validated.instantDeploy,
      });
    }

    case 'stop_database':
      return await client.stopDatabase(args.databaseId);

    case 'start_database':
      return await client.startDatabase(args.databaseId);

    case 'backup_database': {
      const validated = BackupDatabaseInputSchema.parse(args);
      return await client.backupDatabase(validated.databaseId, {
        frequency: validated.frequency,
        s3Storage: validated.s3Storage,
      });
    }

    default:
      throw new Error(`Unknown database tool: ${name}`);
  }
}
