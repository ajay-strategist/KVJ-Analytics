export interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "phone" | "textarea" | "select" | "radio" | "checkbox" | "date";
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select, radio, checkbox
  conditional?: {
    fieldId: string;
    value: string;
  };
}

export const REGISTRATION_FIELDS: FormField[] = [
  {
    id: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    id: "email",
    label: "Email Address",
    type: "email",
    placeholder: "example@domain.com",
    required: true,
  },
  {
    id: "phone",
    label: "Phone Number",
    type: "phone",
    placeholder: "e.g. +91 9961813730",
    required: true,
  },
  {
    id: "whatsapp_number",
    label: "WhatsApp Number",
    type: "phone",
    placeholder: "e.g. +91 9961813730 (optional)",
    required: false,
  },
  {
    id: "course_id",
    label: "Select Course / Program",
    type: "select",
    required: true,
    options: [], // To be populated dynamically from published courses in Supabase
  },
  {
    id: "training_mode",
    label: "Preferred Learning Mode",
    type: "select",
    required: true,
    options: ["online", "one-to-one", "college", "corporate"],
  },
  {
    id: "location",
    label: "Current Location",
    type: "text",
    placeholder: "Your city/state",
    required: true,
  },
  {
    id: "current_profession",
    label: "Your Current Profession",
    type: "select",
    required: true,
    options: ["Student", "Job Seeker", "Working Professional (IT)", "Working Professional (Non-IT)", "Business Owner", "Other"],
  },
  // Conditional Fields for Corporate
  {
    id: "organization",
    label: "Company / Organization Name",
    type: "text",
    placeholder: "Enter company name",
    required: true,
    conditional: {
      fieldId: "training_mode",
      value: "corporate",
    },
  },
  // Conditional Fields for College
  {
    id: "college_name",
    label: "College / University Name",
    type: "text",
    placeholder: "Enter institution name",
    required: true,
    conditional: {
      fieldId: "training_mode",
      value: "college",
    },
  },
  {
    id: "current_education",
    label: "Current Degree & Branch",
    type: "text",
    placeholder: "e.g. B.Tech CS (Final Year)",
    required: true,
    conditional: {
      fieldId: "training_mode",
      value: "college",
    },
  },
  // Conditional Fields for One-to-One
  {
    id: "preferred_start_date",
    label: "Preferred Start Date",
    type: "date",
    required: false,
    conditional: {
      fieldId: "training_mode",
      value: "one-to-one",
    },
  },
  // Optional Message
  {
    id: "message",
    label: "Additional Information / Requirements",
    type: "textarea",
    placeholder: "Tell us about your learning goals or dynamic training needs...",
    required: false,
  },
];
