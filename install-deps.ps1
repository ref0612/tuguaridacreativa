# Script para instalar dependencias
Write-Host "Limpiando node_modules y package-lock.json..."
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue

Write-Host "Configurando npm..."
npm config set strict-ssl false
npm config set registry https://registry.npmjs.org/
npm config set audit false
npm config set fund false

Write-Host "Instalando dependencias principales..."
npm install --no-fund --no-audit --legacy-peer-deps react@18.2.0 react-dom@18.2.0 react-scripts@5.0.1

Write-Host "Instalando dependencias de Material-UI..."
npm install --no-fund --no-audit --legacy-peer-deps @mui/material@5.15.10 @emotion/react@11.11.3 @emotion/styled@11.11.0 @mui/icons-material@5.15.10

Write-Host "Instalando dependencias de Redux..."
npm install --no-fund --no-audit --legacy-peer-deps @reduxjs/toolkit@2.2.1 react-redux@8.1.3

Write-Host "Instalando dependencias de TypeScript..."
npm install --no-fund --no-audit --legacy-peer-deps typescript@4.9.5 @types/node@18.19.0 @types/react@18.2.0 @types/react-dom@18.2.0 @types/react-router-dom@5.3.3 @types/react-redux@7.1.25

Write-Host "Instalando dependencias adicionales..."
npm install --no-fund --no-audit --legacy-peer-deps axios formik yup react-router-dom@6.22.1

Write-Host "Instalación completada."
