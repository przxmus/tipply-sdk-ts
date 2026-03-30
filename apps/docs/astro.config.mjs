import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeRapide from "starlight-theme-rapide";

export default defineConfig({
  site: "http://localhost:4321",
  integrations: [
    starlight({
      title: "Tipply SDK TS",
      description: "Pełna dokumentacja TypeScript SDK do Tipply.",
      plugins: [starlightThemeRapide()],
      sidebar: [
        {
          label: "Start",
          items: [
            { slug: "getting-started", label: "Getting Started" },
            { slug: "authentication", label: "Authentication" },
          ],
        },
        {
          label: "Guides",
          items: [
            { slug: "authenticated-client", label: "Authenticated Client" },
            { slug: "public-client", label: "Public Client" },
            { slug: "realtime-tip-alerts", label: "Realtime Tip Alerts" },
            { slug: "errors-and-transport", label: "Errors and Transport" },
            { slug: "examples", label: "Usage Examples" },
          ],
        },
        {
          label: "Reference",
          items: [
            { slug: "sdk-reference", label: "SDK Reference" },
          ],
        },
      ],
    }),
  ],
});
