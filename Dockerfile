# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Dynamically find the build output folder (handles Angular 16/17+ and SSR naming quirks)
RUN mkdir -p /app/publish && \
    BROWSER_DIR=$(find /app/dist -type d -name "browser" | head -n 1) && \
    if [ -n "$BROWSER_DIR" ]; then \
        cp -a "$BROWSER_DIR/." /app/publish/; \
    else \
        CLIENT_DIR=$(dirname "$(find /app/dist -type f \( -name "polyfills*.js" -o -name "main*.js" \) | head -n 1)") && \
        cp -a "$CLIENT_DIR/." /app/publish/; \
    fi && \
    if [ -f "/app/publish/index.csr.html" ] && [ ! -f "/app/publish/index.html" ]; then \
        mv /app/publish/index.csr.html /app/publish/index.html; \
    fi

# Stage 2: Serve with Nginx
FROM nginx:alpine

# 1. Remove the default Nginx content and config
RUN rm -rf /usr/share/nginx/html/*
RUN rm /etc/nginx/conf.d/default.conf

# 2. Copy your custom configuration file
# Ensure nginx.conf exists in your root directory!
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. Copy the dynamically located Angular build files
COPY --from=build /app/publish /usr/share/nginx/html/

# 4. Ensure correct permissions so Nginx can read the files
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]