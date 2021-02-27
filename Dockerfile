# Stage 1, compile typescript file to javascript
FROM node:14.15-buster as builder

# Create a workdir directory
WORKDIR /usr/src/app

# Copy all files to work directory
COPY . .

# install all depedencies
RUN npm install

# run linter
RUN npm run lint

# build 
RUN npm run build

# Stage 2, running compiled javascript file
FROM node:14.15-buster as runner

# Change workdir directory
WORKDIR /usr/src/app

# Copy package json file
COPY package*.json .

# Install only not development depedencie(s)
RUN npm install --only=production

# Copy a compiled javascript from previous stage
COPY --from=0 /usr/src/app/build ./build

# copy a private and public key
COPY private.pem /usr/src/app/build
COPY public.pem /usr/src/app/build

# expose container to port 3000
EXPOSE 3000
CMD ["npm", "start"]