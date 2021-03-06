export const utilsService = {
    getPosition,
    formatCelsius
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function formatCelsius(val) {
    return new Intl.NumberFormat('en', { style: 'unit', unit: 'celsius' }).format(val);
}
