FROM node:14.9-alpine as DepsPreset
WORKDIR /app
COPY package.json /app
RUN node -pe '(d=`dependencies`,dd=`devDependencies`,p=`./package.json`,JSON.stringify({[d]:require(p)[d],[dd]:require(p)[dd]},null,2))' > deps.json

FROM node:14.9-alpine as Deps
WORKDIR /app
COPY yarn.lock /app
COPY --from=DepsPreset /app/deps.json /app/package.json
RUN yarn install --production

FROM node:14.9-alpine as Pkg
ADD wenku8-*.tgz /app

FROM node:14.9-alpine
COPY --from=Pkg /app/package /app
COPY --from=Deps /app/node_modules /app/node_modules
WORKDIR /app
CMD [ "node", "server.mjs" ]
