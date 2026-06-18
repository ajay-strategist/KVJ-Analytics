export default {
  name: "contactPage",
  title: "Contact Page Settings",
  type: "document",
  fields: [
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
      name: "inquiryAreas",
      title: "Inquiry Areas (Dropdown options)",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "ctas",
      title: "CTAs List",
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
