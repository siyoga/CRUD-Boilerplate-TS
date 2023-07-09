# CRUD-Boilerplate-TS

First of all, this template is created for me, I am a beginner and so something can be done wrong. I’ll try to change that in the future.
To start, you need a . env file that looks like:

```env
POSTGRES_HOST=database
POSTGRES_DB=main
POSTGRES_DB_TEST=test
POSTGRES_USER=admin
POSTGRES_PORT=5432
POSTGRES_PASSWORD=root

NODE_ENV=prod
SERVER_PORT=6000
JWT_SECRET=secret

RELAY_HOST=
RELAY_PORT=
RELAY_USERNAME=
RELAY_PASSWORD=
RELAY_SECURE=
```

RELAY... fields are created for the mail module that works but is not connected to the main module, the rest is clear I think from the name of the variables.

**For start production**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**For start development**

```bash
docker-compose -f docker-compose.prod.yml up -d
```
