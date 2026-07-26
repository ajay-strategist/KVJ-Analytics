export default {
  name: "productsPage",
  title: "Products Page Settings",
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
