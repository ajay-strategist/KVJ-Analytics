export default {
  name: "material",
  title: "Course Material",
  type: "document",
  fields: [
    {
      name: "course",
      title: "Associated Course",
      type: "reference",
      to: [{ type: "course" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "title",
      title: "Material Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "type",
      title: "Material Type",
      type: "string",
      options: {
        list: [
          { title: "PDF Document", value: "pdf" },
          { title: "Video URL", value: "video" },
          { title: "External Link", value: "link" },
          { title: "Rich Text", value: "richtext" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "pdfFile",
      title: "PDF File",
      type: "file",
      hidden: ({ parent }: { parent: any }) => parent?.type !== "pdf",
    },
    {
      name: "url",
      title: "Video / Resource URL",
      type: "url",
      hidden: ({ parent }: { parent: any }) =>
        parent?.type !== "video" && parent?.type !== "link",
    },
    {
      name: "body",
      title: "Rich Text Content",
      type: "array",
      of: [{ type: "block" }],
      hidden: ({ parent }: { parent: any }) => parent?.type !== "richtext",
    },
    {
      name: "isPreview",
      title: "Is Preview (Publicly Available)",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
    },
  ],
};
