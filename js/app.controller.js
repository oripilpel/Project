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
window.onCopyLink = onCopyLink;
window.onRemoveLoc = onRemoveLoc;
window.onLocSelected = onLocSelected;
window.onSaveLocation = onSaveLocation;

function onInit() {
    renderLocsList();
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (!params.lng || !params.lat) {
        params.lat = 32.0749831;
        params.lng = 34.9120554;
    }
    mapService.initMap(+params.lat, +params.lng)
        .then(() => {
            onGetWeather({ lat: +params.lat, lng: +params.lng });
        })
        .catch(() => console.log('Error: cannot init map'));

}

function renderLocsList() {
    locService.getLocs()
        .then(locs => {
            document.querySelector('.locations').innerHTML = locs.map(loc => `<li>
                <span>${loc.name}</span>
                <button class="btn btn-go" onclick="onLocSelected('${loc.name}')">Go</button>
                <button class="btn btn-remove" onclick="onRemoveLoc('${loc.name}')">Delete</button>
            </li>`)
        })
}

function onLocSelected(locName) {
    const loc = locService.getLocByName(locName);
    onPanTo(loc);
}

function renderWeather(weather) {
    document.querySelector('.weather').innerHTML = `<h3>${weather.name}</h3>
        <img src="http://openweathermap.org/img/w/${weather.weather[0].icon}.png"/>
        <div class="weather-info flex">
            <span>${weather.weather[0].main} -&nbsp;</span><span>${utilsService.formatFahrenheit(weather.main.temp_min)} - ${utilsService.formatFahrenheit(weather.main.temp_max)}</span>
        <div>`
}

function onRemoveLoc(locName) {
    locService.remove(locName);
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

function onGetWeather(loc) {
    weatherService.get(loc)
        .then(weather => renderWeather(weather));
}

function onCopyLink() {
    const regx = /.+?(?=.html).html/;
    const matches = window.location.href.match(regx);
    const currLoc = mapService.getCurrLoc();
    navigator.clipboard.writeText(`${matches[0]}?lat=${currLoc.lat}&lng=${currLoc.lng}`);
}

function onSaveLocation(lat, lng) {
    const locName = document.querySelector('[name="place-name-prompt"]').value
    if (!locName.trim()) return
    locService.addLoc(locName, { lat, lng })

}