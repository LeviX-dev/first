# Architecture Decisions

## ADR-001: Separation of CI Verification and CD Remote Deployment
- **Context**: The original single-step deployment ran `git pull` and restarted the process directly on the production VPS without verifying whether the new commit had syntax errors or broken dependencies.
- **Decision**: Split the workflow into two dependent stages: `ci` (runner verification) and `deploy` (VPS deployment).
- **Consequences**: Broken commits never reach the VPS; deployment only proceeds when code integrity passes.

## ADR-002: Zero-Downtime Reload with PM2 & Ecosystem Configuration
- **Context**: `pm2 restart app || npm start &` can drop active TCP connections during restart, and backgrounding `npm start &` creates orphaned node processes.
- **Decision**: Introduce `ecosystem.config.cjs` using cluster mode and replace `pm2 restart` with `pm2 reload`.
- **Consequences**: Incoming HTTP traffic is continuously handled by surviving workers during code updates without dropped requests.

## ADR-003: Post-Deployment Automated Health Check Loop
- **Context**: Silent crashes after deployment could leave the VPS offline without failing the GitHub Actions job.
- **Decision**: Add an automated polling loop testing `http://127.0.0.1:3000/health` up to 6 times after reloading PM2. If it fails, capture the last 30 lines of PM2 logs and terminate with an exit code of 1.
- **Consequences**: Immediate alerting in GitHub Actions if a deployment fails.
