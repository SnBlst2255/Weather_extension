export default class WeatherApiService {
    getWeather(url) {
        return new Promise((resolve, reject) => {
            fetch(url).then(function (response) {
                if (!response.ok) {
                    reject();
                }
                return response.json();
            }).then(function (data) {
                resolve(data);
            }).catch(function () {
                reject();
            });
        });
    }
}