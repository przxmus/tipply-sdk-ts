import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeRapide from "starlight-theme-rapide";

export default defineConfig({
  site: "http://localhost:4321",
  integrations: [
    starlight({
      title: "Tipply SDK",
      description: "TypeScript SDK documentation for the Tipply API.",
      plugins: [starlightThemeRapide()],
      sidebar: [
        {
          label: "Documentation",
          items: [
            { slug: "getting-started", label: "Getting Started" },
            { slug: "sdk-reference", label: "SDK Reference" },
          ],
        },
      ],
    }),
  ],
});
