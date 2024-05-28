FROM node:20 as builder
COPY ./ /opt/app
WORKDIR /opt/app
RUN npm install && env CI=1 npm run test && npm run lint && npm run build

FROM nginx:stable-alpine
COPY index-redirect.html /usr/share/nginx/html/index.html
COPY --from=builder /opt/app/dist/ /usr/share/nginx/html/metronome/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
