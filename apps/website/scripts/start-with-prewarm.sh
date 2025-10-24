#!/bin/sh

# Start the Next.js app in the background
npm run dev --workspace=@attaqwa/web &

# Store the PID
APP_PID=$!

# Wait for the app to be ready
echo "Waiting for app to start..."
until curl -f http://localhost:3000/api/health > /dev/null 2>&1; do
  sleep 1
done

echo "App is ready, starting prewarm..."

# Run the prewarm script
node /app/packages/web/scripts/prewarm.js

echo "Prewarm complete, app is running with PID $APP_PID"

# Keep the container running
wait $APP_PID