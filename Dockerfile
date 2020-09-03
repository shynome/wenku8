FROM node:14.9-alpine as install
ADD wenku8-*.tgz /app
WORKDIR /app/package
RUN yarn install --production

FROM node:14.9-alpine
COPY --from=install /app/package /app
WORKDIR /app
CMD [ "node", "server.mjs" ]
