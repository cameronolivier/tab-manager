import chrome from "webextension-polyfill";

const Popup = () => {
    const saveAndCloseTabs = () => {
        chrome.runtime.sendMessage({ action: "saveAndCloseTabs" });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Tab Manager</h1>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={saveAndCloseTabs}
            >
                Save & Close Tabs
            </button>
        </div>
    );
};

export default Popup;
