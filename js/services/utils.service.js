// This function provides a Promise API to the callback-based-api of getCurrentPosition
export const utilsService = {
    getPosition,
    formatFahrenheit
}

function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function formatFahrenheit(val) {
    return new Intl.NumberFormat('en', { style: 'unit', unit: 'fahrenheit' }).format(val);
}