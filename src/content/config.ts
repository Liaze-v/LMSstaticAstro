import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

const formation = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		section: z.string(),
		privatecontend: z.boolean(),
		duration: z.string(),
		videolink: z.string(),
		posttitle: z.string(),
		position: z.number(),
		filedownload: z.array(z.string()).optional(),
		filedownload2: z.array(z.string()).optional(),
	}),
});
const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		heroImage: z.string().optional().default('/img/blogPlaceHolder.jpg'),
	}),
});


export const collections = { formation,blog };