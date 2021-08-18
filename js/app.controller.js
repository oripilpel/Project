import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { utilsService } from './services/utils.service.js';
import { weatherService } from './services/weather.service.js';

window.onload = onInit;
window.onShowUserPos = onShowUserPos;
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
    Promise.all([mapService.initMap(+params.lat, +params.lng), mapService.addMarkers(locService.getLocs())])
        .then(() => onGetWeather({ lat: params.lat, lng: params.lng }))
        .catch(() => console.log('Error: cannot init map'));
}

function renderLocsList() {
    locService.getLocs()
        .then(locs => {
            document.querySelector('.locations').innerHTML = locs.map(loc => `<li class="flex justify-between">
                <span class="flex align-center">${loc.name}</span>
                <div class="actions">
                    <button class="btn btn-go" onclick="onLocSelected('${loc.name}')">Go</button>
                    <button class="btn btn-remove" onclick="onRemoveLoc('${loc.name}')">Delete</button>
                </div>
            </li>`).join('');
        })
}

function onLocSelected(locName) {
    const loc = locService.getLocByName(locName);
    onPanTo(loc);
    onGetWeather(loc);
    window.history.pushState('', '', `?lat=${loc.lat}&lng=${loc.lng}`);
}

function renderWeather(weather) {
    document.querySelector('.weather').innerHTML = `<h3>${weather.name}</h3>
        <img src="http://openweathermap.org/img/w/${weather.weather[0].icon}.png"/>
        <div class="weather-info flex direction-column">
            <div><span>${weather.weather[0].main}</span></div>
            <span>${utilsService.formatCelsius(weather.main.temp_min)} - ${utilsService.formatCelsius(weather.main.temp_max)}</span>
        <div>`;
}

function onRemoveLoc(locName) {
    mapService.removeMarker(locName);
    locService.remove(locName);
    renderLocsList();
}

function onShowUserPos() {
    utilsService.getPosition()
        .then(({ coords }) => {
            const pos = { lat: coords.latitude, lng: coords.longitude };
            onPanTo(pos);
            onGetWeather(pos);
        })
        .catch(err => {
            console.log('err!!!', err);
        });
}

function onPanTo(loc = { lat: 35.6895, lng: 139.6917 }) {
    mapService.panTo(loc.lat, loc.lng);
}

function onSearch() {
    const location = document.querySelector('[name="location"]').value
    if (!location.trim()) return
    mapService.getGeoLocation(location)
        .then(loc => {
            onGetWeather(loc);
            mapService.panTo(loc);
            window.history.pushState('', '', `?lat=${loc.lat}&lng=${loc.lng}`);
        });
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
    const loc = { name: locName, lat, lng };
    locService.add(loc);
    mapService.addMarker(loc);
    mapService.closeInfoWindow();
    renderLocsList()
}
