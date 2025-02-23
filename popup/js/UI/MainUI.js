import WeatherData from "../weather_data/weatherDataService.js";
import Display from "./WeatherDisplayService.js";
import SettingsService from "../settings/SettingsService.js";

const weatherData = new WeatherData();
const display = new Display();
const settings = new SettingsService();

window.onload = () => {
    settings.check().then(() => {
        document.getElementById("loading-modal").style.display = "block";
        weatherData.getWeatherData().then(result => {
            display.displayWeather(result).then(() => {
                document.getElementById("loading-modal").style.display = "none";
            });
        }).catch(() => {
            document.getElementById("loading-modal").style.display = "none";
            document.getElementById('error-modal').style.display = "block";
        });
    }).catch(() => {
        document.getElementById("loading-modal").style.display = "none";
        document.getElementById("setup-modal").style.display = "block";
    })
}