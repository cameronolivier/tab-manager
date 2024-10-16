chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveAndCloseTabs") {
        chrome.tabs.query({ currentWindow: true, pinned: false }, (tabs) => {
            // Filter out the "Saved Tabs" view page
            const filteredTabs = tabs.filter(tab => !tab.url.includes("boo-tabs.html"));

            // Prepare data to save
            const tabData = filteredTabs.map(tab => ({ title: tab.title, url: tab.url }));
            const timestamp = new Date().toLocaleString();

            // Save the remaining tabs (without "Saved Tabs" page) to local storage
            chrome.storage.local.get({ savedTabs: [] }, (result) => {
                const savedTabs = result.savedTabs;
                savedTabs.push({ date: timestamp, tabs: tabData });
                chrome.storage.local.set({ savedTabs });
            });

            // Close the filtered tabs
            const tabIds = filteredTabs.map(tab => tab.id);
            chrome.tabs.remove(tabIds);

            // Send a message to the "cams-tab-manager.html" page to refresh itself
            chrome.tabs.query({ url: "*://*/*boo-tabs.html" }, (tabManagerTabs) => {
                tabManagerTabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, { action: "refreshPage" });
                });
            });
        });
    }
});
