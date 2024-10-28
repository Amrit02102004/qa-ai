  // Define personality traits and conversation styles
  const personalityTraits = {
  alex: {
      name: "Alex",
      role: "Expert Teacher",
      style: "analytical and thorough",
      strengths: ["detailed explanations", "structured learning", "real-world examples"],
      responseFormat: {
          type: "detailed_explanation",
          structure: {
              conceptBreakdown: "Breaks down complex topics into digestible parts",
              theoreticalBackground: "Provides foundational theory",
              practicalApplications: "Shows real-world applications",
              commonMisconceptions: "Addresses potential confusion points",
              furtherLearning: "Suggests next steps for deeper understanding"
          }
      }
  },
  alice: {
      name: "Alice",
      role: "Socratic Guide",
      style: "questioning and disciplined",
      strengths: ["critical thinking", "structured questioning", "deep understanding"],
      responseFormat: {
          type: "socratic_dialogue",
          structure: {
              initialQuestion: "Opens with a thought-provoking question",
              guidedDiscovery: "Uses follow-up questions to lead to understanding",
              conceptValidation: "Checks understanding through targeted questions",
              challengingScenarios: "Presents edge cases to test comprehension",
              synthesis: "Helps piece together the complete picture"
          }
      }
  },
  bob: {
      name: "Bob",
      role: "Practical Mentor",
      style: "direct and relatable",
      strengths: ["simplification", "practical focus", "clear communication"],
      responseFormat: {
          type: "concise_practical",
          structure: {
              quickSummary: "Gets straight to the point",
              keyTakeaways: "Highlights most important aspects",
              practicalTips: "Provides actionable advice",
              commonPitfalls: "Warns about common mistakes",
              quickReference: "Creates easy-to-remember guidelines"
          }
      }
  }
  };

  // Generate initial conversation prompt
  function generateInitialPrompt(personality, topic) {
  const traits = personalityTraits[personality.toLowerCase()];

  if (!traits) {
      throw new Error("Invalid personality selected");
  }

  const systemPrompt = {
      role: "system",
      content: `You are ${traits.name}, a ${traits.role} who teaches in a ${traits.style} manner. 
      Your strengths are: ${traits.strengths.join(', ')}. 
      Maintain this teaching style and personality throughout the conversation.
      Always structure your response as a valid JSON object following your specific format.
      Remember to keep track of the conversation context for future reference.`
  };

  const userPrompt = {
      role: "user",
      content: generateFormatPrompt(traits, topic)
  };

  return [systemPrompt, userPrompt];
  }

  // Generate follow-up conversation prompt
  function generateFollowUpPrompt(personality, history, followUpQuestion) {
  const traits = personalityTraits[personality.toLowerCase()];

  if (!traits) {
      throw new Error("Invalid personality selected");
  }

  // Create a comprehensive context from history
  const conversationContext = history.map(entry => ({
      role: entry.role,
      content: entry.content
  }));

  const systemPrompt = {
      role: "system",
      content: `Continue as ${traits.name}, maintaining your ${traits.style} teaching style. 
      You have access to the complete conversation history and should maintain context.
      If asked about previous interactions, refer to the conversation history provided.
      Keep your response format consistent with your teaching style and format.
      For questions about previous conversation, respond naturally while maintaining your personality.`
  };

  // Add the new follow-up question
  const userPrompt = {
      role: "user",
      content: followUpQuestion
  };

  // Return all prompts in chronological order
  return [
      systemPrompt,
      ...conversationContext,
      userPrompt
  ];
  }

  // Helper function to generate format-specific prompts
  function generateFormatPrompt(traits, topic) {
  const basePrompt = `Please explain "${topic}" in your teaching style. `;

  switch (traits.responseFormat.type) {
      case "detailed_explanation":
          return basePrompt + `
              Provide a comprehensive explanation in this JSON format:
              {
                  "title": "Understanding ${topic}",
                  "theoreticalFoundation": "Explain core theoretical concepts",
                  "detailedAnalysis": "Break down each component",
                  "practicalApplications": "Provide real-world examples",
                  "commonMisconceptions": "Address potential confusion points",
                  "nextSteps": "Suggest areas for deeper learning"
              }`;

      case "socratic_dialogue":
          return basePrompt + `
              Guide the understanding through questions in this JSON format:
              {
                  "mainQuestion": "Pose the central question about ${topic}",
                  "guidingQuestions": ["Array of follow-up questions"],
                  "conceptChecks": ["Questions to verify understanding"],
                  "challengeScenarios": ["Questions about edge cases"],
                  "synthesisProblem": "Final question to tie everything together",
                  "context": "Brief explanation of why these questions matter"
              }`;

      case "concise_practical":
          return basePrompt + `
              Explain directly and practically in this JSON format:
              {
                  "summary": "Quick, clear explanation",
                  "keyPoints": ["Most important points to remember"],
                  "practicalTips": ["Actionable advice"],
                  "warnings": ["Common pitfalls to avoid"],
                  "quickGuide": "Easy reference summary",
                  "realWorldUse": "How to apply this knowledge"
              }`;

      default:
          throw new Error("Invalid response format type");
  }
  }

  // Export functions for use in the main application
  export { 
  generateInitialPrompt, 
  generateFollowUpPrompt,
  personalityTraits 
  };