export default {
  name: "course",
  title: "Course",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Course Title",
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
      name: "segment",
      title: "Audience Segment",
      type: "string",
      options: {
        list: [
          { title: "Corporate Solutions", value: "corporate" },
          { title: "College Programs", value: "college" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "summary",
      title: "Course Summary",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "syllabus",
      title: "Syllabus (Portable Text)",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "priceINR",
      title: "Price (INR)",
      type: "number",
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: "isPaid",
      title: "Is Paid Course",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "thumbnail",
      title: "Course Thumbnail",
      type: "image",
      options: { hotspot: true },
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
