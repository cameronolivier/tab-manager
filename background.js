chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveAndCloseTabs") {
        chrome.tabs.query({ currentWindow: true, pinned: false }, (tabs) => {
            // Filter out the "Saved Tabs" view page
            const filteredTabs = tabs.filter(tab => !tab.url.includes("cams-tab-manager.html"));

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
        });
    }
});
