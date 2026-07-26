export default {
  name: "impactPage",
  title: "Impact Page Settings",
  type: "document",
  fields: [
    {
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "intro",
      title: "Introduction Text",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "highlights",
      title: "Highlights (Metrics Band)",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "industriesServed",
      title: "Industries Served List",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "seo",
      title: "Page SEO",
      type: "object",
      fields: [
        { name: "metaTitle", title: "Meta Title", type: "string" },
        { name: "metaDescription", title: "Meta Description", type: "text" },
        { name: "ogImage", title: "OG Image", type: "image" },
      ],
    },
  ],
};
