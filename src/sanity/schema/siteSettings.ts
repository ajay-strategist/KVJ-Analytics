import { Cog } from "lucide-react";

export default {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Limit to single instance in desk structure
  fields: [
    {
      name: "companyName",
      title: "Company Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "regionsServed",
      title: "Regions Served",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "contactInfo",
      title: "Contact Information",
      type: "object",
      fields: [
        { name: "email", title: "Email Address", type: "string" },
        {
          name: "phones",
          title: "Phone Numbers",
          type: "array",
          of: [{ type: "string" }],
        },
        { name: "address", title: "Office Address", type: "text" },
        { name: "gstNumber", title: "GST Number", type: "string" },
      ],
    },
    {
      name: "navItems",
      title: "Navigation Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "navLink",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "href", title: "URL Path", type: "string" },
          ],
        },
      ],
    },
    {
      name: "footerDescription",
      title: "Footer Description",
      type: "text",
    },
    {
      name: "footerTagline",
      title: "Footer Tagline",
      type: "string",
    },
    {
      name: "footerColumns",
      title: "Footer Columns",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerColumn",
          fields: [
            { name: "heading", title: "Column Heading", type: "string" },
            {
              name: "links",
              title: "Links",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "link",
                  fields: [
                    { name: "label", title: "Label", type: "string" },
                    { name: "href", title: "URL Path", type: "string" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "quickLinks",
      title: "Quick Links",
      type: "array",
      of: [
        {
          type: "object",
          name: "link",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "href", title: "URL Path", type: "string" },
          ],
        },
      ],
    },
    {
      name: "seo",
      title: "Global SEO Defaults",
      type: "object",
      fields: [
        { name: "metaTitle", title: "Meta Title", type: "string" },
        { name: "metaDescription", title: "Meta Description", type: "text" },
        { name: "ogImage", title: "OG Image", type: "image" },
      ],
    },
    {
      name: "analytics",
      title: "Analytics Tracking IDs",
      type: "object",
      fields: [
        { name: "gtmId", title: "Google Tag Manager ID", type: "string" },
        { name: "ga4Id", title: "Google Analytics 4 ID", type: "string" },
        { name: "clarityId", title: "Microsoft Clarity ID", type: "string" },
        { name: "metaPixelId", title: "Meta Pixel ID", type: "string" },
        { name: "linkedinId", title: "LinkedIn Insight ID", type: "string" },
      ],
    },
  ],
};
