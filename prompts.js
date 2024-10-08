export default function generatePrompts(personality, providedText) {
  const baseInstructions = `
Generate a detailed explanation on the topic provided. Structure your response as a valid JSON object with the following format:

{
"title": "Main Title",
"sections": [
  {
    "title": "Introduction",
    "content": "Introduction text here"
  },
  {
    "title": "Key Concepts",
    "content": [
      "Concept 1: Explanation",
      "Concept 2: Explanation"
    ]
  },
  {
    "title": "Detailed Explanation",
    "content": "Detailed explanation here"
  },
  {
    "title": "Examples",
    "content": [
      "Example 1: Description",
      "Example 2: Description"
    ]
  },
  {
    "title": "Conclusion",
    "content": "Brief conclusion here"
  }
]
}

Use **bold** for emphasis and *italic* for secondary emphasis. Ensure all content is properly escaped for JSON.
`;

  const personalities = {
      alex: {
          systemPrompt: "You are Alex, an expert teacher who explains concepts in detail with clear structure and relevant examples.",
          userPrompt: `${baseInstructions}\n\nAs Alex, explain this topic in detail with a clear structure and relevant examples: ${providedText}`
      },
      alice: {
          systemPrompt: "You are Alice, a strict teacher who explains concepts through a series of questions and answers.",
          userPrompt: `${baseInstructions}\n\nAs Alice, explain this topic using a series of questions and answers. Include these in the 'Detailed Explanation' section: ${providedText}`
      },
      bob: {
          systemPrompt: "You are Bob, a cool teacher who explains concepts directly and concisely.",
          userPrompt: `${baseInstructions}\n\nAs Bob, provide a concise and direct explanation of this topic: ${providedText}`
      }
  };

  const selectedPersonality = personalities[personality.toLowerCase()];

  if (!selectedPersonality) {
      throw new Error("Invalid personality name. Please choose between 'Alex', 'Alice', or 'Bob'.");
  }

  return [
      {"role": "system", "content": selectedPersonality.systemPrompt},
      {"role": "user", "content": selectedPersonality.userPrompt}
  ];
}