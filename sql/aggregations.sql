-- Average performance per driver
SELECT
    driver_id,
    AVG(delays_minutes) AS avg_delay,
    SUM(violations_count) AS total_violations,
    SUM(accidents_count) AS total_accidents,
    AVG(rating) AS avg_rating
FROM driver_profiles
GROUP BY driver_id
ORDER BY avg_rating ASC;

-- Weekly summary
SELECT
    DATE_TRUNC('week', date) AS week,
    SUM(delays_minutes) AS total_delays,
    SUM(accidents_count) AS total_accidents,
    AVG(rating) AS avg_rating
FROM driver_profiles
GROUP BY week
ORDER BY week;

-- Top drivers by violations
SELECT
    driver_id,
    SUM(violations_count) AS total_violations
FROM driver_profiles
GROUP BY driver_id
ORDER BY total_violations DESC
LIMIT 10;