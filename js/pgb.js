function init() {
    document.addEventListener("deviceready", onDeviceReady, false);
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

function odliczanie() {

    var dzisiaj = new Date();

    var dzien = dzisiaj.getDate();
    var miesiac = dzisiaj.getMonth() + 1;
    var rok = dzisiaj.getFullYear();
    var godzina = dzisiaj.getHours();
    if (godzina < 10) godzina = "0" + godzina;
    var minuta = dzisiaj.getMinutes();
    if (minuta < 10) minuta = "0" + minuta;
    var sekunda = dzisiaj.getSeconds();
    if (sekunda < 10) sekunda = "0" + sekunda;

    document.getElementById("zegar").innerHTML =
    dzien + "/" + miesiac + "/" + rok + " | " + godzina + ":" + minuta + ":" + sekunda;

    setTimeout("odliczanie()", 1000);
}

function getAirlyData(geo) {

    var location = { latitude: geo.coords.latitude, longitude: geo.coords.longitude }
    location = { latitude: 49.98917, longitude: 19.72743 }

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
        }

        if (airData.airQualityIndex != 'NaN') {
            fillAirData(airData);
            addToLocalStorage(airData); 
            navigator.notification.beep(1);
        }
        else {
            alert('Nie ma czujnikow w Twojej okolicy!')
        }
    }
}

function fillAirData(airData) {
    document.getElementById("airQuality").innerHTML = getAirQuality(airData.airQualityIndex);
    document.getElementById("airQualityIndex").innerHTML = airData.airQualityIndex;
    document.getElementById("pm10").innerHTML = airData.pm10;
    document.getElementById("pm25").innerHTML = airData.pm25;
    document.getElementById("pressure").innerHTML = airData.pressure;
    document.getElementById("humidity").innerHTML = airData.humidity;
    document.getElementById("temperature").innerHTML = airData.temperature;

    document.getElementById("canGoWalk").innerHTML = checkCanAirActivity(airData.airQualityIndex,65,80)
    document.getElementById("canCycling").innerHTML = checkCanAirActivity(airData.airQualityIndex, 40, 65)
    document.getElementById("canRunning").innerHTML = checkCanAirActivity(airData.airQualityIndex, 30, 50)

}

function addToLocalStorage(airData) {
    localStorage.setItem('date', new Date().toString());
    localStorage.setItem('airQualityIndex', airData.airQualityIndex);
    localStorage.setItem('pm10', airData.pm10);
    localStorage.setItem('pm25', airData.pm25);
    localStorage.setItem('pressure', airData.pressure);
    localStorage.setItem('humidity', airData.humidity);
    localStorage.setItem('temperature', airData.temperature);
}

function getAirQuality(caqi) {
    text = '';

    if (caqi > 100) {
        text = 'Bardzo z³e';
        document.getElementById("airQuality").style.color = "#ff8080";
    }
    else if (caqi > 75) {
        text = 'Z³e';
        document.getElementById("airQuality").style.color = "#ffbf80";
    }
    else if (caqi > 50) {
        text = 'Œrednie';
        document.getElementById("airQuality").style.color = "#ffff80";
    }
    else if (caqi > 25) {
        text = 'Dobre';
        document.getElementById("airQuality").style.color = "#80ffaa";
    }
    else {
        text = 'Bardzo dobre';
        document.getElementById("airQuality").style.color = "#80ffaa";
    }

    return text;
}

function checkCanAirActivity(actualCaqi, maxCaqiWithoutMask, maxCaqi) {
    text = '';

    if (actualCaqi < maxCaqiWithoutMask) {
        text = 'Tak!';
    }
    else if (actualCaqi < maxCaqi) {
        text = 'Tak, ale ubierz maskê!';
    }
    else {
        text = 'Nie!';
    }

    return text;
}