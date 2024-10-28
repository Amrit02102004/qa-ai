// prompts.js - Updated prompt generation

  
  // responseformatter.js - Updated response formatter
  
  

  function createStructuredResponse(text) {
    const paragraphs = text
      .split('\n')
      .map(p => p.trim())
      .filter(p => p && !p.startsWith('```'));
  
    return {
      title: "Response",
      sections: [{
        heading: "Content",
        content: paragraphs
      }]
    };
  }
  
  // The rest of the responseformatter.js functions remain the same