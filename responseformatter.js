function formatResponse(apiResponse) {
  try {
    // Get the text content from the response
    let jsonString = apiResponse.parts[0].text;

    // Clean up the JSON string
    jsonString = cleanJsonString(jsonString);

    // Parse the JSON content
    let parsedResponse = parseJsonSafely(jsonString);
    
    // Transform the response into a flat structure
    return flattenResponse(parsedResponse);
  } catch (error) {
    console.warn('Warning in format response:', error);
    return createStructuredResponse(apiResponse.parts[0].text);
  }
}

function cleanJsonString(jsonString) {
  // Remove any markdown code block indicators
  jsonString = jsonString.replace(/^```json\s*|```\s*$/g, '').trim();
  
  // If the string starts with [ and contains JSON-like content, clean it up
  if (jsonString.startsWith('[') && jsonString.includes('{')) {
    // Remove array notation and join the strings
    jsonString = jsonString
      .replace(/^\[|\]$/g, '') // Remove outer array brackets
      .split('","')  // Split into array
      .join('')      // Join back together
      .replace(/\\"/g, '"')  // Fix escaped quotes
      .replace(/^"|"$/g, '') // Remove outer quotes
      .trim();
  }

  return jsonString;
}

function parseJsonSafely(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (firstError) {
    try {
      // Try to find and parse just the JSON object if full parse fails
      const match = jsonString.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (secondError) {
      console.warn('Failed to parse JSON:', secondError);
    }
    throw firstError;
  }
}

function convertToReadableString(item, indent = '') {
  if (item === null || item === undefined) {
    return 'N/A';
  }

  if (typeof item === 'string') {
    return item.trim();
  }

  if (typeof item === 'number' || typeof item === 'boolean') {
    return item.toString();
  }

  if (Array.isArray(item)) {
    if (item.length === 0) return '';
    
    return item.map(subItem => {
      const converted = convertToReadableString(subItem, indent + '  ');
      if (!converted) return '';
      const lines = converted.split('\n');
      return lines.map(line => `${indent}- ${line.trim()}`).join('\n');
    }).filter(Boolean).join('\n');
  }

  if (typeof item === 'object') {
    const entries = Object.entries(item);
    if (entries.length === 0) return '';

    return entries.map(([key, value]) => {
      if (!value) return '';
      const formattedKey = formatTitle(key);
      const converted = convertToReadableString(value, indent + '  ');
      
      if (!converted) return '';
      if (converted.includes('\n')) {
        return `${indent}${formattedKey}:\n${converted}`;
      }
      return `${indent}${formattedKey}: ${converted}`;
    }).filter(Boolean).join('\n');
  }

  return String(item);
}

function flattenResponse(parsed) {
  const sections = [];
  
  // Add title section if it exists
  if (parsed.title) {
    sections.push({
      title: "Overview",
      content: [parsed.title]
    });
  }

  // Process each top-level key
  for (const [key, value] of Object.entries(parsed)) {
    if (key === 'title') continue; // Skip title as it's already processed

    let content = [];
    
    if (typeof value === 'string') {
      // Handle string values
      content = value.split('\n')
        .map(line => line.trim())
        .filter(Boolean);
    } else if (Array.isArray(value)) {
      // Handle arrays
      const formattedContent = convertToReadableString(value)
        .split('\n')
        .filter(Boolean);
      content.push(...formattedContent);
    } else if (typeof value === 'object' && value !== null) {
      // Handle objects
      const formattedContent = convertToReadableString(value)
        .split('\n')
        .filter(Boolean);
      content.push(...formattedContent);
    } else if (value != null) {
      // Handle primitive values
      content = [value.toString()];
    }

    // Only add section if it has content
    if (content.length > 0) {
      sections.push({
        title: formatTitle(key),
        content: content
      });
    }
  }

  return {
    title: parsed.title || "Response",
    sections: sections.filter(section => 
      section.content && 
      section.content.length > 0 && 
      section.content.some(item => item.trim().length > 0)
    )
  };
}

function createStructuredResponse(text) {
  const paragraphs = text
    .split('\n')
    .map(p => p.trim())
    .filter(Boolean);

  return {
    title: "Response",
    sections: [{
      title: "Content",
      content: paragraphs
    }]
  };
}

function formatTitle(key) {
  return key
    .replace(/([A-Z])/g, ' $1') // Split camelCase
    .replace(/_/g, ' ') // Replace underscores with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

export default formatResponse;