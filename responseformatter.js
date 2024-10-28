function formatResponse(apiResponse) {
  try {
    let responseText = apiResponse.parts[0].text;
    
    try {
      const cleanedJson = cleanJsonString(responseText);
      const parsedJson = JSON.parse(cleanedJson);
      return transformToStandardFormat(parsedJson);
    } catch (jsonError) {
      
      return convertMarkdownToStructured(responseText);
    }
  } catch (error) {
    console.warn('Warning in format response:', error);
    return {
      title: "Error Processing Response",
      sections: [{
        heading: "Content",
        content: ["An error occurred while processing the response."]
      }]
    };
  }
}

function convertMarkdownToStructured(text) {
  text = text.replace(/```[a-z]*\n/g, '').replace(/```/g, '');
  
  const sections = [];
  let currentSection = {
    heading: "Overview",
    content: []
  };
  
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  for (const line of lines) {
    if (line.startsWith('#') || (line.startsWith('**') && line.endsWith('**'))) {
      if (currentSection.content.length > 0) {
        sections.push({ ...currentSection });
      }
      
      const heading = line.replace(/^#+\s*|^\*\*|\*\*$/g, '').trim();
      currentSection = {
        heading: heading,
        content: []
      };
    } else {
      let content = line;
      if (line.startsWith('* ') || /^\d+\.\s/.test(line)) {
        content = line.replace(/^\*\s*|^\d+\.\s*/, '').trim();
      }
      
      if (content) {
        currentSection.content.push(content);
      }
    }
  }
  
  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }
  
  if (sections.length === 0 && text.trim()) {
    sections.push({
      heading: "Content",
      content: [text.trim()]
    });
  }
  
  return {
    title: sections[0]?.heading || "Response",
    sections: sections
  };
}

function transformToStandardFormat(parsed) {
  if (parsed.title && Array.isArray(parsed.sections)) {
    return parsed;
  }
  
  const sections = [];
  
  for (const [key, value] of Object.entries(parsed)) {
    if (key === 'title') continue;
    
    let content = [];
    
    if (Array.isArray(value)) {
      content = value.map(item => 
        typeof item === 'string' ? item : JSON.stringify(item)
      );
    } else if (typeof value === 'object' && value !== null) {
      content = [JSON.stringify(value, null, 2)];
    } else if (value != null) {
      content = [value.toString()];
    }
    
    if (content.length > 0) {
      sections.push({
        heading: formatTitle(key),
        content: content.filter(item => item && item.trim().length > 0)
      });
    }
  }
  
  return {
    title: parsed.title || "Response",
    sections: sections.filter(section => 
      section.content && 
      section.content.length > 0
    )
  };
}

function formatTitle(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

function cleanJsonString(jsonString) {
  return jsonString
    .replace(/^```json\s*|```\s*$/g, '')
    .replace(/^\[|\]$/g, '')
    .replace(/\\"/g, '"')
    .replace(/^"|"$/g, '')
    .trim();
}

export default formatResponse;