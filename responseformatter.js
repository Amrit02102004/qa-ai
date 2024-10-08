function formatResponse(apiResponse) {
  try {
    // Extract the JSON string from the API response
    const jsonString = apiResponse.parts[0].text;
    
    // Parse the JSON string
    const parsedResponse = JSON.parse(jsonString);

    // Validate the structure
    if (!parsedResponse.title || !Array.isArray(parsedResponse.sections)) {
      throw new Error('Invalid response structure');
    }

    // Format the response
    const formattedResponse = {
      title: parsedResponse.title,
      sections: parsedResponse.sections.map(section => ({
        title: section.title,
        content: Array.isArray(section.content) 
          ? section.content.map(item => item.trim())
          : section.content.trim().split('\n\n').map(paragraph => paragraph.trim())
      }))
    };

    return formattedResponse;
  } catch (error) {
    console.error('Error formatting response:', error);
    return { 
      error: 'Failed to format response', 
      message: error.message,
      originalContent: apiResponse
    };
  }
}

export default formatResponse;