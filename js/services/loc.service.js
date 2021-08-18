import { storageService } from './storage.service.js';
import { mapService } from './map.service.js';

export const locService = {
    getLocs,
    getLocByName: getLocByName,
    add: addLoc,
    remove: removeLoc
}
const KEY = 'locationDB';

let locs = storageService.load(KEY) || [
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

function addLoc(loc) {
    loc.createdAt = Date.now();
    locs.push(loc);
    saveLocs();
}

function removeLoc(name) {
    const idx = locs.findIndex(loc => loc.name === name);
    if (idx === -1) return;
    locs.splice(idx, 1);
    if (locs.length === 0) locs = [
        { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
        { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
    ]
    saveLocs();
    mapService.addMarkers(Promise.resolve(locs));
}

function saveLocs() {
    storageService.save(KEY, locs)
}