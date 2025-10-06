import { defineMiddleware } from "astro:middleware";
import { default as Routes } from "./routes";
import "./types";

export const onRequest  = defineMiddleware(async (context, next) => {
    context.locals.route = Routes[context.url.pathname] ?? null;
    return next();
});
