import {
  CoolifyApplication,
  CoolifyDatabase,
  CoolifyEnvironmentVariable,
  CoolifyDeployment,
  CoolifyProject,
  CoolifyTeam,
  ApplicationSchema,
  DatabaseSchema,
  EnvironmentVariableSchema,
  DeploymentSchema,
} from '../types/index.js';

export interface CoolifyConfig {
  url: string;
  apiToken: string;
  defaultProjectId?: string;
  defaultTeamId?: string;
}

export class CoolifyClient {
  private baseUrl: string;
  private apiToken: string;
  private headers: Record<string, string>;

  constructor(config: CoolifyConfig) {
    this.baseUrl = config.url.replace(/\/$/, '');
    this.apiToken = config.apiToken;
    this.headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Coolify API error (${response.status}): ${errorText}`
      );
    }

    return response.json() as Promise<T>;
  }

  // Team Operations
  async listTeams(): Promise<CoolifyTeam[]> {
    return this.request<CoolifyTeam[]>('/teams');
  }

  // Project Operations
  async listProjects(teamId?: string): Promise<CoolifyProject[]> {
    const endpoint = teamId ? `/teams/${teamId}/projects` : '/projects';
    return this.request<CoolifyProject[]>(endpoint);
  }

  async getProject(projectId: string): Promise<CoolifyProject> {
    return this.request<CoolifyProject>(`/projects/${projectId}`);
  }

  // Application Operations
  async listApplications(environmentId?: string): Promise<CoolifyApplication[]> {
    const endpoint = environmentId
      ? `/environments/${environmentId}/applications`
      : '/applications';
    const data = await this.request<CoolifyApplication[]>(endpoint);
    return data.map((app) => ApplicationSchema.parse(app));
  }

  async getApplication(applicationId: string): Promise<CoolifyApplication> {
    const data = await this.request<CoolifyApplication>(`/applications/${applicationId}`);
    return ApplicationSchema.parse(data);
  }

  async deployApplication(
    applicationId: string,
    force: boolean = false,
    commitSha?: string
  ): Promise<CoolifyDeployment> {
    const data = await this.request<CoolifyDeployment>(
      `/applications/${applicationId}/deploy`,
      {
        method: 'POST',
        body: JSON.stringify({ force, commit_sha: commitSha }),
      }
    );
    return DeploymentSchema.parse(data);
  }

  async restartApplication(applicationId: string): Promise<{ message: string }> {
    return this.request(`/applications/${applicationId}/restart`, {
      method: 'POST',
    });
  }

  async stopApplication(applicationId: string): Promise<{ message: string }> {
    return this.request(`/applications/${applicationId}/stop`, {
      method: 'POST',
    });
  }

  async startApplication(applicationId: string): Promise<{ message: string }> {
    return this.request(`/applications/${applicationId}/start`, {
      method: 'POST',
    });
  }

  // Database Operations
  async listDatabases(environmentId?: string): Promise<CoolifyDatabase[]> {
    const endpoint = environmentId
      ? `/environments/${environmentId}/databases`
      : '/databases';
    const data = await this.request<CoolifyDatabase[]>(endpoint);
    return data.map((db) => DatabaseSchema.parse(db));
  }

  async getDatabase(databaseId: string): Promise<CoolifyDatabase> {
    const data = await this.request<CoolifyDatabase>(`/databases/${databaseId}`);
    return DatabaseSchema.parse(data);
  }

  async createDatabase(params: {
    name: string;
    type: 'postgresql' | 'mysql' | 'mongodb' | 'redis' | 'mariadb';
    version?: string;
    environmentId: string;
    instantDeploy?: boolean;
  }): Promise<CoolifyDatabase> {
    const data = await this.request<CoolifyDatabase>('/databases', {
      method: 'POST',
      body: JSON.stringify({
        name: params.name,
        type: params.type,
        version: params.version,
        environment_id: params.environmentId,
        instant_deploy: params.instantDeploy ?? true,
      }),
    });
    return DatabaseSchema.parse(data);
  }

  async stopDatabase(databaseId: string): Promise<{ message: string }> {
    return this.request(`/databases/${databaseId}/stop`, {
      method: 'POST',
    });
  }

  async startDatabase(databaseId: string): Promise<{ message: string }> {
    return this.request(`/databases/${databaseId}/start`, {
      method: 'POST',
    });
  }

  async backupDatabase(
    databaseId: string,
    config?: {
      frequency?: string;
      s3Storage?: {
        bucket: string;
        region: string;
        accessKey: string;
        secretKey: string;
      };
    }
  ): Promise<{ message: string; backupId: string }> {
    return this.request(`/databases/${databaseId}/backup`, {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  // Environment Variable Operations
  async listEnvironmentVariables(resourceId: string): Promise<CoolifyEnvironmentVariable[]> {
    const data = await this.request<CoolifyEnvironmentVariable[]>(
      `/resources/${resourceId}/environment-variables`
    );
    return data.map((env) => EnvironmentVariableSchema.parse(env));
  }

  async setEnvironmentVariable(params: {
    resourceId: string;
    key: string;
    value: string;
    isSecret?: boolean;
    isBuildTime?: boolean;
  }): Promise<CoolifyEnvironmentVariable> {
    const data = await this.request<CoolifyEnvironmentVariable>(
      `/resources/${params.resourceId}/environment-variables`,
      {
        method: 'POST',
        body: JSON.stringify({
          key: params.key,
          value: params.value,
          is_secret: params.isSecret ?? false,
          is_build_time: params.isBuildTime ?? false,
        }),
      }
    );
    return EnvironmentVariableSchema.parse(data);
  }

  async deleteEnvironmentVariable(
    resourceId: string,
    variableId: string
  ): Promise<{ message: string }> {
    return this.request(
      `/resources/${resourceId}/environment-variables/${variableId}`,
      { method: 'DELETE' }
    );
  }

  // Deployment Operations
  async getDeployment(deploymentId: string): Promise<CoolifyDeployment> {
    const data = await this.request<CoolifyDeployment>(`/deployments/${deploymentId}`);
    return DeploymentSchema.parse(data);
  }

  async listDeployments(applicationId: string): Promise<CoolifyDeployment[]> {
    const data = await this.request<CoolifyDeployment[]>(
      `/applications/${applicationId}/deployments`
    );
    return data.map((deployment) => DeploymentSchema.parse(deployment));
  }

  async cancelDeployment(deploymentId: string): Promise<{ message: string }> {
    return this.request(`/deployments/${deploymentId}/cancel`, {
      method: 'POST',
    });
  }

  // Logs Operations
  async getLogs(params: {
    resourceId: string;
    since?: string;
    tail?: number;
  }): Promise<{ logs: string }> {
    const queryParams = new URLSearchParams();
    if (params.since) queryParams.append('since', params.since);
    if (params.tail) queryParams.append('tail', params.tail.toString());

    const query = queryParams.toString();
    const endpoint = `/resources/${params.resourceId}/logs${query ? `?${query}` : ''}`;

    return this.request<{ logs: string }>(endpoint);
  }

  // Health Check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; version?: string }> {
    return this.request('/health');
  }
}
