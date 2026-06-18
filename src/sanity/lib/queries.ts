import { groq } from "next-sanity";

// Global site settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    companyName,
    tagline,
    logo,
    regionsServed,
    contactInfo,
    navItems,
    footerDescription,
    footerTagline,
    footerColumns,
    quickLinks,
    socialLinks,
    seo,
    analytics
  }
`;

// Home page configuration
export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    heroCarousel,
    hero,
    keyHighlights,
    corporateSolutions,
    educationalSolutions,
    whyUs,
    seo
  }
`;

// About page configuration
export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    title,
    intro,
    specializations,
    reachLine,
    impact,
    vision,
    seo
  }
`;

// Solutions page configuration
export const solutionsPageQuery = groq`
  *[_type == "solutionsPage" && category == $category][0] {
    category,
    heading,
    strapline,
    intro,
    seo
  }
`;

// Services list filtered by category
export const servicesQuery = groq`
  *[_type == "service" && category == $category] | order(order asc) {
    title,
    "slug": slug.current,
    category,
    shortDescription,
    icon,
    body,
    order,
    seo
  }
`;

// Individual service detail
export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    category,
    shortDescription,
    icon,
    body,
    order,
    seo
  }
`;

// Products page settings
export const productsPageQuery = groq`
  *[_type == "productsPage"][0] {
    heading,
    intro,
    seo
  }
`;

// Products list
export const productsQuery = groq`
  *[_type == "product"] | order(order asc) {
    name,
    "slug": slug.current,
    tagline,
    description,
    keyFeatures,
    media,
    order,
    seo
  }
`;

// Individual product detail
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    tagline,
    description,
    keyFeatures,
    media,
    order,
    seo
  }
`;

// Training page settings
export const trainingPageQuery = groq`
  *[_type == "trainingPage"][0] {
    heading,
    strapline,
    intro,
    trainingAreas,
    approach,
    seo
  }
`;

// Impact page settings
export const impactPageQuery = groq`
  *[_type == "impactPage"][0] {
    heading,
    intro,
    highlights,
    industriesServed,
    seo
  }
`;

// Contact page settings
export const contactPageQuery = groq`
  *[_type == "contactPage"][0] {
    heading,
    strapline,
    intro,
    inquiryAreas,
    ctas,
    seo
  }
`;

// ==========================================
//  BLOG / INSIGHTS QUERIES
// ==========================================

// List all blog posts
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    featured,
    author->{
      name,
      "slug": slug.current,
      image
    },
    category->{
      title,
      "slug": slug.current
    },
    coverImage,
    body
  }
`;

// Individual blog post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    publishedAt,
    featured,
    author->{
      name,
      "slug": slug.current,
      image,
      bio
    },
    category->{
      title,
      "slug": slug.current
    },
    coverImage,
    body,
    seo
  }
`;

// List blog posts by category slug
export const postsByCategoryQuery = groq`
  *[_type == "post" && category->slug.current == $slug] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    featured,
    author->{
      name,
      "slug": slug.current,
      image
    },
    category->{
      title,
      "slug": slug.current
    },
    coverImage
  }
`;

// List blog posts by author slug
export const postsByAuthorQuery = groq`
  *[_type == "post" && author->slug.current == $slug] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    featured,
    author->{
      name,
      "slug": slug.current,
      image
    },
    category->{
      title,
      "slug": slug.current
    },
    coverImage
  }
`;

// Fetch author info by slug
export const authorBySlugQuery = groq`
  *[_type == "author" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    image,
    bio
  }
`;

// Fetch category info by slug
export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    description
  }
`;

// Fetch all clients sorted by order
export const clientsQuery = groq`
  *[_type == "client"] | order(order asc) {
    name,
    logo,
    websiteUrl,
    featured,
    order
  }
`;

