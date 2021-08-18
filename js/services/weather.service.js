import { storageService } from './storage.service.js';

const API_KEY = '51a6961782290e140b8428acf731b07e';
const CACHE_TIME = 1000 * 60 * 60 * 24;
const DB_KEY = 'weatherDB'
let gWeatherDB = storageService.load(DB_KEY) || {}


export const weatherService = {
    get: getWeather
}

function getWeather(loc) {
    const currLocWeather = gWeatherDB[loc.lat + '_' + loc.lng];
    if (currLocWeather && currLocWeather.lastReq + CACHE_TIME > Date.now())
        return Promise.resolve(currLocWeather.data);
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lng}&appid=${API_KEY}`)
        .then(({ data }) => {
            gWeatherDB[data.coord.lat + '_' + data.coord.lon].data = data;
            gWeatherDB[data.coord.lat + '_' + data.coord.lon].lastReq = Date.now();
            storageService.save(DB_KEY, gWeatherDB);
            return data;
        })

}
