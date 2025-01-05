function getWeather(){
    const weather = {};

    chrome.storage.local.get(["city", "unit", "format"], function(result) {
        if(!result.city || !result.unit || !result.format) {
            openSetup();
        }else{
            document.getElementById("loading-modal").style.display = "block";

            weather.unit = result.unit;
            weather.format = result.format;

            const key = "b91ec524df5747a3bed133352240605";
            const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${result.city}&aqi=no`;
            const urlForecast = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${result.city}&days=2&aqi=no&alerts=no`;

            fetch(url).then(function(response){
                if (!response.ok) {
                    document.getElementById("error-modal").style.display = "block";
                    document.getElementById("loading-modal").style.display = "none";
                    return;
                }
                return response.json();
            }).then(function(data){
                weather.city = data.location.name;
                weather.country = data.location.country;

                weather.tempC = Math.floor(data.current.temp_c);
                weather.tempF = Math.floor(data.current.temp_f);

                weather.windSpdMS = Math.floor(data.current.wind_kph / 3.6);
                weather.windSpdM = Math.floor(data.current.wind_mph);
                weather.windDir = data.current.wind_dir;

                weather.humidity = data.current.humidity;

                weather.pressurehPa = parseFloat(data.current.pressure_mb).toFixed(1).replace(/\.0$/, "");
                weather.pressureIn = parseFloat(data.current.pressure_in).toFixed(1).replace(/\.0$/, "");

                weather.rainFallMM = parseFloat(data.current.precip_mm).toFixed(1).replace(/\.0$/, "");
                weather.rainFallIn = parseFloat(data.current.precip_in).toFixed(1).replace(/\.0$/, "");

                weather.time = data.location.localtime;

                weather.feelsLikeC = Math.floor(data.current.feelslike_c);
                weather.feelsLikeF = Math.floor(data.current.feelslike_f);

                weather.condition = data.current.condition.text;

                fetch(urlForecast).then(function(response){
                    return response.json();


                }).then(function(data){
                    weather.minC = Math.floor(data.forecast.forecastday[0].day.mintemp_c);
                    weather.maxC = Math.floor(data.forecast.forecastday[0].day.maxtemp_c);
                    weather.minF = Math.floor(data.forecast.forecastday[0].day.mintemp_f);
                    weather.maxF = Math.floor(data.forecast.forecastday[0].day.maxtemp_f);

                    weather.sunrise = data.forecast.forecastday[0].astro.sunrise;
                    weather.sunset = data.forecast.forecastday[0].astro.sunset;
                    weather.moonrise = data.forecast.forecastday[0].astro.moonrise;
                    weather.moonset = data.forecast.forecastday[0].astro.moonset;
                    weather.phase = data.forecast.forecastday[0].astro.moon_phase;

                    document.getElementById("city").innerHTML = weather.city;
                    document.getElementById("country").innerHTML = weather.country;
                
                    if(weather.unit == "Metric"){
                        document.getElementById("temp").innerHTML = weather.tempC + "°C";
                        document.getElementById("feels-like").innerHTML = weather.feelsLikeC + "°";
                        document.getElementById("min").innerHTML = weather.minC + "°";
                        document.getElementById("max").innerHTML = weather.maxC + "°";
                        document.getElementById("speed").innerHTML = weather.windSpdMS + " m/s";
                        document.getElementById("pressure").innerHTML = weather.pressurehPa + " hPa";
                        document.getElementById("rainfall").innerHTML = weather.rainFallMM + " mm";
                    }else if(weather.unit == "Imperial"){
                        document.getElementById("temp").innerHTML = weather.tempF + "°F";
                        document.getElementById("feels-like").innerHTML = weather.feelsLikeF + "°";
                        document.getElementById("min").innerHTML = weather.minF + "°";
                        document.getElementById("max").innerHTML = weather.maxF + "°";
                        document.getElementById("speed").innerHTML = weather.windSpdM + " mph";
                        document.getElementById("pressure").innerHTML = weather.pressureIn + " inHg";
                        document.getElementById("rainfall").innerHTML = weather.rainFallIn + " in";
                    }
                
                    document.getElementById("dir").innerHTML = weather.windDir;
                    document.getElementById("humidity").innerHTML = weather.humidity + "%";
                
                    if(weather.format == "24-hour"){
                        const [date, time24] = weather.time.split(" ");
                        document.getElementById("time").innerHTML = time24;
                
                        document.getElementById("sunrise").innerHTML = convertTo24H(weather.sunrise);
                        document.getElementById("sunset").innerHTML = convertTo24H(weather.sunset);
                        document.getElementById("moonrise").innerHTML = weather.moonrise == "No moonrise" ? "----" : convertTo24H(weather.moonrise);
                        document.getElementById("moonset").innerHTML = weather.moonset == "No moonset" ? "----" : convertTo24H(weather.moonset);
                    }else if(weather.format == "12-hour"){
                        const [date, time24] = weather.time.split(" ");
                        document.getElementById("time").innerHTML = convertTo12H(time24);
                
                        document.getElementById("sunrise").innerHTML = weather.sunrise;
                        document.getElementById("sunset").innerHTML = weather.sunset;
                        document.getElementById("moonrise").innerHTML = weather.moonrise == "No moonrise" ? "----" : weather.moonrise;
                        document.getElementById("moonset").innerHTML = weather.moonset == "No moonset" ? "----" : weather.moonset;
                    }
                
                    document.getElementById("phase").innerHTML = weather.phase;
                    document.getElementById("condition").src = getConditionIcon(weather.condition);
                    document.getElementById("condition").title = weather.condition;


                    document.getElementById("forecastBlock").innerHTML = "";

                    const currentTime = new Date(weather.time);
                    const forecastDays = data.forecast.forecastday;
                
                    for (let i = 0; i < forecastDays.length; i++) {
                        const forecastHours = forecastDays[i].hour;
                      
                        for (let j = 0; j < forecastHours.length; j++) {
                          const forecastHour = forecastHours[j];
                          const forecastTimeStr = forecastHour.time;
                          const forecastTime = parseTime(forecastTimeStr);
                      
                          if (forecastTime > currentTime && forecastTime <= new Date(currentTime.getTime() + 24 * 60 * 60 * 1000)) {
                            
                            const element = document.createElement("div");
                            const timeSpan = document.createElement("span");
                
                            if (weather.format == "24-hour") {
                                const [date, time] = forecastTimeStr.split(" ");
                                const [hour, minute] = time.split(":");
                                
                                timeSpan.innerHTML = `${hour}:${minute}`;
                            } else if (weather.format == "12-hour") {
                                const [date, time] = forecastTimeStr.split(" ");
                                timeSpan.innerHTML = convertTo12H(time);
                            }
                
                            element.appendChild(timeSpan);
                
                            const icon = document.createElement("img");
                            icon.draggable = false;
                            icon.src = getConditionIcon(forecastHour.condition.text.trim());
                            icon.title = forecastHour.condition.text;
                            element.appendChild(icon);

                            const tempSpan = document.createElement("span");
                            const rainfall = document.createElement("span");
                
                            if(weather.unit == "Metric"){
                                tempSpan.innerHTML = `${Math.floor(forecastHour.temp_c)}°C`;
                                element.appendChild(tempSpan);
                                rainfall.innerHTML = `${parseFloat(forecastHour.precip_mm).toFixed(1).replace(/\.0$/, "")} mm`;
                                element.appendChild(rainfall);
                            }else if(weather.unit == "Imperial"){
                                tempSpan.innerHTML = `${Math.floor(forecastHour.temp_f)}°F`;
                                element.appendChild(tempSpan);
                                rainfall.innerHTML = `${parseFloat(forecastHour.precip_in).toFixed(1).replace(/\.0$/, "")} in`;
                                element.appendChild(rainfall);
                            }
                
                            forecastBlock.appendChild(element);
                
                          }
                        }
                      }
                    
                      document.getElementById("loading-modal").style.display = "none";

                }).catch(function(){
                    document.getElementById("error-modal").style.display = "block";
                    document.getElementById("loading-modal").style.display = "none";
                });
        
            }).catch(function(){
                document.getElementById("error-modal").style.display = "block";
                document.getElementById("loading-modal").style.display = "none";
            });

        }
    });
}

function parseTime(timeStr) {
    const [dateStr, time] = timeStr.split(" ");
    const [year, month, day] = dateStr.split("-");
    const [hours, minutes] = time.split(":");
    return new Date(year, month - 1, day, hours, minutes);
}

function convertTo24H(timeStr){
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":")

    hours = parseInt(hours);

    if(period == "PM" && hours != 12){
        hours += 12;
    }else if(period  == "AM" && hours == 12){
        hours = 12;
    }

    if(hours < 10){
        hours = "0" + hours;
    }

    return `${hours}:${minutes}`

}

function convertTo12H(timeStr) {
    const splitTime = timeStr.split(":");
    let hours = parseInt(splitTime[0], 10);
    let minutes = parseInt(splitTime[1], 10);
    let period;

    if (hours < 12) {
        period = "AM";
    } else {
        period = "PM";
    }

    if (hours === 0) {
        hours = 12;
    } else if (hours > 12) {
        hours = hours - 12;
    } 

    return minutes == "00" ? `${hours} ${period}` : `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function getConditionIcon(condition){

    const conditionIconMap = {
        "Sunny": "../img/weather/sun.png",
        "Clear": "../img/weather/moon.png",
        "Cloudy": "../img/weather/cloud.png",
        "Partly cloudy": "../img/weather/overcast.png",
        "Partly Cloudy": "../img/weather/overcast.png",
        "Overcast": "../img/weather/overcast.png",
        "Mist": "../img/weather/fog.png",
        "Patchy rain nearby": "../img/weather/rain.png",
        "Patchy rain possible": "../img/weather/rain.png",
        "Patchy snow possible": "../img/weather/snow.png",
        "Patchy snow nearby": "../img/weather/snow.png",
        "Patchy sleet possible": "../img/weather/sleet.png",
        "Patchy freezing drizzle possible": "../img/weather/rain.png",
        "Thundery outbreaks possible": "../img/weather/thunder.png",
        "Blowing snow": "../img/weather/wind.png",
        "Blizzard": "../img/weather/blizzard.png",
        "Fog": "../img/weather/fog.png",
        "Freezing fog": "../img/weather/fog_freeze.png",
        "Patchy light drizzle": "../img/weather/rain.png",
        "Light drizzle": "../img/weather/rain.png",
        "Freezing drizzle": "../img/weather/rain.png",
        "Heavy freezing drizzle": "../img/weather/rain.png",
        "Patchy light rain": "../img/weather/rain.png",
        "Light rain": "../img/weather/rain.png",
        "Moderate rain at times": "../img/weather/rain.png",
        "Moderate rain": "../img/weather/rain.png",
        "Heavy rain at times": "../img/weather/rain.png",
        "Heavy rain": "../img/weather/rain.png",
        "Light freezing rain": "../img/weather/rain.png",
        "Moderate or heavy freezing rain": "../img/weather/rain.png",
        "Light sleet": "../img/weather/sleet.png",
        "Moderate or heavy sleet": "../img/weather/sleet.png",
        "Patchy light snow": "../img/weather/snow.png",
        "Light snow": "../img/weather/snow.png",
        "Patchy moderate snow": "../img/weather/snow.png",
        "Moderate snow": "../img/weather/snow.png",
        "Patchy heavy snow": "../img/weather/snow.png",
        "Heavy snow": "../img/weather/snow.png",
        "Ice pellets": "../img/weather/pellets.png",
        "Light rain shower": "../img/weather/rain.png",
        "Moderate or heavy rain shower": "../img/weather/rain.png",
        "Torrential rain shower": "../img/weather/rain.png",
        "Light sleet showers": "../img/weather/sleet.png",
        "Moderate or heavy sleet showers": "../img/weather/sleet.png",
        "Light snow showers": "../img/weather/snow.png",
        "Moderate or heavy snow showers": "../img/weather/snow.png",
        "Light showers of ice pellets": "../img/weather/pellets.png",
        "Moderate or heavy showers of ice pellets": "../img/weather/sleet.png",
        "Patchy light rain with thunder": "../img/weather/storm.png",
        "Moderate or heavy rain with thunder": "../img/weather/storm.png",
        "Patchy light snow with thunder": "../img/weather/storm.png",
        "Moderate or heavy snow with thunder": "../img/weather/storm.png",
        "Thundery outbreaks in nearby": "../img/weather/thunder.png"
    };

    return conditionIconMap[condition];
}

window.onload = function() {
    getWeather();
};

