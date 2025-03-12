import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@axios": path.resolve(__dirname, "src/main"),
      "@context": path.resolve(__dirname, "src/features/context"),
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@redux": path.resolve(__dirname, "src/features/redux"),
      "@config": path.resolve(__dirname, "src/config"),
      "@auth" : path.resolve(__dirname, "src/auth"),
      "@lang": path.resolve(__dirname, "src/lang"),
    },
  },
  plugins: [react()],
})
