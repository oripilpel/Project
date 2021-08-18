import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { utilsService } from './services/utils.service.js';
import { weatherService } from './services/weather.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;

function onInit() {
    mapService.initMap()
        .then(() => {
            onGetWeather();
        })
        .catch(() => console.log('Error: cannot init map'));
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    utilsService.getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo(loc = { lat: 35.6895, lng: 139.6917 }) {
    console.log('Panning the Map');
    mapService.panTo(loc.lat, loc.lng);
}

function onSearch() {
    const location = document.querySelector('[name="location"]').value
    const gelLoc = mapService.getGeoLocation(location)
    gelLoc.then(location => {
        onGetWeather(location)
        mapService.panTo(location)
    }
    )
}

function onGetWeather(loc = { lat: 35.6895, lng: 139.6917 }) {
    weatherService.get(loc)
        .then(weather => renderWeather(weather));
}

function renderWeather(weather) {
    document.querySelector('.weather').innerHTML = `<h3>${weather.name}</h3>
        <img src="http://openweathermap.org/img/w/${weather.weather[0].icon}.png"/>
        <div class="weather-info flex">
            <span>${weather.weather[0].main} -&nbsp;</span><span>${weather.main.temp_min} - ${weather.main.temp_max}</span>
        <div>`
}