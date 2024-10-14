FROM  --platform=linux/amd64  mcr.microsoft.com/v1.48.0-focal as luis-automation-image
#FROM mcr.microsoft.com/playwright:v1.46.0-noble
#FROM  --platform=linux/amd64  mcr.microsoft.com/playwright:v1.46.0-bionic as luis-automation-image

# Ubuntu 24.04 LTS (Noble Numbat), image tags include noble
# Ubuntu 22.04 LTS (Jammy Jellyfish), image tags include jammy
# Ubuntu 20.04 LTS (Focal Fossa), image tags include focal

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install npm@8.11.0

RUN npm install 

COPY . .

# Exponer puertos necesarios (Allure y reporte HTML)
EXPOSE 9323 8080

# Comando por defecto al ejecutar el contenedor
CMD ["npm", "run", "test:reports"]

# # Usar una imagen oficial de Node.js
# FROM node:20-bookworm

# # Instalar dependencias del sistema necesarias para Playwright
# RUN apt-get update && apt-get install -y \
#     libnss3 libnspr4 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 \
#     libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
#     libxfixes3 libxrandr2 libgbm1 libasound2 libatspi2.0-0 \
#     --no-install-recommends && rm -rf /var/lib/apt/lists/*

# # Crear y definir el directorio de trabajo
# WORKDIR /app

# # Copiar archivos de configuración del proyecto
# COPY package*.json ./

# # Instalar dependencias del proyecto y Allure
# RUN npm install
# RUN npm install -g allure-commandline --save-dev

# # Instalar los navegadores de Playwright
# RUN npx -y playwright@1.46.0 install --with-deps

# # Copiar el resto de la aplicación
# COPY . .


