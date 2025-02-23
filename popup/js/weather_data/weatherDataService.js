import SettingsService from "../settings/SettingsService.js";
import WeatherApiService from "./WeatherApiService.js";

const settigsService = new SettingsService();
const apiService = new WeatherApiService();

export default class WeatherData {
    getWeatherData() {
        return new Promise((resolve, reject) => {
            const weather = {};

            settigsService.getSettings().then(result => {
                const key = 'b91ec524df5747a3bed133352240605';
                const url = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${result.city}&days=2&aqi=no&alerts=no`;

                apiService.getWeather(url).then(data => {
                    weather.unit = result.unit;
                    weather.format = result.format;

                    weather.city = data.location.name;
                    weather.country = data.location.country;

                    weather.tempC = Math.floor(data.current.temp_c);
                    weather.tempF = Math.floor(data.current.temp_f);

                    weather.windSpdMS = Math.floor(data.current.wind_kph / 3.6);
                    weather.windSpdM = Math.floor(data.current.wind_mph);
                    weather.windDir = data.current.wind_dir;

                    weather.humidity = data.current.humidity;

                    weather.pressurehPa = parseFloat(data.current.pressure_mb).toFixed(1).replace(/\.0$/, '');
                    weather.pressureIn = parseFloat(data.current.pressure_in).toFixed(1).replace(/\.0$/, '');

                    weather.rainFallMM = parseFloat(data.current.precip_mm).toFixed(1).replace(/\.0$/, '');
                    weather.rainFallIn = parseFloat(data.current.precip_in).toFixed(1).replace(/\.0$/, '');

                    weather.time = data.location.localtime;

                    weather.feelsLikeC = Math.floor(data.current.feelslike_c);
                    weather.feelsLikeF = Math.floor(data.current.feelslike_f);

                    weather.condition = data.current.condition.text;

                    weather.minC = Math.floor(data.forecast.forecastday[0].day.mintemp_c);
                    weather.maxC = Math.floor(data.forecast.forecastday[0].day.maxtemp_c);
                    weather.minF = Math.floor(data.forecast.forecastday[0].day.mintemp_f);
                    weather.maxF = Math.floor(data.forecast.forecastday[0].day.maxtemp_f);

                    weather.sunrise = data.forecast.forecastday[0].astro.sunrise;
                    weather.sunset = data.forecast.forecastday[0].astro.sunset;
                    weather.moonrise = data.forecast.forecastday[0].astro.moonrise;
                    weather.moonset = data.forecast.forecastday[0].astro.moonset;
                    weather.phase = data.forecast.forecastday[0].astro.moon_phase;

                    weather.forecastData = data.forecast;

                    resolve(weather);
                }).catch(function(){
                    reject();
                })
            })
        });
    }
}
