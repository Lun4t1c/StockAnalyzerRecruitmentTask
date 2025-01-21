-- Postgresql
PREPARE select_ceny_akcji_between_dates(DATE, DATE) AS
SELECT *
FROM ceny_akcji
WHERE data BETWEEN $1 AND $2;

EXECUTE select_ceny_akcji_between_dates('2024-01-11', '2024-01-21');