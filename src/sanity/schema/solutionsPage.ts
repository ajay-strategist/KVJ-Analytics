export default {
  name: "solutionsPage",
  title: "Solutions Landing Page",
  type: "document",
  fields: [
    {
      name: "category",
      title: "Solutions Category",
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
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "strapline",
      title: "Strapline",
      type: "string",
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
