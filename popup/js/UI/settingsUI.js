import SettingsService from "../settings/SettingsService.js";
import WeatherData from "../weather_data/weatherDataService.js";
import Display from "./WeatherDisplayService.js";

const weatherData = new WeatherData();
const display = new Display();
const settingsService = new SettingsService();

function openSettings() {
    settingsService.getSettings().then(result => {
        document.getElementById("settings-modal").style.display = "block";
        document.getElementById("cityInput").value = result.city;
        document.getElementById("unit").value = result.unit;
        document.getElementById("time-format").value = result.format;
    });
}

function applySettings(city, unit, format) {
    settingsService.setSettings(city, unit, format).then(() => {
        document.getElementById("setup-modal").style.display = "none";
        document.getElementById("settings-modal").style.display = "none";
        document.getElementById("loading-modal").style.display = "block";
        weatherData.getWeatherData().then(result => {
            display.displayWeather(result).then(function(){
                document.getElementById("loading-modal").style.display = "none";
            });
        }).catch(function(){
            document.getElementById("loading-modal").style.display = "none";
            document.getElementById('error-modal').style.display = "block";
        });
    });
}

document.getElementById("settings").addEventListener("click", function () {
    openSettings();
});

document.getElementById("settings-error").addEventListener("click", function () {
    openSettings();
    document.getElementById("error-modal").style.display = "none";
});

document.getElementById("apply-setup").addEventListener("click", function () {
    const city = document.getElementById("city-setup").value;
    const unit = document.getElementById("unit-setup").value;
    const format = document.getElementById("time-format-setup").value;

    const regex = /^([A-Za-zÀ-ÿ'’\-\s]+,\s[A-Za-zÀ-ÿ'’\-\s]+;?\s?)+$/
    if (regex.test(city) && unit && format) {
        applySettings(city, unit, format);
    }
});

document.getElementById("apply").addEventListener("click", function () {
    const city = document.getElementById("cityInput").value;
    const unit = document.getElementById("unit").value;
    const format = document.getElementById("time-format").value;

    const regex = /^([A-Za-zÀ-ÿ'’\-\s]+,\s[A-Za-zÀ-ÿ'’\-\s]+;?\s?)+$/
    if (regex.test(city) && unit && format) {
        applySettings(city, unit, format);
    }
});

document.getElementById("weatherapi-link").addEventListener("click", function () {
    chrome.tabs.create({ url: "https://www.weatherapi.com/" });
});
