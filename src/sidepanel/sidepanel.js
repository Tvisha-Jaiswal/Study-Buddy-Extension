document.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "setTheme") {
            if (message.theme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    });

    let prompt = document.querySelector("#prompt-input");

    function userMessage(message) {
        let html = `<div class="flex flex-col items-end max-w-[85%] self-end ml-auto">
                <div class="p-4 rounded-2xl rounded-tr-none bg-[#C5737C] dark:bg-gradient-to-r dark:from-[#C5737C] dark:to-[#A55D65] text-white shadow-md text-sm leading-relaxed">
                ${message}
                </div>
            </div>`;
        document.querySelector("#chat-container").insertAdjacentHTML("beforeend", html);
    }

    function aiMessage(message) {
        const formattedMessage = marked.parse(message);
        let html1 = `<div class="flex flex-col items-start max-w-[85%] mb-4">
                <div class="flex items-center gap-2 mb-1 px-1">
                    <span class="text-xs font-bold text-[#C5737C] dark:text-[#E66EAA]">Study Buddy</span>
                </div>
                <div class="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-[#2A1F22] border border-[#E0DAD8] dark:border-[#3A2E30] shadow-sm text-[#1E1B1B] dark:text-[#D1C5C8] text-sm leading-relaxed markdown-body">
                ${formattedMessage}
                </div>
            </div>`;

        document.querySelector("#chat-container").insertAdjacentHTML("beforeend", html1);
        const container = document.querySelector("#chat-container");
        container.scrollTop = container.scrollHeight;
    }

    let sndbtn = document.querySelector("#send-btn");

    sndbtn.addEventListener("click", async () => {
        const message = prompt.value.trim();
        if (!message) return;

        userMessage(message);
        prompt.value = "";

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab || !tab.url || tab.url.startsWith("chrome://")) {
                sendToBackground(message);
                return;
            }

            chrome.tabs.sendMessage(tab.id, { type: "getcontext" }, (context) => {
                if (chrome.runtime.lastError) {
                    console.warn("Context Scraper failed:", chrome.runtime.lastError.message);
                    sendToBackground(message);
                    return;
                }

                let finalMsg = message;
                if (context) {
                    finalMsg = `
                        CONTEXT FROM USER'S SCREEN:
                        URL: ${context.url}
                        Page Title: ${context.title}
                        Problem/Text: ${context.description}
                        User's Current Code: 
                        ---
                        ${context.code}
                        ---
                        USER QUESTION: ${message}
                    `;
                }
                sendToBackground(finalMsg);
            });
        } catch (err) {
            console.error(err);
            sendToBackground(message);
        }
    });

    function sendToBackground(fullPrompt) {
        chrome.runtime.sendMessage({ type: "userPrompt", prompt: fullPrompt }, (response) => {
            if (response && response.response) {
                aiMessage(response.response);
            } else {
                aiMessage("No response from background script.");
            }
        });
    }
});