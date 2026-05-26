import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const baseSchema = z.object({
	title: z.string(),
	description: z.string(),
	publishDate: z.coerce.date(),
	tags: z.array(z.string()),
	img: z.string(),
	img_alt: z.string().optional(),
	lang: z.enum(['en', 'ar']).optional().default('en'),
});

export const collections = {
	work: defineCollection({
		loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
		schema: baseSchema,
	}),
	blog: defineCollection({
		loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
		schema: baseSchema,
	}),
	hobby: defineCollection({
		loader: glob({ pattern: "**/*.md", base: "./src/content/hobby" }),
		schema: baseSchema,
	}),
};