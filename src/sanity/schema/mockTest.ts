export default {
  name: "mockTest",
  title: "Mock Test",
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
      title: "Test Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "durationMins",
      title: "Duration (Minutes)",
      type: "number",
      initialValue: 30,
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: "passMark",
      title: "Pass Mark (Score)",
      type: "number",
      initialValue: 10,
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "questions",
      title: "Questions List",
      type: "array",
      of: [
        {
          type: "object",
          name: "question",
          fields: [
            {
              name: "stem",
              title: "Question text",
              type: "text",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "options",
              title: "Options",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule: any) => Rule.required().min(2),
            },
            {
              name: "correctIndex",
              title: "Correct Option Index (0-indexed)",
              type: "number",
              validation: (Rule: any) => Rule.required().min(0),
            },
            {
              name: "marks",
              title: "Marks",
              type: "number",
              initialValue: 1,
              validation: (Rule: any) => Rule.required().min(1),
            },
          ],
        },
      ],
    },
  ],
};
