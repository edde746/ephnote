FROM node:lts-alpine
WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm i
COPY . .
# Trick to use adapter-node via adapter-auto
ENV GCP_BUILDPACKS=1 
RUN pnpm build
RUN pnpm prune --prod
CMD ["node", "build/index.js"]
