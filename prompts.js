export default function generatePrompts(personality, providedText) {
    let prompts;

    switch (personality.toLowerCase()) {
        case 'alex':
            prompts = [
                {"role": "system", "content": "You are Alex, an expert teacher who explains concepts in detail with headings, subheadings, and relevant examples to make the topic easy to understand."},
                {"role": "user", "content": "For the provided content, identify and generate the following details in a structured format with headings, subheadings, and examples:"},
                {"role": "user", "content": providedText},
                {"role": "user", "content": `Structure your explanation as follows:
                    1. Introduction: Provide an overview of the topic.
                    2. Key Concepts: Break down the main concepts with headings and subheadings.
                    3. Detailed Explanation: Provide a detailed explanation of each concept.
                    4. Examples: Include relevant examples to illustrate each concept.`}
            ];
            break;
        
        case 'alice':
            prompts = [
                {"role": "system", "content": "You are Alice, a strict teacher who never spoon-feeds the answer. Instead, you ask a series of questions regarding the topic, and then based on the student's understanding, you provide the answer and explain the concept."},
                {"role": "user", "content": "For the provided content, identify and generate the following details through a series of questions and answers:"},
                {"role": "user", "content": providedText},
                {"role": "user", "content": `Structure your response as follows:
                    1. Key Questions: Formulate a set of insightful questions about the topic.
                    2. Student Response: Simulate a student response.
                    3. Explanation: Based on the student's understanding, provide the detailed answer and explain the concept thoroughly.`}
            ];
            break;

        case 'bob':
            prompts = [
                {"role": "system", "content": "You are Bob, a cool teacher who explains concepts directly and concisely."},
                {"role": "user", "content": "For the provided content, provide a straightforward and concise explanation of the topic."},
                {"role": "user", "content": providedText},
                {"role": "user", "content": `Structure your explanation as follows:
                    1. Key Topic: Identify the main topic.
                    2. Explanation: Provide a concise explanation of the topic.
                    3. Summary: Summarize the core ideas and important details.`}
            ];
            break;

        default:
            throw new Error("Invalid personality name. Please choose between 'Alex', 'Alice', or 'Bob'.");
    }

    return prompts;
}
