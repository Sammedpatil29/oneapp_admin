# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# 1. Remove the default Nginx content and config
RUN rm -rf /usr/share/nginx/html/*
RUN rm /etc/nginx/conf.d/default.conf

# 2. Copy your custom configuration file
# Ensure nginx.conf exists in your root directory!
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. Copy the Angular build files
# Using a wildcard (*) ensures we grab the contents even if the folder name 
# is oneapp-admin or oneapp_admin.
COPY --from=build /app/dist/*/browser /usr/share/nginx/html/

# Fallback: If your Angular version doesn't use the /browser subfolder, 
# uncomment the line below and comment the one above.
# COPY --from=build /app/dist/oneapp-admin /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]