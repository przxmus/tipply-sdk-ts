import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeRapide from "starlight-theme-rapide";

export default defineConfig({
  site: "https://tipply-sdk.przxmus.dev",
  integrations: [
    starlight({
      title: "Tipply SDK TS",
      description:
        "English documentation for the unofficial TypeScript SDK for Tipply, including authenticated and public clients, realtime TIP_ALERT helpers, transport behavior, and typed resources.",
      plugins: [starlightThemeRapide()],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/przxmus/tipply-sdk-ts",
        },
      ],
      head: [
        {
          tag: "meta",
          attrs: {
            name: "author",
            content: "przxmus",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "robots",
            content: "index,follow,max-image-preview:large",
          },
        },
        {
          tag: "script",
          attrs: {
            type: "application/ld+json",
          },
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Tipply SDK TS",
            description:
              "English documentation for the unofficial TypeScript SDK for Tipply, including authenticated and public clients, realtime TIP_ALERT helpers, transport behavior, and typed resources.",
            url: "https://tipply-sdk.przxmus.dev",
            inLanguage: "en",
          }),
        },
        {
          tag: "script",
          attrs: {
            type: "application/ld+json",
          },
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: "tipply-sdk-ts",
            description:
              "Unofficial TypeScript SDK for Tipply with authenticated resources, public widget reads, and realtime TIP_ALERT helpers.",
            codeRepository: "https://github.com/przxmus/tipply-sdk-ts",
            programmingLanguage: "TypeScript",
            runtimePlatform: ["Bun", "Node.js", "Web Browser"],
            url: "https://tipply-sdk.przxmus.dev",
          }),
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          autogenerate: { directory: "getting-started" },
        },
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
