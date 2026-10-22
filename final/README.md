# Driver Performance - Data Science

## Start Docker Services

From the project root, run this command in PowerShell:
```
docker compose up -d
```
This starts:

| Service | Address |
|---|---|
| PostgreSQL | `localhost:5432` |
| Redis | `localhost:6379` |
| Metabase | [http://localhost:3001](http://localhost:3001) |

Check the running containers: `docker ps`
Stop the services: `docker compose down`


## Backend Setup

Open PowerShell inside the Laravel project:

```
cd backend-laravel
composer install
```
Copy the environment file:
```
Copy-Item .env.example .env
```
Generate the Laravel application key:
```
php artisan key:generate
```
The `.env.example` file already contains the required PostgreSQL and Redis configuration.

## Redis

Redis is configured through the Laravel `.env` file and runs through Docker.
After copying `.env.example` to `.env`, clear the Laravel configuration cache:
```
php artisan optimize:clear
```

## Database Migration and Seeding

Run the migrations:
```
php artisan migrate
```
To recreate the database and import all driver-performance records:
```
php artisan migrate:fresh --seed
```
The seeder imports the transformed CSV file from:
```
backend-laravel/database/seeders/data/driver_profiles.csv
```

## Start the Laravel API

Inside `backend-laravel`, run:
```
php artisan serve
```
The Laravel API will be available at:
```
http://127.0.0.1:8000
```

## Frontend Setup

Open a separate PowerShell terminal:
```
cd frontend-next
npm install
npm run dev
```
The Next.js dashboard will be available at:
```
http://localhost:3000/dashboard
```
The dashboard includes:
- Total delays
- Total accidents
- Average rating
- Weekly performance chart
- Top drivers by violations
- Date filters
- Driver selection
- Driver performance details
- Driver incidents chart

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /api/metrics/weekly` | Returns weekly delays, accidents, and ratings |
| `GET /api/metrics/top-drivers?limit=10` | Returns the top drivers by violations |
| `GET /api/metrics/driver/{driver_id}` | Returns a driver's performance records |
| `GET /api/metrics/interventions` | Returns drivers needing intervention |
| `GET /api/metrics/ratings` | Returns weekly rating trends |
| `GET /api/drivers` | Returns the list of drivers |

## API Examples

| Endpoint | Example |
|---|---|
| Weekly summary | `curl "http://127.0.0.1:8000/api/metrics/weekly"` |
| Weekly summary with dates | `curl "http://127.0.0.1:8000/api/metrics/weekly?start=2019-01-01&end=2019-03-31"` |
| Top drivers | `curl "http://127.0.0.1:8000/api/metrics/top-drivers?limit=10"` |
| Driver details | `curl "http://127.0.0.1:8000/api/metrics/driver/DRV-089"` |
| Driver details with dates | `curl "http://127.0.0.1:8000/api/metrics/driver/DRV-089?start=2019-01-01&end=2019-03-31"` |
| Drivers needing intervention | `curl "http://127.0.0.1:8000/api/metrics/interventions"` |
| Rating trends | `curl "http://127.0.0.1:8000/api/metrics/ratings"` |
| Driver list | `curl "http://127.0.0.1:8000/api/drivers"` |


## Metabase Setup
Open Metabase:
```
http://localhost:3001
```
Add the PostgreSQL database using these settings:

| Field | Value |
|---|---|
| Display name | Driver Performance Database |
| Host | `host.docker.internal` |
| Port | `5432` |
| Database name | `driver_performance` |
| Username | `postgres` |
| Password | `password` |
| SSL | Disabled |
The Metabase dashboard contains:
- Weekly Delays and Accidents
- Top 10 Drivers by Violations
- Total Accidents
- Average Driver Rating