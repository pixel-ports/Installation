FROM pixelh2020/dashboard-base:1.0.0

# copiar los archivos y carpetas del proyecto al directorio de trabajo actual (es decir, la carpeta 'app')
COPY . .

# construir aplicación para producción minificada
RUN npm run build:prod

EXPOSE 8080
CMD [ "http-server", "dist" ]


LABEL MAINTAINER jmartinez@prodevelop.es