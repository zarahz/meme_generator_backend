FROM node:15-alpine

ENV WORKDIR=/code \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR ${WORKDIR}

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ADD package.json .
ADD yarn.lock .

RUN yarn

ADD . .

CMD [ "yarn", "start" ]