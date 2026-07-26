import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemas } from "./src/sanity/schema";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "kvj-analytics";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "kvj-analytics",
  title: "KVJ Analytics Content Manager",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemas,
  },
  // Document structure singletons configuration
  document: {
    // For singletons (like siteSettings and homePage), prevent creation of multiple instances
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter(
          (template) =>
            !["siteSettings", "homePage", "aboutPage", "productsPage", "trainingPage", "impactPage", "contactPage"].includes(
              template.templateId
            )
        );
      }
      return prev;
    },
    actions: (prev, { schemaType }) => {
      if (
        ["siteSettings", "homePage", "aboutPage", "productsPage", "trainingPage", "impactPage", "contactPage"].includes(
          schemaType
        )
      ) {
        return prev.filter(
          ({ action }) =>
            !["delete", "discardChanges", "unpublish", "duplicate"].includes(action || "")
        );
      }
      return prev;
    },
  },
});
