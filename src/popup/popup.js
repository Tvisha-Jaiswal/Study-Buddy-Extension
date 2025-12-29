const isDark = document.getElementById("isDark");
isDark.addEventListener("change", () => {
    if (isDark.checked) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        chrome.runtime.sendMessage({ type: "setTheme", theme: "dark" });
    } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        chrome.runtime.sendMessage({ type: "setTheme", theme: "light" });
    }
});

if (localStorage.getItem("theme") === "dark") {
    isDark.checked = true;
    document.documentElement.classList.add("dark");
}

const sidepanelBtn = document.getElementById("sidepanel_btn");
sidepanelBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        chrome.sidePanel.setOptions({
            tabId: tab.id,
            path: "sidepanel/sidepanel.html",
            enabled: true,
        });

        chrome.sidePanel.open({ tabId: tab.id });
    });
});