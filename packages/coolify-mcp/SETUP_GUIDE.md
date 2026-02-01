# Coolify MCP Server - Complete Setup Guide

This guide walks you through setting up the Coolify MCP server step-by-step.

## Prerequisites

- ✅ Node.js 18 or later installed
- ✅ A running Coolify instance (self-hosted or Coolify Cloud)
- ✅ Coolify API token with appropriate permissions
- ✅ Claude Code CLI installed

## Step-by-Step Setup

### Step 1: Get Coolify API Token

1. **Log into your Coolify instance**
   ```
   https://your-coolify-instance.com
   ```

2. **Navigate to API Settings**
   - Click on your profile (top right)
   - Select "Security"
   - Go to "API Tokens" section

3. **Create New Token**
   - Click "Create New Token"
   - Give it a descriptive name: "Claude Code MCP"
   - Select permissions:
     - ✅ Read applications
     - ✅ Write applications
     - ✅ Read databases
     - ✅ Write databases
     - ✅ Read deployments
     - ✅ Write deployments
     - ✅ Read environment variables
     - ✅ Write environment variables

4. **Copy and Save Token**
   ⚠️ You'll only see this token once! Save it securely.

### Step 2: Build the MCP Server

From the monorepo root:

```bash
cd packages/coolify-mcp
npm install
npm run build
```

Expected output:
```
added 93 packages
✓ Build successful
```

### Step 3: Configure Environment Variables

1. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your credentials**
   ```bash
   nano .env
   # or
   vim .env
   # or use your preferred editor
   ```

3. **Add your Coolify details**
   ```env
   COOLIFY_URL=https://your-coolify-instance.com
   COOLIFY_API_TOKEN=your-api-token-here

   # Optional: Set defaults
   COOLIFY_DEFAULT_PROJECT_ID=proj-abc123
   COOLIFY_DEFAULT_TEAM_ID=team-xyz789
   ```

4. **Save and close the file**

### Step 4: Test the MCP Server Locally

Test that the server starts correctly:

```bash
cd packages/coolify-mcp
node dist/index.js
```

Expected output:
```
Coolify MCP Server running on stdio
```

Press `Ctrl+C` to stop the test.

### Step 5: Configure Claude Code

#### Option A: Using Claude CLI (Recommended)

1. **Get absolute path to the server**
   ```bash
   pwd
   # Output: /Users/saninabil/WebstormProjects/attaqwa-lms/packages/coolify-mcp
   ```

2. **Add MCP server to Claude Code**
   ```bash
   claude mcp add coolify node /Users/saninabil/WebstormProjects/attaqwa-lms/packages/coolify-mcp/dist/index.js
   ```

3. **Verify it's added**
   ```bash
   claude mcp list
   ```

   Expected output should include:
   ```
   coolify: node /Users/.../packages/coolify-mcp/dist/index.js - ✓ Connected
   ```

#### Option B: Manual Configuration

1. **Find Claude Code config directory**
   ```bash
   # macOS
   cat ~/Library/Application\ Support/claude-code/mcp_config.json

   # Linux
   cat ~/.config/claude-code/mcp_config.json
   ```

2. **Edit the MCP configuration**
   Add this to the `mcpServers` section:
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

3. **Restart Claude Code**
   ```bash
   # If running in terminal, just restart it
   # If using the app, restart the application
   ```

### Step 6: Verify the Setup

1. **Start Claude Code**
   ```bash
   claude
   ```

2. **Test basic connectivity**
   ```
   You: "Check if my Coolify instance is healthy"
   ```

   Claude should respond with health status using the `health_check` tool.

3. **List your resources**
   ```
   You: "List all my applications"
   ```

   Claude should return your Coolify applications.

## Troubleshooting

### Issue: MCP Server Not Showing in `claude mcp list`

**Solution:**
1. Check the path is absolute, not relative
2. Verify the `dist/index.js` file exists
3. Rebuild if necessary: `npm run build`

### Issue: "Cannot find module" Error

**Solution:**
```bash
cd packages/coolify-mcp
rm -rf node_modules dist
npm install
npm run build
```

### Issue: API Authentication Failed

**Solution:**
1. Verify your API token is correct
2. Check token hasn't expired
3. Ensure token has necessary permissions
4. Test API token with curl:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://your-coolify.com/api/v1/health
   ```

### Issue: Environment Variables Not Loading

**Solution:**
1. Check `.env` file is in the correct location (`packages/coolify-mcp/.env`)
2. Verify `.env` file format (no quotes around values usually)
3. Restart Claude Code after changing `.env`

### Issue: TypeScript Compilation Errors

**Solution:**
```bash
# Check Node.js version
node --version  # Should be 18 or later

# Clean and rebuild
npm run clean
npm install
npm run build
```

## Advanced Configuration

### Using Environment-Specific Configs

Create multiple environment files:

```bash
.env.development
.env.staging
.env.production
```

Then configure multiple MCP servers in Claude Code:

```json
{
  "mcpServers": {
    "coolify-dev": {
      "command": "node",
      "args": ["/path/to/coolify-mcp/dist/index.js"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    "coolify-prod": {
      "command": "node",
      "args": ["/path/to/coolify-mcp/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Using with Docker

If your Coolify instance is in Docker:

```bash
# Ensure network connectivity
docker network inspect coolify

# Update COOLIFY_URL if needed
COOLIFY_URL=http://coolify-instance:8000
```

### Running as System Service

For production use, consider running as a system service:

**systemd example** (`/etc/systemd/system/coolify-mcp.service`):
```ini
[Unit]
Description=Coolify MCP Server
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/attaqwa-lms/packages/coolify-mcp
ExecStart=/usr/bin/node /path/to/coolify-mcp/dist/index.js
Restart=on-failure
Environment="COOLIFY_URL=https://your-coolify.com"
Environment="COOLIFY_API_TOKEN=your-token"

[Install]
WantedBy=multi-user.target
```

## Security Best Practices

### 1. Protect Your API Token

```bash
# Set proper file permissions on .env
chmod 600 .env

# Never commit .env to git
echo ".env" >> .gitignore
```

### 2. Use Least Privilege

Create API tokens with only the permissions needed:
- Development: Read-only access
- Production: Limited to specific projects

### 3. Rotate Tokens Regularly

Set a reminder to rotate API tokens every 3-6 months.

### 4. Monitor API Usage

Check Coolify logs for unexpected API calls:
```bash
# In your Coolify instance
docker logs coolify -f | grep "API"
```

## Verification Checklist

Before using in production:

- [ ] MCP server builds successfully
- [ ] `claude mcp list` shows coolify server as connected
- [ ] Health check returns healthy status
- [ ] Can list applications
- [ ] Can list databases
- [ ] Can view environment variables
- [ ] Can view logs
- [ ] API token has correct permissions
- [ ] `.env` file is not committed to git
- [ ] File permissions are set correctly

## Next Steps

Once setup is complete:

1. **Read the Examples Guide**: See `EXAMPLES.md` for usage patterns
2. **Test Basic Operations**: Try listing resources, checking status
3. **Try a Deployment**: Deploy a test application
4. **Set Up Monitoring**: Configure log viewing and health checks

## Getting Help

If you encounter issues not covered here:

1. **Check the README**: Main documentation in `README.md`
2. **Review Examples**: Common patterns in `EXAMPLES.md`
3. **Check Logs**: Claude Code logs often show the issue
4. **Verify API Access**: Test Coolify API directly with curl
5. **Rebuild**: When in doubt, clean and rebuild

## Useful Commands Reference

```bash
# Build
npm run build

# Development watch mode
npm run dev

# Type checking
npm run typecheck

# Clean build artifacts
npm run clean

# Test MCP server locally
node dist/index.js

# Check Claude Code MCP servers
claude mcp list

# View Claude Code logs
tail -f ~/.claude-code/logs/mcp.log
```

## Configuration File Locations

```
# MCP Server
packages/coolify-mcp/
├── .env                    # Your environment config
├── dist/                   # Build output
└── src/                    # Source code

# Claude Code Config
~/Library/Application Support/claude-code/mcp_config.json  # macOS
~/.config/claude-code/mcp_config.json                       # Linux
```

---

**Setup Complete! 🎉**

You should now be able to manage your Coolify infrastructure through Claude Code. Try asking Claude to "List all my applications" to verify everything is working.
