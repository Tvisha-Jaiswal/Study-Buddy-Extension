chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "getcontext") {
        const descriptionSelectors = [
            '.problem-statement',
            '[data-track-load="description_content"]',
            '.problem-description-content',
            '.problems_problem_content__D_m97',
            'main', 'article', '.markdown-body'
        ];

        let pageText = "";
        for (const selector of descriptionSelectors) {
            const el = document.querySelector(selector);
            if (el && el.innerText.trim().length > 100) {
                pageText = el.innerText;
                break;
            }
        }
        let userCode = "";
        const monacoLines = document.querySelectorAll('.view-line');

        const aceLines = document.querySelectorAll('.ace_line');

        if (monacoLines.length > 0) {
            userCode = Array.from(monacoLines).map(l => l.innerText).join('\n');
        } else if (aceLines.length > 0) {
            userCode = Array.from(aceLines).map(l => l.innerText).join('\n');
        } else {
            const genericCode = document.querySelector('textarea, code, pre');
            userCode = genericCode ? (genericCode.value || genericCode.innerText) : "";
        }
        sendResponse({
            url: window.location.href,
            title: document.title,
            description: pageText.substring(0, 4000),
            code: userCode || "No code detected."
        });
    }
    return true;
});