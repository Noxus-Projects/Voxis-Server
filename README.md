# Voxis Server
A simple self-hosted solution in place of Discord.

## Features
- Easily login with Discord.
- Connect and talk to your friends with super high and crisp quality.
- Share your screen in 1080p or above.
- Stream music/video's from the server without the need of a bot.
- Most of Discord's features.

## Install

You can install the server using the listed options, but before that, you must first create an application on [Discord's developer platform](https://discord.com/developers). If you have successfully created an application you will need to add the following urls in the OAuth2 tab: `app://./login` and `http://localhost:8888/authorize`. This application's client id, client secret and redirect uri will referenced later on.

### Build from source

**Requirements:**
- Git
- NodeJS
- Yarn or NPM

If you want the newest version of the server you can build straight from the source using the following commands:

```bash
git clone https://github.com/noxus-projects/voxis-server server && cd server
npm install
npm run build
```

If you decide to build from source you will need to create a .env file in the base directory, containing the following variables:

```env
OWNER = Discord owner id
PORT = The port the server should run on
CLIENT_ID = The Discord application's client id
CLIENT_SECRET = The Discord application's client secret
REDIRECT = The Discord application's redirect uri
```

Once you have successfully created the file, you can start the server by running `npm start` or `yarn start`.

### Install with Docker
**Requirements:**
- Docker
- Docker-compose

First off, pull the image using the following command:
```bash
docker pull guusvanmeerveld/voxis-server
```

After that, create a file called `docker-compose.yml` containing the following:

```yml
version: '3'
services:
  server:
    image: guusvanmeerveld/voxis-server
    container_name: voxis-server
    environment:
      - OWNER = Discord owner id
      - PORT = The port the server should run on
      - CLIENT_ID = The Discord application's client id
      - CLIENT_SECRET = The Discord application's client secret
      - REDIRECT = The Discord application's redirect uri
    volumes:
      - ./data:/app/data
```

Then, start the container using the following command:

```bash
docker-compose up -d
```