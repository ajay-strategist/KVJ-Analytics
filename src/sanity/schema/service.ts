export default {
  name: "service",
  title: "Service/Solution",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Corporate Solutions", value: "corporate" },
          { title: "Educational Solutions", value: "educational" },
          { title: "Training Programs", value: "training" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "icon",
      title: "Icon Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "body",
      title: "Body Content",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
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
