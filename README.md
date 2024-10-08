# ephnote

An end-to-end encrypted note sharing app with support for markdown and JavaScript-free environments. Built with SvelteKit, Redis and TailwindCSS.

## Features

- Modern UI
- End-to-end encryption
- No JavaScript required\*

\*Not true end-to-end encryption without JavaScript

## Live Demo

[ephnote.vercel.app](https://ephnote.vercel.app/)

## Deploying for Free

### Redis

There are many providers that offer free Redis instances, here are some of them:

- [Redis Cloud](https://redis.com/try-free/)
- [Upstash](https://upstash.com/)
- [Aiven](https://aiven.io/)

### Hosting

For hosting, some viable options are [Vercel](https://vercel.com/) and [Cloudflare Pages](https://pages.cloudflare.com/).

### Environment Variables

The only environment variable required is `REDIS_URL`, which should be set to the connection string of your Redis instance.

## Docker

Example `docker-compose.yml`:
```yaml
services:
  ephnote:
    image: ghcr.io/edde746/ephnote:latest
    ports:
      - 3000:3000
    environment:
      - REDIS_URL=redis://redis:6379
  redis:
    image: redis:alpine
```
