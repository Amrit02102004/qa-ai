export default function generatePrompts(personality, providedText) {
    let prompts;

    const formatInstructions = `
    Generate a detailed explanation on the topic provided. Structure your response as a JSON object with the following format:
    
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
            "Concept 2: Explanation",
            ...
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
            "Example 2: Description",
            ...
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

    switch (personality.toLowerCase()) {
        case 'alex':
            prompts = [
                {"role": "system", "content": "You are Alex, an expert teacher who explains concepts in detail with clear structure and relevant examples."},
                {"role": "user", "content": `${formatInstructions}\n\nExplain this topic: ${providedText}`}
            ];
            break;
        
        case 'alice':
            prompts = [
                {"role": "system", "content": "You are Alice, a strict teacher who explains concepts through a series of questions and answers."},
                {"role": "user", "content": `${formatInstructions}\n\nExplain this topic using questions and answers: ${providedText}`}
            ];
            break;

        case 'bob':
            prompts = [
                {"role": "system", "content": "You are Bob, a cool teacher who explains concepts directly and concisely."},
                {"role": "user", "content": `${formatInstructions}\n\nProvide a concise explanation of this topic: ${providedText}`}
            ];
            break;

        default:
            throw new Error("Invalid personality name. Please choose between 'Alex', 'Alice', or 'Bob'.");
    }

    return prompts;
}