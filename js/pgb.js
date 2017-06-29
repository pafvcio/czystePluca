function init() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    navigator.notification.beep(1);
}

function checkAir() {
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getAirlyData);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function getAirlyData(geo) {

    var location = { latitude: geo.coords.latitude, longitude: geo.coords.longitude }

    var request;
    url = 'https://airapi.airly.eu/v1/mapPoint/measurements?latitude=' + location.latitude + '&longitude=' + location.longitude;

    request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.setRequestHeader('apikey', 'c5f6edec14af460d9179b9e90be515c2');
    request.send(null);

    if (request.status == '200') {
        var obj = JSON.parse(request.response);

        var airData = {
            airQualityIndex: parseFloat(obj.currentMeasurements.airQualityIndex).toFixed(2),
            pm25: parseFloat(obj.currentMeasurements.pm25).toFixed(2),
            pm10: parseFloat(obj.currentMeasurements.pm10).toFixed(2),
            pressure: parseFloat(obj.currentMeasurements.pressure / 100).toFixed(2),
            humidity: parseFloat(obj.currentMeasurements.humidity).toFixed(2),
            temperature: parseFloat(obj.currentMeasurements.temperature).toFixed(2),
            pollutionLevel: obj.currentMeasurements.pollutionLevel
        }

        fillAirData(airData);
    }
}

function fillAirData(airData) {
    document.getElementById("airQualityIndex").innerHTML = airData.airQualityIndex;
    document.getElementById("pm10").innerHTML = airData.pm10;
    document.getElementById("pm25").innerHTML = airData.pm25;
    document.getElementById("pressure").innerHTML = airData.pressure;
    document.getElementById("humidity").innerHTML = airData.humidity;
    document.getElementById("temperature").innerHTML = airData.temperature;
    document.getElementById("pollutionLevel").innerHTML = airData.pollutionLevel;
}

