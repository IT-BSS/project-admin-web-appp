# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Устанавливаем pnpm
RUN npm install -g pnpm

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем исходный код
COPY . .

# Создаем папку для логов
RUN mkdir -p logs

# Компилируем TypeScript
RUN pnpm run build

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["pnpm", "start"]