FROM node as builder
WORKDIR /app
COPY package.json .
RUN npm --registry https://registry.npm.taobao.org install
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html/
