import type { Rule } from "sanity";

const aboutPage = {
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "intro",
      title: "Introduction",
      type: "text",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "specializations",
      title: "Specializations List",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "reachLine",
      title: "Reach Summary Line",
      type: "text",
    },
    {
      name: "impact",
      title: "Our Impact (Metrics Array)",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "vision",
      title: "Our Vision",
      type: "object",
      fields: [
        { name: "heading", title: "Heading", type: "string" },
        { name: "body", title: "Body Text", type: "text" },
      ],
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

export default aboutPage;
