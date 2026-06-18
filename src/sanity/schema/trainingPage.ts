import type { Rule } from "sanity";

const trainingPage = {
  name: "trainingPage",
  title: "Training Page Settings",
  type: "document",
  fields: [
    {
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
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
      name: "trainingAreas",
      title: "Training Areas",
      type: "array",
      of: [
        {
          type: "object",
          name: "trainingArea",
          fields: [
            { name: "title", title: "Area Name", type: "string" },
            {
              name: "slug",
              title: "Slug",
              type: "slug",
              options: {
                source: (
                  _doc: Record<string, unknown>,
                  options: { parent: { title: string } }
                ) => options.parent.title,
              },
            },
          ],
        },
      ],
    },
    {
      name: "approach",
      title: "Our Approach List",
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

export default trainingPage;
