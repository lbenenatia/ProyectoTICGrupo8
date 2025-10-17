Quick auth backend notes

- Flyway migrations live in `src/main/resources/db/migration`.
- To run locally, make sure Postgres is available and application.properties points to your DB.

Example Docker Postgres

```powershell
docker run --name proyecto-postgres -e POSTGRES_PASSWORD=devpass -e POSTGRES_USER=devuser -e POSTGRES_DB=bd_proyecto_tic -p 5432:5432 -d postgres:15
```

JWT secret
- Set `JWT_SECRET` environment variable before starting the app in production.
