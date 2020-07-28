FROM gmathieu/node-browsers:3.0.0 AS build

COPY package.json /usr/angular-workdir/
WORKDIR /usr/angular-workdir
RUN npm install

COPY ./ /usr/angular-workdir
RUN npm run build

FROM nginx:1.15.8-alpine

## Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY ./dev/nginx.conf /etc/nginx/nginx.conf

COPY --from=build  /usr/angular-workdir/dist/customization /usr/share/nginx/html

# RUN echo "mainFileName=\"\$(ls /usr/share/nginx/html/main*.js)\" && \
#          envsubst '\$BACKEND_API_URL \$DEFAULT_LANGUAGE ' < \${mainFileName} > main.tmp && \
#          mv main.tmp  \${mainFileName} && nginx -g 'daemon off;'" > run.sh

RUN echo "nginx -g 'daemon off;'" > run.sh
ENTRYPOINT ["sh", "run.sh"]