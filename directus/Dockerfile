FROM directus/directus:11.6

USER root
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

WORKDIR /directus
COPY extensions ./extensions

RUN pnpm install ./extensions/*/ --store-dir=./.pnpm-store

EXPOSE 8055

CMD ["node", "cli.js", "start"]
