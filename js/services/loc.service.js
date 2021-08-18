import { storageService } from './storage.service.js';

export const locService = {
    getLocs,
    getLocByName: getLocByName,
    addLoc,
    remove: removeLoc
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

function getLocByName(name) {
    return locs.find(loc => loc.name === name);
}

function addLoc(locName, pos) {
    locs.push({ name: locName, lat: pos.lat, lng: pos.lng })
    saveLocs();
}

function removeLoc(name) {
    const idx = locs.findIndex(loc => loc.name === name);
    locs.splice(idx, 1);
    saveLocs();
}

function saveLocs() {
    storageService.save('locationDB', locs)
}