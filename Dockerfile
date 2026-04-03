# Multi-stage build for a Vite + React frontend
FROM node:20-alpine AS builder
WORKDIR /app
 
# Install dependencies using lockfile for reproducible builds
COPY package.json package-lock.json ./
RUN npm ci
 
# Build the app
COPY . .
RUN npm run build
 
# Serve static assets with nginx
FROM nginx:1.27-alpine AS runner
 
# Configure nginx for SPA routing
RUN printf 'server {\n  listen 80;\n  server_name _;\n\n  root /usr/share/nginx/html;\n  index index.html;\n\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
 
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]