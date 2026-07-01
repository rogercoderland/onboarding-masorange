import { z } from 'zod';

export const contentfulLinkSysSchema = z.object({
  type: z.literal('Link'),
  linkType: z.enum(['Entry', 'Asset']),
  id: z.string(),
});

export const contentfulLinkSchema = z.object({
  sys: contentfulLinkSysSchema,
});

export const contentfulEntrySysSchema = z.object({
  id: z.string(),
  type: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  revision: z.number().optional(),
  contentType: z
    .object({
      sys: z.object({
        id: z.string(),
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
      }),
    })
    .optional(),
});

export const contentfulEntrySchema = z.object({
  sys: contentfulEntrySysSchema,
  fields: z.record(z.string(), z.unknown()),
});

export const contentfulAssetSchema = z.object({
  sys: contentfulEntrySysSchema,
  fields: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    file: z
      .object({
        url: z.string(),
        fileName: z.string().optional(),
        contentType: z.string().optional(),
        details: z
          .object({
            size: z.number().optional(),
            image: z
              .object({ width: z.number(), height: z.number() })
              .optional(),
          })
          .optional(),
      })
      .optional(),
  }),
});

export const contentfulIncludesSchema = z.object({
  Entry: z.array(contentfulEntrySchema).optional(),
  Asset: z.array(contentfulAssetSchema).optional(),
});

export const contentfulCollectionSchema = z.object({
  sys: z.object({ type: z.literal('Array') }).optional(),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
  items: z.array(contentfulEntrySchema),
  includes: contentfulIncludesSchema.optional(),
});

export type ContentfulCollectionParsed = z.infer<
  typeof contentfulCollectionSchema
>;
