importScripts('config.js');
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "userPrompt") {
        const apikey = (typeof CONFIG !== 'undefined') ? CONFIG.API_KEY : "";

        if (!apikey) {
            sendResponse({ response: "Error: API Key missing in config.js" });
            return;
        }

        async function fetchAIResponse(prompt) {
            try {
                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apikey}`
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            {
                                role: "system",
                                content: `You are a smart assistant. Your behavior depends ENTIRELY on the user's input.

        ----- PROTOCOL START -----
        
        PHASE 1: CLASSIFICATION
        Is the user asking for code, debugging, or help with a programming problem?
        
        >>> PATH A: NO (General Questions)
        - Examples: "Tell me about IIT Mandi", "Hi", "What is the weather?"
        - ACTION: Answer conversationally.
        - RESTRICTION: DO NOT generate code blocks. DO NOT write "Time Complexity". DO NOT follow the coding template.
        
        >>> PATH B: YES (Coding Questions)
        - Examples: "Solve this", "Fix my code", "Explain this algorithm"
        - ACTION: Follow the "Coding Template" below.
        
        ----- CODING TEMPLATE (Only for Path B) -----
        1. **Problem Analysis**: Brief summary.
        2. **Approach**: Explain the logic.
        3. **Implementation**(Must be in C++ by default):
           \`\`\`cpp
           // Clean C++ code here
           \`\`\`
        4. **Complexity**: Time & Space analysis.
        
        ----- OVERRIDE RULE -----
        If the user says "Just the code", IGNORE all templates and output ONLY the code block.

        ----- PROTOCOL END -----`
                            },
                            {
                                role: "user",
                                content: prompt
                            }
                        ]
                    })
                });

                const data = await response.json();

                if (data.error) {
                    return "API Error: " + data.error.message;
                }
                return data.choices[0].message.content;
            } catch (err) {
                console.error("Network/Runtime ERROR:", err);
                return "Error talking to AI.";
            }
        }

        fetchAIResponse(message.prompt).then(aitext => {
            sendResponse({ response: aitext });
        });
        return true;
    }
});
