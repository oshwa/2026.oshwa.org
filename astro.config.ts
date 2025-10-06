// @ts-check
import { defineConfig } from "astro/config";
import { default as editLink } from "./plugins/edit-link/integration";

// https://astro.build/config
export default defineConfig({
    site: "https://2026.oshwa.org",
    integrations: [editLink()],
});
