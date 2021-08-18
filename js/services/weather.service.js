const API_KEY = '51a6961782290e140b8428acf731b07e';

export const weatherService = {
    get: getWeather
}

function getWeather(loc) {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lng}&appid=${API_KEY}`)
        .then(({data}) => data);
}
