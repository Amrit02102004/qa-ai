
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

  function generateFollowUpPrompt(personality, history, followUpQuestion) {
  const traits = personalityTraits[personality.toLowerCase()];

  if (!traits) {
      throw new Error("Invalid personality selected");
  }

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

  const userPrompt = {
      role: "user",
      content: followUpQuestion
  };
  return [
      systemPrompt,
      ...conversationContext,
      userPrompt
  ];
  }

  function generateFormatPrompt(traits, topic) {
    const basePrompt = `Explain "${topic}" in your teaching style. Your response MUST be a valid JSON object. Do not include any text outside the JSON structure. Format your entire response as a single JSON object like this example:
  
  {
      "title": "Topic Explanation",
      "sections": [
          {
              "heading": "Introduction",
              "content": ["Main introduction text here"]
          },
          {
              "heading": "Key Concepts",
              "content": ["Point 1", "Point 2", "Point 3"]
          }
      ]
  }`;
  
    switch (traits.responseFormat.type) {
      case "detailed_explanation":
        return basePrompt + `
            Structure your JSON response with these sections:
            {
                "title": "Understanding ${topic}",
                "sections": [
                    {
                        "heading": "Theoretical Foundation",
                        "content": ["Core theoretical concepts"]
                    },
                    {
                        "heading": "Detailed Analysis",
                        "content": ["Component breakdowns"]
                    },
                    {
                        "heading": "Practical Applications",
                        "content": ["Real-world examples"]
                    },
                    {
                        "heading": "Common Misconceptions",
                        "content": ["Potential confusion points"]
                    },
                    {
                        "heading": "Next Steps",
                        "content": ["Areas for deeper learning"]
                    }
                ]
            }`;
  
      case "socratic_dialogue":
        return basePrompt + `
            Structure your JSON response with these sections:
            {
                "title": "Understanding ${topic}",
                "sections": [
                    {
                        "heading": "Main Question",
                        "content": ["Central question about the topic"]
                    },
                    {
                        "heading": "Guiding Questions",
                        "content": ["Follow-up question 1", "Follow-up question 2"]
                    },
                    {
                        "heading": "Concept Checks",
                        "content": ["Verification question 1", "Verification question 2"]
                    },
                    {
                        "heading": "Challenge Scenarios",
                        "content": ["Edge case 1", "Edge case 2"]
                    },
                    {
                        "heading": "Synthesis",
                        "content": ["Final connecting question"]
                    }
                ]
            }`;
  
      case "concise_practical":
        return basePrompt + `
            Structure your JSON response with these sections:
            {
                "title": "Understanding ${topic}",
                "sections": [
                    {
                        "heading": "Quick Summary",
                        "content": ["Brief explanation"]
                    },
                    {
                        "heading": "Key Points",
                        "content": ["Point 1", "Point 2", "Point 3"]
                    },
                    {
                        "heading": "Practical Tips",
                        "content": ["Tip 1", "Tip 2", "Tip 3"]
                    },
                    {
                        "heading": "Common Pitfalls",
                        "content": ["Warning 1", "Warning 2"]
                    },
                    {
                        "heading": "Quick Reference",
                        "content": ["Easy reference summary"]
                    }
                ]
            }`;
  
      default:
        throw new Error("Invalid response format type");
    }
  }
  export { 
  generateInitialPrompt, 
  generateFollowUpPrompt,
  personalityTraits 
  };