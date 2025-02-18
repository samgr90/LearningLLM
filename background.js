chrome.runtime.onInstalled.addListener(() => {
    console.log("WCF Client Extension Installed.");
});

chrome.action.onClicked.addListener(() => {
    // Use chrome.system.display to get screen dimensions
    chrome.system.display.getInfo((displays) => {
        if (displays && displays.length > 0) {
            // Use the primary display (first in the list)
            const primaryDisplay = displays[0];
            const workArea = primaryDisplay.workArea; // available width and height

            const width = Math.floor(workArea.width * 0.5);  // 50% of available width
            const height = Math.floor(workArea.height * 0.5); // 50% of available height

            chrome.windows.create({
                url: chrome.runtime.getURL("popup.html"),
                type: "popup",
                width: width,
                height: height,
                left: Math.floor((workArea.width - width) / 2),
                top: Math.floor((workArea.height - height) / 2)
            }, (window) => {
                if (chrome.runtime.lastError) {
                    console.error("Error opening window:", chrome.runtime.lastError);
                } else {
                    console.log("Window opened successfully:", window);
                }
            });
        } else {
            console.error("No displays found!");
        }
    });
});
