FROM node:14.15-buster

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
RUN mkdir videos

# copy a private and public key
COPY private.pem /usr/src/app/build
COPY public.pem /usr/src/app/build

# expose container to port 3000
EXPOSE 3000
CMD ["npm", "start"]