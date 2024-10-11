chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveAndCloseTabs") {
        chrome.tabs.query({ currentWindow: true, pinned: false }, (tabs) => {
            const tabData = tabs.map(tab => ({ title: tab.title, url: tab.url }));
            const timestamp = new Date().toLocaleString();

            // Save tabs to local storage
            chrome.storage.local.get({ savedTabs: [] }, (result) => {
                const savedTabs = result.savedTabs;
                savedTabs.push({ date: timestamp, tabs: tabData });
                chrome.storage.local.set({ savedTabs });
            });

            // Close the tabs
            const tabIds = tabs.map(tab => tab.id);
            chrome.tabs.remove(tabIds);
        });
    }
});
