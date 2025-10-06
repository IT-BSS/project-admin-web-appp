# Используем официальный Node.js образ
FROM node:21

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json (и package-lock.json / yarn.lock, если есть) — но не pnpm-lock.yaml
COPY package.json ./

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

# Устанавливаем зависимости (без frozen-lockfile)
RUN pnpm install

# Копируем весь остальной код в контейнер
COPY . .

# Создаем папку для логов (если нужна)
RUN mkdir -p logs

# Запускаем сборку
RUN pnpm run start

# Открываем порт (сервер слушает на 3000)
EXPOSE 3000

# Запуск приложения — здесь “dev”, можно поменять на “start” или др. команду
CMD ["pnpm", "start"]
