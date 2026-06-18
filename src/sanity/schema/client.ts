export default {
  name: "client",
  title: "Client",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Client Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "logo",
      title: "Client Logo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "websiteUrl",
      title: "Website URL (Optional)",
      type: "url",
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    },
    {
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: true,
    },
  ],
};
