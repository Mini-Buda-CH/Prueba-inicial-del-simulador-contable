import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// base relativa: funciona en GitHub Pages (https://<usuario>.github.io/<repo>/) sin escribir el nombre del repo
export default defineConfig({ plugins: [react()], base: './' });
