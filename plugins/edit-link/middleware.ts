import { defineMiddleware } from "astro:middleware";
import { default as Routes } from "./routes";
import "./types";

export const onRequest  = defineMiddleware(async (context, next) => {
    let pathname = context.url.pathname;
    pathname = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    context.locals.route = Routes[pathname] ?? null;
    return next();
});
