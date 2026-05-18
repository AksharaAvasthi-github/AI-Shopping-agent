import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cwd } from "node:process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), "");
  const n8nWebhookUrl =
    env.VITE_N8N_WEBHOOK_URL || env.N8N_WEBHOOK_URL || "";
  const localWebhookUrl = n8nWebhookUrl ? new URL(n8nWebhookUrl) : null;
  const useProxy =
    localWebhookUrl &&
    ["localhost", "127.0.0.1", "0.0.0.0"].includes(localWebhookUrl.hostname);

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __N8N_WEBHOOK_URL__: JSON.stringify(n8nWebhookUrl),
    },
    server: useProxy
      ? {
          proxy: {
            "/api/n8n-webhook": {
              target: localWebhookUrl.origin,
              changeOrigin: true,
              secure: false,
              rewrite: () =>
                `${localWebhookUrl.pathname}${localWebhookUrl.search}`,
            },
          },
        }
      : undefined,
  };
});