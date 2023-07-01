# ephnote

An end-to-end encrypted note sharing app with support for JavaScript-free environments. Built with SvelteKit, Redis and TailwindCSS.

## Features

- Modern UI
- End-to-end encryption
- No JavaScript required\*

\*Not true end-to-end encryption without JavaScript

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
