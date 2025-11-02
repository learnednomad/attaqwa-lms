# Coolify MCP Server - Usage Examples

This guide provides practical examples of using the Coolify MCP server with Claude Code for common deployment and infrastructure tasks.

## Table of Contents

- [Getting Started](#getting-started)
- [Deployment Workflows](#deployment-workflows)
- [Database Management](#database-management)
- [Environment Configuration](#environment-configuration)
- [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
- [Advanced Scenarios](#advanced-scenarios)

## Getting Started

### Initial Setup Verification

**Example Conversation:**
```
You: "Check if my Coolify instance is healthy"
Claude: [Uses health_check tool]
```

**Result:**
```json
{
  "status": "healthy",
  "version": "4.0.0"
}
```

### Discover Your Infrastructure

**Example Conversation:**
```
You: "Show me all my teams and projects"
Claude: [Uses list_teams and list_projects tools]
```

## Deployment Workflows

### Standard Application Deployment

#### Deploy Latest Code

**Example Conversation:**
```
You: "Deploy the attaqwa-web application"
Claude: [Uses list_applications to find the app, then deploy_application]
```

**Steps:**
1. Lists applications to find "attaqwa-web"
2. Deploys the application
3. Returns deployment ID and status

#### Force Deploy (Skip Cache)

**Example Conversation:**
```
You: "Force deploy the API application, ignore cache"
Claude: [Uses deploy_application with force: true]
```

**Use Case:** When you need to rebuild from scratch or Docker cache is causing issues.

#### Deploy Specific Commit

**Example Conversation:**
```
You: "Deploy commit abc123def to the staging application"
Claude: [Uses deploy_application with commitSha: "abc123def"]
```

**Use Case:** Rollback to a previous version or deploy a specific release.

### Monitor Deployment Progress

**Example Conversation:**
```
You: "What's the status of deployment dep-xyz789?"
Claude: [Uses get_deployment_status]
```

**Result:**
```json
{
  "deployment": {
    "id": "dep-xyz789",
    "status": "in_progress",
    "commit_sha": "abc123def",
    "started_at": "2024-01-15T10:30:00Z"
  },
  "isComplete": false,
  "isSuccessful": false
}
```

### Cancel Failed Deployment

**Example Conversation:**
```
You: "Cancel the current deployment for app-123"
Claude: [Uses list_deployments to find latest, then cancel_deployment]
```

## Database Management

### Create Production Database

**Example Conversation:**
```
You: "Create a PostgreSQL 14 database named 'production-db' in the production environment"
Claude: [Uses create_database]
```

**Result:**
```json
{
  "id": "db-new123",
  "name": "production-db",
  "type": "postgresql",
  "version": "14",
  "status": "running",
  "internal_db_url": "postgresql://user:pass@db:5432/production-db"
}
```

### Create Redis Cache

**Example Conversation:**
```
You: "Set up a Redis cache database in environment env-456"
Claude: [Uses create_database with type: "redis"]
```

### Backup Database to S3

**Example Conversation:**
```
You: "Create a daily backup of database db-789 to S3 bucket 'my-backups' in us-east-1"
Claude: [Uses backup_database with S3 configuration]
```

**Example:**
```json
{
  "databaseId": "db-789",
  "frequency": "daily",
  "s3Storage": {
    "bucket": "my-backups",
    "region": "us-east-1",
    "accessKey": "AKIA...",
    "secretKey": "secret..."
  }
}
```

### Database Lifecycle Management

**Example Conversation:**
```
You: "Stop database db-test456 to save resources"
Claude: [Uses stop_database]

You: "Start it again when needed"
Claude: [Uses start_database]
```

## Environment Configuration

### Set Application Environment Variables

**Example Conversation:**
```
You: "Set DATABASE_URL for application app-123 as a secret"
Claude: [Uses set_environment_variable with isSecret: true]
```

**Example:**
```json
{
  "resourceId": "app-123",
  "key": "DATABASE_URL",
  "value": "postgresql://...",
  "isSecret": true,
  "isBuildTime": false
}
```

### Build-Time Environment Variables

**Example Conversation:**
```
You: "Add NEXT_PUBLIC_API_URL as a build-time variable for the web app"
Claude: [Uses set_environment_variable with isBuildTime: true]
```

**Use Case:** Next.js public environment variables that need to be available during build.

### List and Review Variables

**Example Conversation:**
```
You: "Show me all environment variables for app-456"
Claude: [Uses list_environment_variables]
```

**Result:**
```json
[
  {
    "id": "var-1",
    "key": "DATABASE_URL",
    "value": "***hidden***",
    "is_secret": true
  },
  {
    "id": "var-2",
    "key": "NEXT_PUBLIC_API_URL",
    "value": "https://api.example.com",
    "is_secret": false,
    "is_build_time": true
  }
]
```

### Bulk Environment Setup

**Example Conversation:**
```
You: "Set up environment variables for the production API:
- DATABASE_URL (secret)
- REDIS_URL (secret)
- JWT_SECRET (secret)
- API_VERSION=v1 (public)"
Claude: [Uses set_environment_variable multiple times]
```

## Monitoring and Troubleshooting

### View Recent Application Logs

**Example Conversation:**
```
You: "Show me the last 100 lines of logs from app-789"
Claude: [Uses get_logs with tail: 100]
```

**Result:**
```
[2024-01-15 10:45:23] INFO Server started on port 3000
[2024-01-15 10:45:24] INFO Database connected
[2024-01-15 10:46:01] ERROR Failed to fetch user data
...
```

### Filter Logs by Time

**Example Conversation:**
```
You: "Get logs from the API since 2024-01-15T10:00:00Z"
Claude: [Uses get_logs with since parameter]
```

### Check Application Health

**Example Conversation:**
```
You: "What's the current status of all my applications?"
Claude: [Uses list_applications and get_application_status for each]
```

**Result:**
```json
[
  {
    "name": "attaqwa-web",
    "status": "running",
    "lastDeployment": {
      "status": "success",
      "finished_at": "2024-01-15T09:30:00Z"
    }
  },
  {
    "name": "attaqwa-api",
    "status": "error",
    "lastDeployment": {
      "status": "failed",
      "finished_at": "2024-01-15T10:00:00Z"
    }
  }
]
```

### Investigate Failed Deployment

**Example Conversation:**
```
You: "Why did the latest API deployment fail?"
Claude:
1. [Uses list_deployments to find latest]
2. [Uses get_deployment to get details]
3. [Analyzes deployment_logs field]
```

## Advanced Scenarios

### Complete Application Setup

**Example Conversation:**
```
You: "Set up a complete production stack:
1. Create PostgreSQL database
2. Create Redis cache
3. Configure environment variables
4. Deploy the application"

Claude: [Executes multi-step workflow]
```

**Steps:**
1. Creates PostgreSQL database
2. Creates Redis database
3. Sets DATABASE_URL and REDIS_URL as secrets
4. Sets other environment variables
5. Deploys application
6. Monitors deployment progress
7. Confirms all services are running

### Blue-Green Deployment

**Example Conversation:**
```
You: "Deploy to staging, run tests, then promote to production"
Claude:
1. [Deploys to staging]
2. [Waits for deployment]
3. [Gets logs to verify]
4. [Deploys same commit to production]
```

### Disaster Recovery

**Example Conversation:**
```
You: "Application app-456 is down. Help me recover:
1. Check recent deployments
2. Rollback to last working version
3. Verify it's running"

Claude:
1. [Uses list_deployments]
2. [Identifies last successful deployment]
3. [Uses deploy_application with specific commitSha]
4. [Monitors deployment]
5. [Checks application status]
```

### Database Migration Workflow

**Example Conversation:**
```
You: "I need to migrate data:
1. Create backup of current database
2. Stop the application
3. Create new database
4. Update DATABASE_URL
5. Start the application"

Claude: [Executes migration workflow safely]
```

### Environment Promotion

**Example Conversation:**
```
You: "Copy all environment variables from staging app to production app"
Claude:
1. [Lists staging environment variables]
2. [Sets each variable on production app]
3. [Confirms all variables are set]
```

### Scaling Resources

**Example Conversation:**
```
You: "My application needs more database resources. Create a new PostgreSQL 15 database and help me migrate"
Claude:
1. [Creates new PostgreSQL 15 database]
2. [Provides migration steps]
3. [Updates environment variables]
4. [Monitors application after switch]
```

## Best Practices

### 1. Always Check Status Before Actions

```
You: "Before deploying, check the current application status"
Claude: [Uses get_application_status first]
```

### 2. Monitor Deployments

```
You: "Deploy and keep me updated on progress"
Claude: [Deploys then periodically checks deployment status]
```

### 3. Use Secrets for Sensitive Data

```
You: "Set API_KEY as a secret"
Claude: [Uses isSecret: true]
```

### 4. Backup Before Major Changes

```
You: "Before upgrading, backup the database"
Claude: [Uses backup_database first]
```

### 5. Review Logs on Failures

```
You: "Deployment failed, show me the logs"
Claude: [Gets deployment logs to diagnose]
```

## Troubleshooting Examples

### Application Won't Start

**Example Conversation:**
```
You: "App app-123 won't start, help me debug"
Claude:
1. [Gets application status]
2. [Gets recent logs with get_logs]
3. [Checks environment variables]
4. [Identifies missing DATABASE_URL]
5. [Suggests setting the variable]
```

### Deployment Stuck

**Example Conversation:**
```
You: "Deployment has been in progress for 30 minutes"
Claude:
1. [Gets deployment status]
2. [Checks deployment logs]
3. [If truly stuck, suggests canceling]
4. [Helps retry deployment]
```

### Database Connection Issues

**Example Conversation:**
```
You: "Application can't connect to database"
Claude:
1. [Gets database status]
2. [Checks database is running]
3. [Gets DATABASE_URL environment variable]
4. [Verifies URL format]
5. [Checks application logs for connection errors]
```

## Integration with CI/CD

### GitHub Actions Example

**Workflow:**
1. Code pushed to main branch
2. GitHub Actions triggers
3. Uses Coolify API (via this MCP server) to deploy
4. Monitors deployment status
5. Sends notification on completion

**Example Conversation:**
```
You: "How can I integrate this with GitHub Actions?"
Claude: [Provides example workflow using Coolify API tokens]
```

## Tips for Effective Use

1. **Be Specific**: "Deploy attaqwa-web with force option" is better than "deploy something"
2. **Check First**: Ask to check status before making changes
3. **Use Names**: Application/database names are easier than IDs
4. **Monitor**: Ask for status updates during long operations
5. **Batch Operations**: "Set up production environment" can handle multiple steps

## Need Help?

If you encounter issues:

1. Check Coolify instance is accessible
2. Verify API token has correct permissions
3. Review Claude Code logs
4. Check the main README.md for configuration
5. Ensure environment variables are set correctly
