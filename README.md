# Driver Performance - Data Science

<div align="center">

[Tools](#technologies-and-tools) ·
[Requirements](#requirements) ·
[Setup](#start-docker-services) ·
[Demo](#demo) ·
[Data](#exploratory-data-analysis)

</div>

A driver-performance analytics system built from Metro Manila traffic incident data. The system performs EDA, transforms traffic incidents into driver-performance records, stores them in PostgreSQL, provides Laravel API endpoints, caches results with Redis, and visualizes metrics using Next.js, Chart.js, and Metabase

> **Note:** The original MMDA dataset contains traffic incidents, not actual driver records. Driver IDs, ratings, behavioral problems, violations, and some performance metrics were synthetically generated for educational purposes.


## Technologies and Tools

| Image | Category | Tool | Purpose | Remarks |
|---|---|---|---|---|
| <img src="final/docs/icons/laravel.webp" width="50"> | Backend | [Laravel](https://laravel.com/) | Builds the API endpoints | PHP framework |
| <img src="final/docs/icons/php.png" width="50"> | Backend | [PHP](https://www.php.net/) | Runs Laravel | Version 8+ |
| <img src="final/docs/icons/composer.png" width="50"> | Backend | [Composer](https://getcomposer.org/) | Installs PHP packages | PHP package manager |
| <img src="final/docs/icons/postgresql.png" width="50"> | Database | [PostgreSQL](https://www.postgresql.org/) | Stores driver-performance data | Database server |
| <img src="final/docs/icons/dbeaver.png" width="50"> | Database Tool | [DBeaver](https://dbeaver.io/) | Views the database and runs SQL queries | Database client |
| <img src="final/docs/icons/redis.png" width="50"> | Caching | [Redis](https://redis.io/) | Caches API results | In-memory data store |
| <img src="final/docs/icons/docker.png" width="50"> | Containers | [Docker](https://www.docker.com/) | Runs PostgreSQL, Redis, and Metabase | Container platform |
| <img src="final/docs/icons/nextjs.png" width="50"> | Frontend | [Next.js](https://nextjs.org/) | Builds the dashboard | React framework |
| <img src="final/docs/icons/react.png" width="50"> | Frontend | [React](https://react.dev/) | Builds reusable UI components | Used by Next.js |
| <img src="final/docs/icons/chartjs.png" width="50"> | Charts | [Chart.js](https://www.chartjs.org/) | Creates dashboard charts | Visualization library |
| <img src="final/docs/icons/python.png" width="50"> | Data Analysis | [Python](https://www.python.org/) | Performs EDA and transformation | Version 3+ |
| <img src="final/docs/icons/pandas.png" width="50"> | Data Analysis | [Pandas](https://pandas.pydata.org/) | Cleans and transforms the dataset | Python library |
| <img src="final/docs/icons/jupyter.png" width="50"> | Notebook | [Jupyter Notebook](https://jupyter.org/) | Documents and runs the EDA | Analysis notebook |
| <img src="final/docs/icons/metabase.png" width="50"> | Dashboard | [Metabase](https://www.metabase.com/) | Creates stakeholder dashboards | Analytics dashboard |
| <img src="final/docs/icons/git.png" width="50"> | Version Control | [Git](https://git-scm.com/) | Tracks project changes | Version-control system |
| <img src="final/docs/icons/github.png" width="50"> | Repository | [GitHub](https://github.com/) | Stores and shares the project | Remote repository |

## Project Structure
```
driver-performance/
├── backend-laravel/      # Laravel backend and API
├── frontend-next/        # Next.js dashboard
├── eda-notebooks/        # EDA notebook and datasets
├── sql/
│   └── aggregations.sql  # SQL aggregation queries
├── final/                # Final PDF, screenshots, and icons
├── docker-compose.yml    # PostgreSQL, Redis, and Metabase
├── .gitignore            # Ignored files
├── MYNOTES.md            # Personal notes
└── README.md             # Project documentation
```

## Requirements

Install the following:

-   PHP 8+
-   Composer
-   Node.js 18+
-   npm
-   Docker Desktop
-   Git
-   Python
-   Jupyter Notebook

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

### Cache Invalidation

When database records are added or updated, clear the old cached results:

```
docker exec -it driver-redis redis-cli FLUSHDB
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

## Demo

## Exploratory Data Analysis

The EDA notebook is located at:

```
eda-notebooks/data_understanding.ipynb
```

The notebook includes:

- Data loading
- Missing-value analysis
- Data-type validation
- Duplicate checks
- Invalid coordinate checks
- Time-format checks
- Data cleaning
- Data transformation
- Delay and rating distributions
- Correlation matrix
- Weekly trends
- Outlier analysis
- Written observations

The final EDA report is available here:

[View the EDA Report](final/Driver%20Performance%20Data.pdf)

## Data Transformation

The original MMDA traffic data was transformed into driver-performance fields:

| Field | Description |
|---|---|
| `driver_id` | Synthetically generated driver identifier |
| `date` | Date of the traffic incident |
| `delays_minutes` | Estimated delay based on incident conditions |
| `behavioral_problems` | Synthetic educational metric |
| `violations_count` | Synthetic educational metric |
| `accidents_count` | Derived from accident and collision-related incidents |
| `rating` | Synthetic educational rating from 1.0 to 5.0 |
| `route_id` | Created from city, location, and direction |
| `vehicle_id` | Synthetically generated vehicle identifier |
| `shift` | Derived from the recorded incident time |
