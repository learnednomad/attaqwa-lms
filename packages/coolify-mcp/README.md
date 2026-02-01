# @attaqwa/coolify-mcp

Enhanced Coolify MCP Server for comprehensive deployment and infrastructure management through Claude Code.

## Features

### 🚀 Deployment Management
- **List & Get Applications**: View all applications or get detailed info
- **Deploy Applications**: Deploy with force option or specific commit SHA
- **Application Control**: Start, stop, restart applications
- **Deployment Tracking**: List deployments, check status, cancel in-progress deployments

### 💾 Database Operations
- **Multi-Database Support**: PostgreSQL, MySQL, MongoDB, Redis, MariaDB
- **Database Lifecycle**: Create, start, stop databases
- **Backup Management**: Create backups with S3 storage integration
- **Status Monitoring**: Check database health and connection details

### ⚙️ Environment Configuration
- **Environment Variables**: List, set, delete environment variables
- **Secret Management**: Mark sensitive variables as secrets
- **Build-Time Variables**: Configure build-time vs runtime variables
- **Project Management**: List projects, teams, and environments

### 📊 Monitoring & Logging
- **Log Streaming**: Get logs with time filtering and tail options
- **Health Checks**: Monitor Coolify instance health
- **Status Tracking**: Comprehensive application and database status
- **Deployment Logs**: Access deployment logs and progress

## Installation

### 1. Install Dependencies

```bash
cd packages/coolify-mcp
npm install
```

### 2. Build the Package

```bash
npm run build
```

### 3. Configure Environment Variables

Create a `.env` file in the `packages/coolify-mcp` directory:

```bash
cp .env.example .env
```

Edit `.env` with your Coolify instance details:

```env
COOLIFY_URL=https://your-coolify-instance.com
COOLIFY_API_TOKEN=your-api-token-here
COOLIFY_DEFAULT_PROJECT_ID=optional-project-id
COOLIFY_DEFAULT_TEAM_ID=optional-team-id
```

### 4. Get Your Coolify API Token

1. Log into your Coolify instance
2. Navigate to **Settings** → **API Tokens**
3. Create a new token with appropriate permissions
4. Copy the token to your `.env` file

## Configuration for Claude Code

Add the Coolify MCP server to your Claude Code configuration:

### Option 1: Using `claude mcp` CLI

```bash
claude mcp add coolify node /absolute/path/to/attaqwa-lms/packages/coolify-mcp/dist/index.js
```

### Option 2: Manual Configuration

Edit your Claude Code MCP settings file and add:

```json
{
  "mcpServers": {
    "coolify": {
      "command": "node",
      "args": ["/absolute/path/to/attaqwa-lms/packages/coolify-mcp/dist/index.js"],
      "env": {
        "COOLIFY_URL": "https://your-coolify-instance.com",
        "COOLIFY_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Option 3: NPX (After Publishing)

```json
{
  "mcpServers": {
    "coolify": {
      "command": "npx",
      "args": ["-y", "@attaqwa/coolify-mcp"],
      "env": {
        "COOLIFY_URL": "https://your-coolify-instance.com",
        "COOLIFY_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

## Usage Examples

### Deployment Management

#### Deploy an Application
```
"Deploy the main application with force option"
→ Uses: deploy_application with force: true
```

#### Check Application Status
```
"What's the status of application abc123?"
→ Uses: get_application_status
```

#### List Recent Deployments
```
"Show me the last 5 deployments for app xyz789"
→ Uses: list_deployments
```

### Database Operations

#### Create a PostgreSQL Database
```
"Create a PostgreSQL 14 database named 'production-db' in environment env-123"
→ Uses: create_database
```

#### Backup Database to S3
```
"Backup database db-456 to S3 with daily frequency"
→ Uses: backup_database
```

#### Check Database Connection
```
"What's the connection URL for database db-789?"
→ Uses: get_database_status
```

### Environment Configuration

#### Set Environment Variable
```
"Set DATABASE_URL to 'postgres://...' for application app-123 as a secret"
→ Uses: set_environment_variable with isSecret: true
```

#### List All Environment Variables
```
"Show me all environment variables for application app-456"
→ Uses: list_environment_variables
```

#### Manage Projects
```
"List all projects in my team"
→ Uses: list_projects
```

### Monitoring & Logging

#### Get Application Logs
```
"Show me the last 100 lines of logs for application app-789"
→ Uses: get_logs with tail: 100
```

#### Monitor Deployment Progress
```
"What's the status of deployment dep-123?"
→ Uses: get_deployment_status
```

#### Health Check
```
"Is my Coolify instance healthy?"
→ Uses: health_check
```

## Available Tools

### Deployment Tools
- `list_applications` - List all applications
- `get_application` - Get application details
- `deploy_application` - Deploy an application
- `restart_application` - Restart an application
- `stop_application` - Stop an application
- `start_application` - Start an application
- `list_deployments` - List application deployments
- `get_deployment` - Get deployment details
- `cancel_deployment` - Cancel in-progress deployment

### Database Tools
- `list_databases` - List all databases
- `get_database` - Get database details
- `create_database` - Create a new database
- `stop_database` - Stop a database
- `start_database` - Start a database
- `backup_database` - Create database backup

### Environment Tools
- `list_environment_variables` - List environment variables
- `set_environment_variable` - Set an environment variable
- `delete_environment_variable` - Delete an environment variable
- `list_projects` - List all projects
- `get_project` - Get project details
- `list_teams` - List all teams

### Monitoring Tools
- `get_logs` - Get resource logs
- `health_check` - Check Coolify health
- `get_deployment_status` - Get deployment status
- `get_application_status` - Get application status
- `get_database_status` - Get database status

## Development

### Build
```bash
npm run build
```

### Watch Mode
```bash
npm run dev
```

### Type Checking
```bash
npm run typecheck
```

### Clean Build
```bash
npm run clean
npm run build
```

## Troubleshooting

### MCP Server Not Connecting

1. **Check environment variables**:
   ```bash
   node -e "require('dotenv').config(); console.log(process.env.COOLIFY_URL)"
   ```

2. **Verify Coolify instance is accessible**:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" https://your-coolify.com/api/v1/health
   ```

3. **Check Claude Code logs**:
   ```bash
   claude mcp list
   ```

### API Token Issues

- Ensure token has necessary permissions
- Check token hasn't expired
- Verify token is correctly set in environment variables

### Build Errors

- Ensure you're using Node.js 18 or later
- Run `npm install` to ensure all dependencies are installed
- Clear `dist/` directory and rebuild

## Security Considerations

- **Never commit `.env` file** - It contains sensitive API tokens
- **Use secrets for sensitive variables** - Mark environment variables as secrets when appropriate
- **Limit token permissions** - Create API tokens with minimal required permissions
- **Rotate tokens regularly** - Change API tokens periodically for security

## Integration with attaqwa-lms

This MCP server is designed to work seamlessly with the Masjid At-Taqwa LMS monorepo:

- **Deployment**: Deploy web and API applications to Coolify
- **Database Management**: Manage PostgreSQL and Redis instances
- **Environment Sync**: Keep environment variables in sync between local and Coolify
- **Monitoring**: Track deployment status and application health

### Example Workflow

1. **Deploy API and Web**:
   ```
   "Deploy the attaqwa-api and attaqwa-web applications"
   ```

2. **Configure Environment**:
   ```
   "Set DATABASE_URL for the API application"
   ```

3. **Monitor Status**:
   ```
   "Show me the status of all running applications"
   ```

4. **Check Logs**:
   ```
   "Get the last 500 lines of logs from the API application"
   ```

## Contributing

When contributing to this MCP server:

1. Follow TypeScript best practices
2. Add comprehensive error handling
3. Update documentation for new tools
4. Add input validation with Zod schemas
5. Test with your Coolify instance before committing

## License

MIT

## Support

For issues and questions:
- Check the [Coolify API Documentation](https://coolify.io/docs/api)
- Review the [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- Open an issue in the attaqwa-lms repository
