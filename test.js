const fs = require('fs');

const Astronomy = require('./astronomy.js');

console.log("Astronomy caricata:", typeof Astronomy !== 'undefined');
console.log("Astronomy.Body:", Astronomy.Body);

const state = {
    lat: 45.716370,
    lon: 12.456541,
    alt: 12
};

const PLANETS = [
    { id: 'Mercury', name: 'Mercurio', color: 'var(--color-mercury)', body: 'Mercury' },
    { id: 'Venus', name: 'Venere', color: 'var(--color-venus)', body: 'Venus' },
    { id: 'Mars', name: 'Marte', color: 'var(--color-mars)', body: 'Mars' },
    { id: 'Jupiter', name: 'Giove', color: 'var(--color-jupiter)', body: 'Jupiter' },
    { id: 'Saturn', name: 'Saturno', color: 'var(--color-saturn)', body: 'Saturn' },
    { id: 'Uranus', name: 'Urano', color: 'var(--color-uranus)', body: 'Uranus' },
    { id: 'Neptune', name: 'Nettuno', color: 'var(--color-neptune)', body: 'Neptune' }
];

try {
    const observer = new Astronomy.Observer(state.lat, state.lon, state.alt);
    const activeDate = new Date();
    const astroTime = Astronomy.MakeTime(activeDate);

    const moon = Astronomy.Body.Moon;
    const ill = Astronomy.Illumination(moon, astroTime);
    console.log("Illuminazione della Luna grezza:", ill);
    console.log("TEST COMPLETATO CON SUCCESSO! Nessun errore riscontrato nei calcoli.");
} catch (e) {
    console.error("TEST FALLITO! Errore riscontrato:", e);
}
