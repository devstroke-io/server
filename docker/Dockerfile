# PREPARE STAGE
FROM node:10-alpine AS prepare-stage

# ARG ANGULAR_VERSION=v7.0.0-rc.2

# RUN yarn global add @angular/cli@${ANGULAR_VERSION} \
#   && ng config --global cli.packageManager yarn

# WORKDIR /app

# COPY package*.json yarn.lock /app/

# RUN apk add --no-cache python make g++

# RUN yarn install


# TEST STAGE
FROM prepare-stage AS test-stage

# add Chrome for ng test
# RUN apk add --no-cache chromium
# ENV CHROME_BIN=/usr/bin/chromium-browser

# COPY ./ /app/


# BUILD STAGE
# FROM prepare-stage AS build-stage

# COPY ./ /app/

# RUN yarn run build --prod --subresource-integrity=true


# DEV STAGE
FROM test-stage AS dev-stage

ARG UID=1000
ARG GID=1000

# change node user UID/GID
RUN if [ "$UID" != "$(id -u node)" ] ; then \
  deluser --remove-home node \
  && addgroup -S node -g $GID \
  && adduser -S -G node -u $UID node; \
fi

VOLUME /app

EXPOSE 4200


# PROD STAGE
# FROM nginx:1.15-alpine AS prod-stage

# COPY --from=build-stage /app/dist/ /usr/share/nginx/html

# COPY docker/dependencies/devstroke.conf /etc/nginx/conf.d/default.conf
