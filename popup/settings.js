function openSettings(){
    document.getElementById("settings-modal").style.display = "block";

    chrome.storage.local.get(["unit", "format", "city", "country"], function(result){
        document.getElementById("cityInput").value = result.city;
        document.getElementById("unit").value = result.unit;
        document.getElementById("time-format").value = result.format;
    });

}

function openSetup(){
    document.getElementById("setup-modal").style.display = "block";
}

function applySettings(city, unit, format){
        chrome.storage.local.set({"city": city, "unit": unit, "format": format}, function() {
            getWeather();
            document.getElementById("setup-modal").style.display = "none";
            document.getElementById("settings-modal").style.display = "none";
        });
}

document.getElementById("settings").addEventListener("click", function() {
    openSettings();
});

document.getElementById("settings-error").addEventListener("click", function(){
    openSettings();
    document.getElementById("error-modal").style.display = "none";
});

document.getElementById("done").addEventListener("click", function() {
    const city = document.getElementById("city-setup").value;
    const unit = document.getElementById("unit-setup").value;
    const format = document.getElementById("time-format-setup").value;

    if(country && city && unit && format){
        applySettings(country, city, unit, format);
    }
});

document.getElementById("apply").addEventListener("click", function() {
    const city = document.getElementById("cityInput").value;
    const unit = document.getElementById("unit").value;
    const format = document.getElementById("time-format").value;

    const regex = /^([A-Za-zÀ-ÿ'’\-\s]+,\s[A-Za-zÀ-ÿ'’\-\s]+;?\s?)+$/
    if (regex.test(city) && unit && format) {
        applySettings(city, unit, format);
    }
});

document.getElementById("weatherapi-link").addEventListener("click", function(){
    chrome.tabs.create({url: "https://www.weatherapi.com/"});
});

window.oncontextmenu = function (){
    return false;
}