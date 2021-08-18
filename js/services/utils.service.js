// This function provides a Promise API to the callback-based-api of getCurrentPosition
export const utilsService = {
    getPosition
}

function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}