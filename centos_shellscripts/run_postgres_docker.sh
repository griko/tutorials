mkdir -p /var/lib/postgresql/data/pgdata
docker run -d \
	--name postgres_db \
	--rm -p 5433:5432 \
	-e POSTGRES_PASSWORD=$1 \
	-e PGDATA=/var/lib/postgresql/data/pgdata \
	-v /custom/mount:/var/lib/postgresql/data \
	postgres

