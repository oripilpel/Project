import { locService } from './loc.service.js';


export const mapService = {
    initMap,
    addMarker,
    panTo,
    getGeoLocation,
    getCurrLoc
}

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyBj6uH299fNka4OlOEA05hitpszMFv3b1g'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getGeoLocation(address) {
    const API_KEY = 'AIzaSyBj6uH299fNka4OlOEA05hitpszMFv3b1g'
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
    const locs = locService.getLocs()
    console.log(locs);
    const locIdx = locs.findIndex(loc => loc.name === address)
    // if (locIdx !== -1) {
    //     callback(locs[locIdx])
    //     return
    // }

    return axios.get(url)
        .then(res => {
            const location = res.data.results[0].geometry.location
            locs.push(location)
            return location
        })
    // .then(location => {
    //     callback(location)
    //     callback2(location)
    // })
}

function getCurrLoc() {
    return {lat: gMap.center.lat(), lng: gMap.center.lng()};
}