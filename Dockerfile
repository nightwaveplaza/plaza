# Build the web app target and serve the static files with nginx

FROM node:22-alpine AS build
WORKDIR /app

# Vite bakes VITE_* into the bundle at build time, so they must be build args
ARG VITE_APP=app
ARG VITE_API_URL=https://api.plaza.one
ENV VITE_APP=$VITE_APP \
    VITE_API_URL=$VITE_API_URL

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build
# Emit the nginx SPA routes map (dist/generated-routes.conf) only for the container
RUN yarn nginx-routes \
    && test -f dist/generated-routes.conf


FROM nginx:1.27-alpine AS runtime

# Static build plus the map $uri $spa_match block emitted by vite-plugin-nginx-routes
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/dist/generated-routes.conf /etc/nginx/conf.d/spa-routes.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# generated-routes.conf lives in the web root too, no need to expose it
RUN rm -f /usr/share/nginx/html/generated-routes.conf

EXPOSE 80
