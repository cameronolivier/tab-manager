import { useEffect, useState } from 'react';

import chrome from 'webextension-polyfill';


interface TabSession {
    date: string;
    name?: string;
    tabs: { title: string; url: string }[];
}

const TabManager = () => {
    const [sessions, setSessions] = useState<TabSession[]>([]);

    useEffect(() => {
        chrome.storage.local.get({ savedTabs: [] }, (result) => {
            setSessions(result.savedTabs);
        });
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Saved Tabs</h1>
            {sessions.length === 0 ? (
                <p>No tabs saved yet.</p>
            ) : (
                sessions.map((session, index) => (
                    <div key={index} className="mb-4">
                        <h2 className="text-xl">{session.name || session.date}</h2>
                        <ul>
                            {session.tabs.map((tab, tabIndex) => (
                                <li key={tabIndex}>
                                    <a href={tab.url} target="_blank" rel="noopener noreferrer">
                                        {tab.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default TabManager;
