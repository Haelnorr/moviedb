# moviedb


BACKEND:


Testing requires redis on default port, and postgres server on port 5433 with 
credentials "user:password".  
Run the test with `./runtest` from inside the venv, or `./coveragehtml` to run 
the test and generate a html report showing the coverage.


BACKEND ENVARS:  
```
SECRET_KEY
LOG_DIR
LOG_LEVEL
REDIS
REDIS_PORT
JWT_REDIS_INDEX
POSTGRES_USER
POSTGRES_PASS
POSTGRES_HOST
POSTGRES_PORT
POSTGRES_SSL_MODE
POSTGRES_ENDPOINT (optional)
POSTGRES_DB_NAME
```

FRONTEND ENVARS:  
```
API_URL
API_PORT
COOKIE_SECURE_MODE
NODE_ENV
LOG_LEVEL
```
