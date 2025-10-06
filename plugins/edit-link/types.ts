import type { IntegrationResolvedRoute } from "astro";

export type RouteInfo = {
    pathname: NonNullable<IntegrationResolvedRoute["pathname"]>,
    pattern: IntegrationResolvedRoute["pattern"],
    patternRegex: IntegrationResolvedRoute["patternRegex"],
    entrypoint: IntegrationResolvedRoute["entrypoint"],
    params: IntegrationResolvedRoute["params"],
    segments: IntegrationResolvedRoute["segments"],
    redirect: IntegrationResolvedRoute["redirect"],
}

declare global {
    namespace App {
        interface Locals {
            route: RouteInfo | null;
        }
    }
}
