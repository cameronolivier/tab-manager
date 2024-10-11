document.getElementById("saveAndClose").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "saveAndCloseTabs" });
});
