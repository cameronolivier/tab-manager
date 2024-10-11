chrome.storage.local.get({ savedTabs: [] }, (result) => {
    const container = document.getElementById("savedTabs");

    if (!result.savedTabs || result.savedTabs.length === 0) {
        container.innerHTML = '<p>No tabs saved yet.</p>';
        return;
    }

    result.savedTabs.forEach((session, sessionIndex) => {
        const sessionDiv = document.createElement("div");

        // Session header with rename input and buttons
        const sessionHeader = document.createElement("div");

        const sessionHeading = document.createElement("h2");
        sessionHeading.textContent = session.name || session.date;

        const renameInput = document.createElement("input");
        renameInput.type = "text";
        renameInput.value = session.name || session.date;
        renameInput.style.display = "none";

        // Rename button
        const renameButton = document.createElement("button");
        renameButton.textContent = "Rename";
        renameButton.addEventListener("click", () => {
            if (renameInput.style.display === "none") {
                renameInput.style.display = "inline";
                sessionHeading.style.display = "none";
                renameButton.textContent = "Save";
            } else {
                const newName = renameInput.value.trim();
                if (newName) {
                    renameSession(sessionIndex, newName);
                    sessionHeading.textContent = newName;
                }
                renameInput.style.display = "none";
                sessionHeading.style.display = "inline";
                renameButton.textContent = "Rename";
            }
        });

        // Delete session button
        const deleteSessionButton = document.createElement("button");
        deleteSessionButton.textContent = "Delete Session";
        deleteSessionButton.addEventListener("click", () => {
            deleteSession(sessionIndex);
        });

        // Relaunch session button
        const relaunchButton = document.createElement("button");
        relaunchButton.textContent = "Relaunch Session";
        relaunchButton.addEventListener("click", () => {
            relaunchSession(session.tabs);
        });

        sessionHeader.appendChild(sessionHeading);
        sessionHeader.appendChild(renameInput);
        sessionHeader.appendChild(renameButton);
        sessionHeader.appendChild(relaunchButton);
        sessionHeader.appendChild(deleteSessionButton);

        sessionDiv.appendChild(sessionHeader);

        // List the individual tabs with delete buttons
        const ul = document.createElement("ul");
        session.tabs.forEach((tab, tabIndex) => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${tab.url}" target="_blank">${tab.title}</a>`;

            // Delete individual tab button
            const deleteTabButton = document.createElement("button");
            deleteTabButton.textContent = "Delete Tab";
            deleteTabButton.style.marginLeft = "10px";
            deleteTabButton.addEventListener("click", () => {
                deleteTab(sessionIndex, tabIndex);
            });

            li.appendChild(deleteTabButton);
            ul.appendChild(li);
        });

        sessionDiv.appendChild(ul);
        container.appendChild(sessionDiv);
    });
});

// Function to rename a session
function renameSession(sessionIndex, newName) {
    chrome.storage.local.get({ savedTabs: [] }, (result) => {
        const savedTabs = result.savedTabs;
        savedTabs[sessionIndex].name = newName;
        chrome.storage.local.set({ savedTabs });
    });
}

// Function to delete a session
function deleteSession(sessionIndex) {
    chrome.storage.local.get({ savedTabs: [] }, (result) => {
        const savedTabs = result.savedTabs;
        savedTabs.splice(sessionIndex, 1); // Remove the session at the given index
        chrome.storage.local.set({ savedTabs }, () => {
            window.location.reload();
        });
    });
}

// Function to delete an individual tab
function deleteTab(sessionIndex, tabIndex) {
    chrome.storage.local.get({ savedTabs: [] }, (result) => {
        const savedTabs = result.savedTabs;
        savedTabs[sessionIndex].tabs.splice(tabIndex, 1); // Remove the tab at the given index

        if (savedTabs[sessionIndex].tabs.length === 0) {
            savedTabs.splice(sessionIndex, 1); // If no tabs remain, remove the session
        }

        chrome.storage.local.set({ savedTabs }, () => {
            window.location.reload();
        });
    });
}

// Function to relaunch all tabs in a session
function relaunchSession(tabs) {
    tabs.forEach((tab) => {
        chrome.tabs.create({ url: tab.url });
    });
}
