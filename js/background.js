chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({ url: "../tabs/install.html" });
});