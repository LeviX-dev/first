# Configuration Specification

## Environment Variables (`.env`)
| Variable | Default Value | Purpose |
|---|---|---|
| `PORT` | `3000` | Port on which the HTTP server listens |
| `NODE_ENV` | `production` | Node environment (`production` vs `development`) |
| `ALLOWED_ORIGINS` | `*` | Comma-separated list of origins allowed by CORS |

## GitHub Actions Repository Secrets
Configured in GitHub under **Settings > Secrets and variables > Actions**:
| Secret Name | Description | Example / Default |
|---|---|---|
| `SSH_HOST` | Hostname or Public IPv4 of the VPS | `123.45.67.89` |
| `SSH_USER` | SSH user account on VPS | `root` or `deploy` |
| `SSH_KEY` | Ed25519 or RSA Private Key (Unencrypted) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SSH_PORT` | SSH listening port | `22` (workflow defaults to 22 if omitted) |

## Process Management
- **PM2 Configuration File**: `ecosystem.config.cjs`
- **Application Directory on VPS**: `./first/first` or `$HOME/first/first`
