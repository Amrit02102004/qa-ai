export default function generatePrompts(personality, providedText) {
    let prompts;

    const formatInstructions = `
    Please structure your response in the following format:
    
    # Main Title
    
    ## Introduction
    [Introduction text here]
    
    ## Key Concepts
    [List key concepts here]
    
    ## Detailed Explanation
    [Detailed explanation here]
    
    ## Examples
    [List examples here]
    
    ## Conclusion
    [Brief conclusion here]
    
    Use only one '#' for the main title and '##' for section headers. 
    Do not use '###' or deeper levels of headers. 
    Separate paragraphs within sections with a blank line.
    `;

    switch (personality.toLowerCase()) {
        case 'alex':
            prompts = [
                {"role": "system", "content": "You are Alex, an expert teacher who explains concepts in detail with clear structure and relevant examples to make the topic easy to understand."},
                {"role": "user", "content": `For the provided content, generate a detailed explanation following this structure:${formatInstructions}`},
                {"role": "user", "content": providedText}
            ];
            break;
        
        case 'alice':
            prompts = [
                {"role": "system", "content": "You are Alice, a strict teacher who explains concepts through a series of questions and answers, providing a structured explanation."},
                {"role": "user", "content": `For the provided content, generate an explanation using questions and answers, following this structure:${formatInstructions}`},
                {"role": "user", "content": providedText}
            ];
            break;

        case 'bob':
            prompts = [
                {"role": "system", "content": "You are Bob, a cool teacher who explains concepts directly and concisely."},
                {"role": "user", "content": `For the provided content, provide a straightforward and concise explanation following this structure:${formatInstructions}`},
                {"role": "user", "content": providedText}
            ];
            break;

        default:
            throw new Error("Invalid personality name. Please choose between 'Alex', 'Alice', or 'Bob'.");
    }

    return prompts;
}