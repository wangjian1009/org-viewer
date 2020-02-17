FROM node
WORKDIR /app
COPY package.json .
RUN npm --registry https://registry.npm.taobao.org install
COPY . .
CMD npm run serve
