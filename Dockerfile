FROM node:lts-alpine
WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm i
RUN pnpm i @sveltejs/adapter-node
COPY . .
RUN sed -i 's/adapter-auto/adapter-node/g' svelte.config.js
RUN pnpm build
RUN pnpm prune --prod
CMD ["node", "build/index.js"]
