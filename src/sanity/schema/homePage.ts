export default {
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    {
      name: "heroCarousel",
      title: "Hero Image Carousel",
      description:
        "Rotating banner slides at the top of the home page. Add an image, headline and a call-to-action for each slide. If left empty, a set of default branded slides is shown.",
      type: "array",
      of: [
        {
          type: "object",
          name: "heroSlide",
          fields: [
            {
              name: "image",
              title: "Background Image",
              type: "image",
              options: { hotspot: true },
            },
            { name: "eyebrow", title: "Eyebrow (small label)", type: "string" },
            { name: "headline", title: "Headline", type: "string" },
            { name: "subtext", title: "Supporting Text", type: "text" },
            { name: "ctaLabel", title: "Button Label", type: "string" },
            { name: "ctaHref", title: "Button URL Path", type: "string" },
            {
              name: "theme",
              title: "Fallback Gradient (used when no image is set)",
              type: "string",
              options: {
                list: [
                  { title: "Royal Blue", value: "blue" },
                  { title: "Navy", value: "navy" },
                  { title: "Teal", value: "teal" },
                ],
                layout: "radio",
              },
              initialValue: "blue",
            },
          ],
          preview: {
            select: { title: "headline", subtitle: "eyebrow", media: "image" },
          },
        },
      ],
    },
    {
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        { name: "headline", title: "Headline (3-5 words)", type: "string" },
        { name: "subhead", title: "Subheading", type: "string" },
        { name: "intro", title: "Introduction", type: "text" },
        { name: "supportingLine", title: "Supporting Line", type: "text" },
        {
          name: "primaryCta",
          title: "Primary Call to Action",
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "href", title: "URL Path", type: "string" },
          ],
        },
      ],
    },
    {
      name: "keyHighlights",
      title: "Key Highlights (Metrics Band)",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "corporateSolutions",
      title: "Corporate Solutions Links",
      type: "array",
      of: [
        {
          type: "object",
          name: "solutionLink",
          fields: [
            { name: "title", title: "Solution Name", type: "string" },
            { name: "href", title: "URL Path", type: "string" },
          ],
        },
      ],
    },
    {
      name: "educationalSolutions",
      title: "Educational Solutions Links",
      type: "array",
      of: [
        {
          type: "object",
          name: "solutionLink",
          fields: [
            { name: "title", title: "Solution Name", type: "string" },
            { name: "href", title: "URL Path", type: "string" },
          ],
        },
      ],
    },
    {
      name: "whyUs",
      title: "Why Us Section",
      type: "object",
      fields: [
        { name: "strapline", title: "Strapline", type: "string" },
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
