## this is the stage one , also know as the build step

FROM node:14.15-buster
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

## this is stage two , where the app actually runs

FROM node:14.15-buster

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /usr/src/app/build ./build
EXPOSE 3000
CMD ["npm", "start"]
