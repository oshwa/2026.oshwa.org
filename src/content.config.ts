import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const talks = defineCollection({
    loader: glob({pattern: "**/*.mdx", base: "src/data/talks/",}),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        start: z.string(),
        end: z.string(),
        presenter: z.string().optional(),
        plenary: z.boolean().default(false),
        break: z.boolean().default(false),
        location: z.string().optional(),
    }),
});


const workshops = defineCollection({
    loader: glob({pattern: "**/*.mdx", base: "src/data/workshops/",}),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        start: z.string(),
        end: z.string(),
        presenter: z.string().optional(),
        location: z.string().optional(),
        break: z.boolean().default(false),
        register: z.string().optional(),
    }),
});

export const collections = { talks, workshops };
