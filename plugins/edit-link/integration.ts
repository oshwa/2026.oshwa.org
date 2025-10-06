// See: https://github.com/samualtnorman/astro-path-helpers/blob/1497b2585641fc825d6590fd936d970587564981/src/integration.ts#L52

import type { AstroIntegration } from "astro";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { RouteInfo } from "./types";

export default function createPlugin(): AstroIntegration {
    let codegenDir: URL;
    let generatedFile: URL;
    let projectRoutes: Record<string, RouteInfo> = {};

    return {
        name: "edit-link",
        hooks: {
            "astro:config:setup": async ({
                updateConfig,
                createCodegenDir,
                addMiddleware,
            }) => {
                codegenDir = createCodegenDir();
                generatedFile = new URL("generated.ts", codegenDir);

                updateConfig({
                    vite: { plugins: [setupVirtualModule(generatedFile)] },
                });
                addMiddleware({
                    entrypoint: new URL("./middleware.ts", import.meta.url),
                    order: "pre",
                });
            },
            "astro:config:done": ({ injectTypes }) => {
                injectTypes({
                    filename: "generated.d.ts",
                    content: "declare module 'virtual:routes' {}",
                });
            },
            "astro:routes:resolved": ({ routes, logger }) => {
                for (const route of routes) {
                    if (
                        !route.isPrerendered ||
                        !route.pathname ||
                        route.type != "page" ||
                        route.origin != "project"
                    ) {
                        continue;
                    }
                    projectRoutes[route.pathname] = {
                        pathname: route.pathname,
                        pattern: route.pattern,
                        patternRegex: route.patternRegex,
                        entrypoint: route.entrypoint,
                        params: route.params,
                        segments: route.segments,
                        redirect: route.redirect,
                    };
                }

                writeFileSync(
                    generatedFile,
                    generateRoutesFile(projectRoutes),
                    "utf-8"
                );

                logger.info(`Gathered ${Object.keys(projectRoutes).length} routes.`)
            },
        },
    };
}

function setupVirtualModule(generatedFile: URL) {
    const virtualModuleId = "virtual:routes";
    const resolvedVirtualModuleId = `\0${virtualModuleId}`;
    const generatedPath = fileURLToPath(generatedFile);

    return {
        name: "virtual-routes", // required, will show up in warnings and errors
        resolveId(id: string) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        load(id: string) {
            if (id === resolvedVirtualModuleId) {
                return `export * from "${generatedPath}"; export { default } from "${generatedPath}";`;
            }
        },
    };
}

function generateRoutesFile(routes: Record<string, RouteInfo>) {
    return `export default ${JSON.stringify(routes)};`;
}
