import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("./cert/key.pem"),
      cert: fs.readFileSync("./cert/cert.pem"),
    },
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "@components": `${path.resolve(__dirname, "./src/components/")}`,
      "@styles": `${path.resolve(__dirname, "./src/styles/")}`,
      "@public": `${path.resolve(__dirname, "./public/")}`,
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@app-types": path.resolve(__dirname, "./src/types"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
});
