import { z } from 'zod';

// Coolify API Response Types
export interface CoolifyApplication {
  id: string;
  name: string;
  description?: string;
  git_repository?: string;
  git_branch?: string;
  build_pack?: string;
  status: 'running' | 'stopped' | 'restarting' | 'exited' | 'error';
  domains?: string[];
  environment_id: string;
  created_at: string;
  updated_at: string;
}

export interface CoolifyDatabase {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'mongodb' | 'redis' | 'mariadb';
  version?: string;
  status: 'running' | 'stopped' | 'error';
  environment_id: string;
  internal_db_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CoolifyEnvironmentVariable {
  id: string;
  key: string;
  value: string;
  is_secret: boolean;
  is_build_time: boolean;
  is_preview: boolean;
  resource_id: string;
  created_at: string;
}

export interface CoolifyDeployment {
  id: string;
  application_id: string;
  status: 'queued' | 'in_progress' | 'success' | 'failed' | 'cancelled';
  commit_sha?: string;
  commit_message?: string;
  started_at?: string;
  finished_at?: string;
  deployment_logs?: string;
}

export interface CoolifyProject {
  id: string;
  name: string;
  description?: string;
  team_id: string;
  environments: CoolifyEnvironment[];
  created_at: string;
}

export interface CoolifyEnvironment {
  id: string;
  name: string;
  project_id: string;
  created_at: string;
}

export interface CoolifyTeam {
  id: string;
  name: string;
  personal_team: boolean;
  created_at: string;
}

// Zod Schemas for Validation
export const ApplicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  git_repository: z.string().optional(),
  git_branch: z.string().optional(),
  build_pack: z.string().optional(),
  status: z.enum(['running', 'stopped', 'restarting', 'exited', 'error']),
  domains: z.array(z.string()).optional(),
  environment_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const DatabaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['postgresql', 'mysql', 'mongodb', 'redis', 'mariadb']),
  version: z.string().optional(),
  status: z.enum(['running', 'stopped', 'error']),
  environment_id: z.string(),
  internal_db_url: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const EnvironmentVariableSchema = z.object({
  id: z.string(),
  key: z.string(),
  value: z.string(),
  is_secret: z.boolean(),
  is_build_time: z.boolean(),
  is_preview: z.boolean(),
  resource_id: z.string(),
  created_at: z.string(),
});

export const DeploymentSchema = z.object({
  id: z.string(),
  application_id: z.string(),
  status: z.enum(['queued', 'in_progress', 'success', 'failed', 'cancelled']),
  commit_sha: z.string().optional(),
  commit_message: z.string().optional(),
  started_at: z.string().optional(),
  finished_at: z.string().optional(),
  deployment_logs: z.string().optional(),
});

// Tool Input Schemas
export const DeployApplicationInputSchema = z.object({
  applicationId: z.string().describe('The ID of the application to deploy'),
  force: z.boolean().optional().describe('Force deployment even if no changes detected'),
  commitSha: z.string().optional().describe('Specific commit SHA to deploy'),
});

export const CreateDatabaseInputSchema = z.object({
  name: z.string().describe('Name for the database'),
  type: z.enum(['postgresql', 'mysql', 'mongodb', 'redis', 'mariadb']).describe('Database type'),
  version: z.string().optional().describe('Specific database version (e.g., "14", "8.0")'),
  environmentId: z.string().describe('Environment ID where database will be created'),
  instantDeploy: z.boolean().optional().describe('Deploy immediately after creation'),
});

export const SetEnvironmentVariableInputSchema = z.object({
  resourceId: z.string().describe('Application or database ID'),
  key: z.string().describe('Environment variable name'),
  value: z.string().describe('Environment variable value'),
  isSecret: z.boolean().optional().describe('Mark as secret (hidden in UI)'),
  isBuildTime: z.boolean().optional().describe('Available during build time'),
});

export const GetLogsInputSchema = z.object({
  resourceId: z.string().describe('Application or database ID'),
  since: z.string().optional().describe('Start timestamp (ISO 8601 format)'),
  tail: z.number().optional().describe('Number of lines from the end'),
  follow: z.boolean().optional().describe('Stream logs in real-time'),
});

export const BackupDatabaseInputSchema = z.object({
  databaseId: z.string().describe('Database ID to backup'),
  frequency: z.string().optional().describe('Backup frequency (e.g., "daily", "weekly")'),
  s3Storage: z.object({
    bucket: z.string(),
    region: z.string(),
    accessKey: z.string(),
    secretKey: z.string(),
  }).optional().describe('S3 storage configuration for backups'),
});

export type DeployApplicationInput = z.infer<typeof DeployApplicationInputSchema>;
export type CreateDatabaseInput = z.infer<typeof CreateDatabaseInputSchema>;
export type SetEnvironmentVariableInput = z.infer<typeof SetEnvironmentVariableInputSchema>;
export type GetLogsInput = z.infer<typeof GetLogsInputSchema>;
export type BackupDatabaseInput = z.infer<typeof BackupDatabaseInputSchema>;
