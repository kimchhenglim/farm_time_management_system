# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app
# install dependencies
COPY package*.json ./
RUN npm ci
# build
COPY . .
RUN npm run build

# --- serve stage ---
FROM nginx:alpine
# remove default site
RUN rm -rf /usr/share/nginx/html/*
# copy Vite build output
COPY --from=build /app/dist /usr/share/nginx/html
# SPA-friendly nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx","-g","daemon off;"]