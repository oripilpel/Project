import { storageService } from './storage.service.js';

export const locService = {
    getLocs,
    addLoc
}

const locs = storageService.load('locationDB') || [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function addLoc(locName, pos) {
    locs.push({ name: locName, lat: pos.lat, lng: pos.lng, createdAt: Date.now() })
    storageService.save('locationDB', locs)
}