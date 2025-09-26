с инициализацией бд -
поднимаете контейнер с postgres
пишите в терминале в vs code находясь в папке с композником и init.sql
docker cp ./init.sql project-admin-web-appp-main-postgres-1:/tmp/init.sql
после пишите уже зайдя в docker desktop в exec контейнера
psql -U myuser -d mydb -f /tmp/init.sql
у вас будут таблицы и бд локально.
