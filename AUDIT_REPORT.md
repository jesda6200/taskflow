# AUDIT_REPORT

Date de l'audit: 2026-03-30
Répertoire audité: `/home/damien/.openclaw/workspace/projects/taskflow`
Portée demandée: inventaire des artefacts Docker et des dumps de base de données, sans modification de code.

## 1) État du répertoire projet
- Le répertoire est vide (aucun fichier métier détecté).
- Recherche de fichiers pertinents effectuée jusqu'à 4 niveaux de profondeur.

## 2) Artefacts Docker dans le projet
Aucun artefact trouvé dans le dossier audité:
- `Dockerfile` / `Dockerfile.*`
- `docker-compose.yml` / `docker-compose.yaml`
- `compose.yml` / `compose.yaml`
- fichiers d'override compose

## 3) Dumps de base de données dans le projet
Aucun fichier trouvé:
- `*.sql`
- `*.dump`

## 4) Inventaire Docker local (hôte)
### Conteneurs locaux observés
- `openclaw-sbx-agent-automation-engineer-bb553ac0` -> `openclaw-sandbox:bookworm-slim` (Exited)
- `openclaw-sbx-agent-main-f331f052` -> `openclaw-sandbox:bookworm-slim` (Exited)
- `todo-api-frontend` -> `todo-api-ui-simple-frontend` (Exited)
- `todo-api-backend` -> `todo-api-ui-simple-backend` (Exited)
- `loyalty-postgres` -> `postgres:16-alpine` (Up)
- `openclaw-mission-control-frontend-1` -> `openclaw-mission-control-frontend` (Exited)
- `openclaw-mission-control-webhook-worker-1` -> `openclaw-mission-control-webhook-worker` (Up)
- `openclaw-mission-control-backend-1` -> `openclaw-mission-control-backend` (Exited)
- `openclaw-mission-control-redis-1` -> `redis:7-alpine` (Exited)
- `openclaw-mission-control-db-1` -> `postgres:16-alpine` (Exited)

### Images locales observées
- `todo-api-ui-simple-backend:latest`
- `todo-api-ui-simple-frontend:latest`
- `openclaw-mission-control-frontend:latest`
- `openclaw-mission-control-backend:latest`
- `openclaw-mission-control-webhook-worker:latest`
- `debian:bookworm-slim`
- `openclaw-sandbox:bookworm-slim`
- `postgres:16-alpine`
- `redis:7-alpine`

## 5) Conclusion
- Aucun artefact Docker ni dump BD n'est présent dans le répertoire `/home/damien/.openclaw/workspace/projects/taskflow` au moment de l'audit.
- Des ressources Docker existent localement sur l'hôte, mais elles ne sont pas matérialisées par des fichiers dans ce projet.
