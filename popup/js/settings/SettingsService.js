export default class SettingsService {
    getSettings() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['city', 'unit', 'format'], (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error('Error setting settings: ' + chrome.runtime.lastError));
                } else {
                    resolve(result);
                }
            });
        });
    }

    setSettings(city, unit, format) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ city, unit, format }, function () {
                if (chrome.runtime.lastError) {
                    reject(new Error('Error setting settings: ' + chrome.runtime.lastError));
                } else {
                    resolve();
                }
            });
        });
    }

    check(){
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['city', 'unit', 'format'], (result) => {
                if (result.hasOwnProperty('city') && result.hasOwnProperty('unit') && result.hasOwnProperty('format')) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }
}