function formatResponse(apiResponse) {
  try {
    // The apiResponse is now directly the text content
    const generatedContent = apiResponse;

    if (!generatedContent) {
      throw new Error('Unable to extract generated content from API response');
    }

    // Split the content into sections
    const sections = generatedContent.split(/(?=##?\s)/);

    // Extract the main title
    const mainTitle = sections.shift().replace(/^#\s*/, '').trim();

    // Format each section
    const formattedSections = sections.map(section => {
      const [title, ...contentParts] = section.split('\n');
      return {
        title: title.replace(/^##\s*/, '').trim(),
        content: contentParts.join('\n').trim().split('\n\n').map(paragraph => paragraph.trim())
      };
    });

    // Construct the final formatted response
    const formattedResponse = {
      title: mainTitle,
      sections: formattedSections
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