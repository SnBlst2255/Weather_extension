import IconList from "./iconList.js";
import TimeService from "../time/timeService.js";

const icons = new IconList();
const timeService = new TimeService();

export default class Display {
    displayWeather(weather) {
        return new Promise((resolve) => {
            document.getElementById("loading-modal").style.display = "block";

        document.getElementById("city").textContent = weather.city;
        document.getElementById("country").textContent = weather.country;

        if (weather.unit == "Metric") {
            document.getElementById("temp").textContent = weather.tempC + "°C";
            document.getElementById("feels-like").textContent = weather.feelsLikeC + "°";
            document.getElementById("min").textContent = weather.minC + "°";
            document.getElementById("max").textContent = weather.maxC + "°";
            document.getElementById("speed").textContent = weather.windSpdMS + " m/s";
            document.getElementById("pressure").textContent = weather.pressurehPa + " hPa";
            document.getElementById("rainfall").textContent = weather.rainFallMM + " mm";
        } else if (weather.unit == "Imperial") {
            document.getElementById("temp").textContent = weather.tempF + "°F";
            document.getElementById("feels-like").textContent = weather.feelsLikeF + "°";
            document.getElementById("min").textContent = weather.minF + "°";
            document.getElementById("max").textContent = weather.maxF + "°";
            document.getElementById("speed").textContent = weather.windSpdM + " mph";
            document.getElementById("pressure").textContent = weather.pressureIn + " inHg";
            document.getElementById("rainfall").textContent = weather.rainFallIn + " in";
        }

        document.getElementById("dir").textContent = weather.windDir;
        document.getElementById("humidity").textContent = weather.humidity + "%";

        if (weather.format == "24-hour") {
            const [date, time24] = weather.time.split(" ");
            document.getElementById("time").textContent = time24;

            document.getElementById("sunrise").textContent = timeService.convertTo24H(weather.sunrise);
            document.getElementById("sunset").textContent = timeService.convertTo24H(weather.sunset);
            document.getElementById("moonrise").textContent = weather.moonrise == "No moonrise" ? "----" : timeService.convertTo24H(weather.moonrise);
            document.getElementById("moonset").textContent = weather.moonset == "No moonset" ? "----" : timeService.convertTo24H(weather.moonset);
        } else if (weather.format == "12-hour") {
            const [date, time24] = weather.time.split(" ");
            document.getElementById("time").textContent = timeService.convertTo12H(time24);

            document.getElementById("sunrise").textContent = weather.sunrise;
            document.getElementById("sunset").textContent = weather.sunset;
            document.getElementById("moonrise").textContent = weather.moonrise == "No moonrise" ? "----" : weather.moonrise;
            document.getElementById("moonset").textContent = weather.moonset == "No moonset" ? "----" : weather.moonset;
        }

        document.getElementById("phase").textContent = weather.phase;
        document.getElementById("condition").src = icons.getIconByName(weather.condition);
        document.getElementById("condition").title = weather.condition;

        this.displayForecast(weather);

        resolve();
        });
    }

    displayForecast(weather) {
        document.getElementById("forecastBlock").textContent = "";

        const currentTime = new Date(weather.time);
        const forecastDays = weather.forecastData.forecastday;

        for (let i = 0; i < forecastDays.length; i++) {
            const forecastHours = forecastDays[i].hour;

            for (let j = 0; j < forecastHours.length; j++) {
                const forecastHour = forecastHours[j];
                const forecastTimeStr = forecastHour.time;
                const forecastTime = timeService.parseTime(forecastTimeStr);

                if (forecastTime > currentTime && forecastTime <= new Date(currentTime.getTime() + 24 * 60 * 60 * 1000)) {

                    const element = document.createElement("div");
                    const timeSpan = document.createElement("span");

                    if (weather.format == "24-hour") {
                        const [date, time] = forecastTimeStr.split(" ");
                        const [hour, minute] = time.split(":");

                        timeSpan.textContent = `${hour}:${minute}`;
                    } else if (weather.format == "12-hour") {
                        const [date, time] = forecastTimeStr.split(" ");
                        timeSpan.textContent = timeService.convertTo12H(time);
                    }

                    element.appendChild(timeSpan);

                    const icon = document.createElement("img");
                    icon.draggable = false;
                    icon.src = icons.getIconByName(forecastHour.condition.text.trim());
                    icon.title = forecastHour.condition.text;
                    element.appendChild(icon);

                    const tempSpan = document.createElement("span");
                    const rainfall = document.createElement("span");

                    if (weather.unit == "Metric") {
                        tempSpan.textContent = `${Math.floor(forecastHour.temp_c)}°C`;
                        element.appendChild(tempSpan);
                        rainfall.textContent = `${parseFloat(forecastHour.precip_mm).toFixed(1).replace(/\.0$/, "")} mm`;
                        element.appendChild(rainfall);
                    } else if (weather.unit == "Imperial") {
                        tempSpan.textContent = `${Math.floor(forecastHour.temp_f)}°F`;
                        element.appendChild(tempSpan);
                        rainfall.textContent = `${parseFloat(forecastHour.precip_in).toFixed(1).replace(/\.0$/, "")} in`;
                        element.appendChild(rainfall);
                    }

                    forecastBlock.appendChild(element);
                }
            }
        }
    }
}