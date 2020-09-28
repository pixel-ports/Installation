FROM pixelh2020/dashboard-base:1.0.0

#ENV PIXEL_DOMAIN .pixel-ports.eu
ARG PIXEL_DOMAIN
RUN ./configure.sh
# construir aplicación para producción minificada
RUN npm run build:prod

