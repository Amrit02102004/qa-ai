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
    Always structure your response as a valid JSON object following your specific format.`
  };

  const userPrompt = {
    role: "user",
    content: generateFormatPrompt(traits, topic)
  };

  return [systemPrompt, userPrompt];
}

// Generate follow-up conversation prompt
function generateFollowUpPrompt(personality, previousContext, followUpQuestion) {
  const traits = personalityTraits[personality.toLowerCase()];
  
  if (!traits) {
    throw new Error("Invalid personality selected");
  }

  const systemPrompt = {
    role: "system",
    content: `Continue as ${traits.name}, maintaining your ${traits.style} teaching style. 
    Reference the previous discussion where relevant.
    Keep your response format consistent with your teaching style.`
  };

  const contextPrompt = {
    role: "assistant",
    content: previousContext
  };

  const userPrompt = {
    role: "user",
    content: followUpQuestion
  };

  return [systemPrompt, contextPrompt, userPrompt];
}

// Helper function to generate format-specific prompts
function generateFormatPrompt(traits, topic) {
  switch (traits.responseFormat.type) {
    case "detailed_explanation":
      return `
        Provide a comprehensive explanation of "${topic}" in this JSON format:
        {
          "title": "Understanding ${topic}",
          "theoreticalFoundation": "Explain core theoretical concepts",
          "detailedAnalysis": "Break down each component",
          "practicalApplications": "Provide real-world examples",
          "commonMisconceptions": "Address potential confusion points",
          "nextSteps": "Suggest areas for deeper learning"
        }`;

    case "socratic_dialogue":
      return `
        Guide the understanding of "${topic}" through questions in this JSON format:
        {
          "mainQuestion": "Pose the central question about ${topic}",
          "guidingQuestions": ["Array of follow-up questions"],
          "conceptChecks": ["Questions to verify understanding"],
          "challengeScenarios": ["Questions about edge cases"],
          "synthesisProblem": "Final question to tie everything together"
        }`;

    case "concise_practical":
      return `
        Explain "${topic}" directly and practically in this JSON format:
        {
          "summary": "Quick, clear explanation",
          "keyPoints": ["Most important points to remember"],
          "practicalTips": ["Actionable advice"],
          "warnings": ["Common pitfalls to avoid"],
          "quickGuide": "Easy reference summary"
        }`;

    default:
      throw new Error("Invalid response format type");
  }
}

// Export both functions for use in the main application
export { generateInitialPrompt, generateFollowUpPrompt };