import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@axios": path.resolve(__dirname, "src/main"),
      "@services": path.resolve(__dirname, "src/features/services"),
      "@api": path.resolve(__dirname, "src/features/api"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@admin": path.resolve(__dirname, "src/admin"),
      "@context": path.resolve(__dirname, "src/features/context"),
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@lang": path.resolve(__dirname, "src/lang"),
    },
  },
  plugins: [react()],
})
