FROM node:18

RUN npm install -g pnpm
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install
COPY . .
EXPOSE 8080
ENV ADDRESS=0.0.0.0 PORT=8080 NODE_ENV=development

RUN pnpm build
CMD ["pnpm", "startProd"]
