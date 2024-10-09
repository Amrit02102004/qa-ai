function formatResponse(apiResponse) {
  try {
    let jsonString = apiResponse.parts[0].text;

    jsonString = jsonString.replace(/^```json\n|\n```$/g, '');

    const parsedResponse = JSON.parse(jsonString);

    if (!parsedResponse.title || !Array.isArray(parsedResponse.sections)) {
      throw new Error('Invalid response structure');
    }
    const formattedResponse = {
      title: parsedResponse.title,
      sections: parsedResponse.sections.map(section => ({
        title: section.title,
        content: Array.isArray(section.content) 
          ? section.content.map(item => item.trim())
          : section.content.trim().split('\n').map(paragraph => paragraph.trim()).filter(Boolean)
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