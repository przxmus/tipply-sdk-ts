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
          label: "Pierwsze kroki",
          items: [
            { slug: "getting-started", label: "Pierwsze kroki" },
            { slug: "authentication", label: "Uwierzytelnienie" },
          ],
        },
        {
          label: "Przewodniki",
          items: [
            { slug: "authenticated-client", label: "Klient autoryzowany" },
            { slug: "public-client", label: "Klient publiczny" },
            { slug: "realtime-tip-alerts", label: "Realtime TIP_ALERT" },
            { slug: "errors-and-transport", label: "Błędy i transport" },
            { slug: "examples", label: "Przykłady użycia" },
          ],
        },
        {
          label: "Referencja",
          items: [
            { slug: "sdk-reference", label: "Referencja SDK" },
          ],
        },
      ],
    }),
  ],
});
