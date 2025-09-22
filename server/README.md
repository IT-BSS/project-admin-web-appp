# Server
1. you need = docker and docker-compose and node.js, pnpm
2. open cmd, write this comand pnpm run docker:dev:build
3. start server, with work nodemon (automatic restart of the server when the change occurs)

## API Endpoints

- `GET /api/hello` - test endpoint for check server working
- `GET /health` - Health check endpoint

## Logs

Logs save in `logs/`:
- `error.log` - only error
- `combined.log` - all logs

## Scripts

### Local development
- `pnpm run dev` - Running in development mode with nodemon
- `pnpm run dev:watch` - Running with change tracking
- `pnpm run build` - Compilation TypeScript
- `pnpm start` - Launching a compiled application

### Docker
- `pnpm run docker:dev` - Launching a Docker container for development
- `pnpm run docker:dev:build` - Rebuilding and launching a Docker container for development
- `pnpm run docker:prod` - Launching a Docker container for production
- `pnpm run docker:prod:build` - Rebuilding and launching a Docker container for production
- `pnpm run docker:down` - Stopping all Docker containers