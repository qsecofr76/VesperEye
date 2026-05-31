/**
 * VesperEye - Logica e Motore di Calcolo Astronomico
 * Sviluppato per Roberto & Astrofili Ponte di Piave
 */

// Configurazione Città Italiane (Preset)
const CITIES = {
    pontedipiave: { lat: 45.7208, lon: 12.4635, alt: 12, name: "Ponte di Piave" },
    roma: { lat: 41.9028, lon: 12.4964, alt: 53, name: "Roma" },
    milano: { lat: 45.4642, lon: 9.1900, alt: 120, name: "Milano" },
    napoli: { lat: 40.8518, lon: 14.2681, alt: 17, name: "Napoli" },
    torino: { lat: 45.0703, lon: 7.6869, alt: 239, name: "Torino" },
    palermo: { lat: 38.1157, lon: 13.3615, alt: 31, name: "Palermo" },
    cagliari: { lat: 39.2238, lon: 9.1217, alt: 4, name: "Cagliari" },
    bari: { lat: 41.1171, lon: 16.8719, alt: 5, name: "Bari" }
};

// Mappatura dei Pianeti supportati (utilizza stringhe per prevenire crash all'avvio in caso di offline)
const PLANETS = [
    { id: 'Mercury', name: 'Mercurio', color: 'var(--color-mercury)', body: 'Mercury' },
    { id: 'Venus', name: 'Venere', color: 'var(--color-venus)', body: 'Venus' },
    { id: 'Mars', name: 'Marte', color: 'var(--color-mars)', body: 'Mars' },
    { id: 'Jupiter', name: 'Giove', color: 'var(--color-jupiter)', body: 'Jupiter' },
    { id: 'Saturn', name: 'Saturno', color: 'var(--color-saturn)', body: 'Saturn' },
    { id: 'Uranus', name: 'Urano', color: 'var(--color-uranus)', body: 'Uranus' },
    { id: 'Neptune', name: 'Nettuno', color: 'var(--color-neptune)', body: 'Neptune' }
];

// Stato dell'applicazione
const state = {
    lat: 45.7208,
    lon: 12.4635,
    alt: 12,
    isRealTime: true,
    customDate: new Date(),
    selectedPlanet: 'Jupiter', // Default lune per Giove
    animationSpeed: 1, // Multiplo di velocità per lune (1x, 10x, 100x, 1000x, ecc.)
    simulatedDate: new Date(), // Data simulata corrente per le lune
    lastTickTime: Date.now()
};

// Stato tracciamento ISS
let issTle = null;
let isTleFetching = false;
const FALLBACK_ISS_TLE = {
    line1: "1 25544U 98067A   26150.83995331  .00011335  00000+0  20978-3 0  9996",
    line2: "2 25544  51.6338  25.9780 0007215 115.7878 244.3856 15.49504954569065",
    header: "ISS (ZARYA)"
};

// Configurazione 10 Pianeti Nani e Asteroidi Maggiori
const DWARF_PLANETS = [
    { id: 'Pluto', name: 'Plutone', type: 'Pianeta Nano', color: '#fca5a5', useNative: true },
    { id: 'Ceres', name: 'Cerere', type: 'Pianeta Nano', color: '#cbd5e1', useNative: false, elements: { a: 2.7674, e: 0.0789, i: 10.593, node: 80.255, peri: 73.422, M0: 95.865, n: 0.9856076686 / Math.pow(2.7674, 1.5) } },
    { id: 'Eris', name: 'Eris', type: 'Pianeta Nano', color: '#d8b4fe', useNative: false, elements: { a: 67.67, e: 0.441, i: 44.2, node: 35.8, peri: 151.6, M0: 204.6, n: 0.9856076686 / Math.pow(67.67, 1.5) } },
    { id: 'Haumea', name: 'Haumea', type: 'Pianeta Nano', color: '#fdba74', useNative: false, elements: { a: 43.34, e: 0.198, i: 28.2, node: 121.1, peri: 240.2, M0: 210.4, n: 0.9856076686 / Math.pow(43.34, 1.5) } },
    { id: 'Makemake', name: 'Makemake', type: 'Pianeta Nano', color: '#fef08a', useNative: false, elements: { a: 45.79, e: 0.156, i: 29.0, node: 79.6, peri: 298.4, M0: 164.8, n: 0.9856076686 / Math.pow(45.79, 1.5) } },
    { id: 'Vesta', name: 'Vesta', type: 'Asteroide', color: '#86efac', useNative: false, elements: { a: 2.3619, e: 0.0888, i: 7.140, node: 103.81, peri: 150.75, M0: 20.85, n: 0.9856076686 / Math.pow(2.3619, 1.5) } },
    { id: 'Pallas', name: 'Pallade', type: 'Asteroide', color: '#93c5fd', useNative: false, elements: { a: 2.772, e: 0.231, i: 34.8, node: 173.1, peri: 310.2, M0: 107.5, n: 0.9856076686 / Math.pow(2.772, 1.5) } },
    { id: 'Juno', name: 'Giunone', type: 'Asteroide', color: '#fda4af', useNative: false, elements: { a: 2.669, e: 0.258, i: 12.98, node: 169.9, peri: 248.1, M0: 35.2, n: 0.9856076686 / Math.pow(2.669, 1.5) } },
    { id: 'Hygiea', name: 'Igea', type: 'Asteroide', color: '#a5f3fc', useNative: false, elements: { a: 3.136, e: 0.114, i: 3.84, node: 283.4, peri: 312.3, M0: 113.8, n: 0.9856076686 / Math.pow(3.136, 1.5) } },
    { id: 'Chiron', name: 'Chirone', type: 'Centauro', color: '#f9a8d4', useNative: false, elements: { a: 13.67, e: 0.380, i: 6.93, node: 209.4, peri: 339.3, M0: 339.4, n: 0.9856076686 / Math.pow(13.67, 1.5) } }
];

// Riferimenti DOM (Inizializzati in initDOM)
let dom = {};
let ctx = null;

function initDOM() {
    dom = {
        inputLat: document.getElementById('inputLat'),
        inputLon: document.getElementById('inputLon'),
        inputAlt: document.getElementById('inputAlt'),
        selectCity: document.getElementById('selectCity'),
        btnGPS: document.getElementById('btnGPS'),
        gpsIndicator: document.getElementById('gpsIndicator'),
        gpsStatusText: document.getElementById('gpsStatusText'),
        coordsDisplay: document.getElementById('coordsDisplay'),
        checkRealTime: document.getElementById('checkRealTime'),
        manualTimeInputs: document.getElementById('manualTimeInputs'),
        inputDate: document.getElementById('inputDate'),
        inputTime: document.getElementById('inputTime'),
        btnTimeSubHour: document.getElementById('btnTimeSubHour'),
        btnTimeNow: document.getElementById('btnTimeNow'),
        btnTimeSunset: document.getElementById('btnTimeSunset'),
        btnTimeAddHour: document.getElementById('btnTimeAddHour'),
        gpsError: document.getElementById('gpsError'),
        planetsGrid: document.getElementById('planetsGrid'),
        compassPlanetsGroup: document.getElementById('compassPlanetsGroup'),
        moonsSection: document.getElementById('moonsSection'),
        selectedPlanetTitle: document.getElementById('selectedPlanetTitle'),
        moonsCanvas: document.getElementById('moonsCanvas'),
        lunesLegend: document.getElementById('lunesLegend'),
        btnJPLQuery: document.getElementById('btnJPLQuery'),
        jplDebuggerArea: document.getElementById('jplDebuggerArea'),
        jplUrlDisplay: document.getElementById('jplUrlDisplay'),
        jplRawResponse: document.getElementById('jplRawResponse'),
        
        // Sezione ISS
        issSection: document.getElementById('issSection'),
        issLoading: document.getElementById('issLoading'),
        issError: document.getElementById('issError'),
        issContent: document.getElementById('issContent'),
        
        // Sezione Pianeti Nani
        dwarfsGrid: document.getElementById('dwarfsGrid')
    };
    // Rimuovi o metti in sicurezza se gli elementi non esistono
    ctx = dom.moonsCanvas.getContext('2d');
}

// Inizializzazione dell'Applicazione
window.addEventListener('DOMContentLoaded', () => {
    // Controllo di sicurezza: se la CDN è bloccata o l'utente è offline, avvisa in modo visibile
    if (typeof Astronomy === 'undefined') {
        const errorBanner = document.createElement('div');
        errorBanner.style.position = 'fixed';
        errorBanner.style.top = '0';
        errorBanner.style.left = '0';
        errorBanner.style.width = '100%';
        errorBanner.style.background = '#ef4444';
        errorBanner.style.color = '#fff';
        errorBanner.style.padding = '1.2rem';
        errorBanner.style.textAlign = 'center';
        errorBanner.style.zIndex = '9999';
        errorBanner.style.fontWeight = 'bold';
        errorBanner.style.fontSize = '1rem';
        errorBanner.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        errorBanner.innerHTML = '⚠️ ERRORE DI CONNESSIONE: Impossibile caricare il motore astronomico "Astronomy Engine" da Internet. Controlla la tua connessione di rete e ricarica la pagina.';
        document.body.appendChild(errorBanner);
        return;
    }

    initDOM();
    initTimeInputs();
    setupEventListeners();
    loadSavedSettings();
    
    // Rilevamento automatico disabilitato per evitare blocchi; si attiva solo premendo il pulsante
    updateGPSDisplay(false, "GPS Non Attivo (Manuale)");
    recalculate();
    
    // Avvia loop principale
    tick();
});

// Imposta gli input data/ora manuali sui valori correnti
function initTimeInputs() {
    const now = new Date();
    dom.inputDate.value = now.toISOString().split('T')[0];
    dom.inputTime.value = now.toTimeString().split(' ')[0];
}

// Configura i listener degli eventi
function setupEventListeners() {
    // Cambio coordinate manuale
    const updateCoords = () => {
        state.lat = parseFloat(dom.inputLat.value) || 0;
        state.lon = parseFloat(dom.inputLon.value) || 0;
        state.alt = parseFloat(dom.inputAlt.value) || 0;
        dom.selectCity.value = 'current';
        saveSettings();
        updateGPSDisplay(false, "Inserimento manuale");
        recalculate();
    };
    
    dom.inputLat.addEventListener('change', updateCoords);
    dom.inputLon.addEventListener('change', updateCoords);
    dom.inputAlt.addEventListener('change', updateCoords);
    
    // Preset Città
    dom.selectCity.addEventListener('change', () => {
        const cityKey = dom.selectCity.value;
        if (cityKey && CITIES[cityKey]) {
            const city = CITIES[cityKey];
            dom.inputLat.value = city.lat;
            dom.inputLon.value = city.lon;
            dom.inputAlt.value = city.alt;
            state.lat = city.lat;
            state.lon = city.lon;
            state.alt = city.alt;
            saveSettings();
            updateGPSDisplay(true, `Preset: ${city.name}`);
            recalculate();
        }
    });
    
    // Pulsante GPS
    dom.btnGPS.addEventListener('click', () => {
        requestGPS(true);
    });
    
    // Toggle Realtime vs Manuale
    dom.checkRealTime.addEventListener('change', (e) => {
        state.isRealTime = e.target.checked;
        if (state.isRealTime) {
            dom.manualTimeInputs.style.display = 'none';
        } else {
            dom.manualTimeInputs.style.display = 'block';
            syncManualTimeFromState();
        }
        recalculate();
    });
    
    // Input manuali data/ora
    const handleManualTimeChange = () => {
        const dateVal = dom.inputDate.value;
        const timeVal = dom.inputTime.value;
        if (dateVal && timeVal) {
            state.customDate = new Date(`${dateVal}T${timeVal}`);
            state.simulatedDate = new Date(state.customDate);
            recalculate();
        }
    };
    dom.inputDate.addEventListener('change', handleManualTimeChange);
    dom.inputTime.addEventListener('change', handleManualTimeChange);
    
    // Pulsanti orari rapidi
    dom.btnTimeSubHour.addEventListener('click', () => {
        adjustManualTime(-3600 * 1000);
    });
    dom.btnTimeAddHour.addEventListener('click', () => {
        adjustManualTime(3600 * 1000);
    });
    dom.btnTimeNow.addEventListener('click', () => {
        state.customDate = new Date();
        state.simulatedDate = new Date(state.customDate);
        syncManualTimeFromState();
        recalculate();
    });

    dom.btnTimeSunset.addEventListener('click', () => {
        const observer = new Astronomy.Observer(state.lat, state.lon, state.alt);
        // Start search from the beginning of the current simulated day to find today's sunset
        const startOfDay = new Date(state.simulatedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const astroTime = Astronomy.MakeTime(startOfDay);
        
        let setTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, astroTime, 1);
        if (setTime) {
            // Disattiva modalit tempo reale esplicitamente
            state.isRealTime = false;
            dom.checkRealTime.checked = false;
            
            state.customDate = setTime.date;
            state.simulatedDate = new Date(state.customDate);
            syncManualTimeFromState();
            recalculate();
        } else {
            alert("Impossibile calcolare il tramonto per la data e posizione attuali.");
        }
    });

    
    // JPL Horizons Live Debugger (Messo in sicurezza se l'elemento è stato rimosso dall'HTML)
    if (dom.btnJPLQuery) {
        dom.btnJPLQuery.addEventListener('click', runJPLHorizonsQuery);
    }

    // Gestione ridimensionamento Canvas
    window.addEventListener('resize', resizeCanvas);
}

// Funzione di debug per interrogare le API ufficiali NASA JPL Horizons
function runJPLHorizonsQuery() {
    dom.jplDebuggerArea.style.display = 'block';
    dom.jplRawResponse.value = "Interrogazione NASA JPL Horizons in corso...";
    
    const JPL_COMMANDS = {
        Mercury: '199',
        Venus: '299',
        Mars: '499',
        Jupiter: '599',
        Saturn: '699',
        Uranus: '799',
        Neptune: '899'
    };
    
    // Default a Giove se la selezione non è un pianeta mappato
    const planetId = state.selectedPlanet || 'Jupiter';
    const command = JPL_COMMANDS[planetId] || '599';
    const date = getActiveDate();
    
    // Helper per aggiungere zeri iniziali
    const pad = (n) => String(n).padStart(2, '0');
    
    // Formattazione data in formato UTC accettato da JPL: 'YYYY-MM-DD HH:MM'
    const startUtc = `${date.getUTCFullYear()}-${pad(date.getUTCMonth()+1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
    const stopDate = new Date(date.getTime() + 60000); // Step di 1 minuto
    const stopUtc = `${stopDate.getUTCFullYear()}-${pad(stopDate.getUTCMonth()+1)}-${pad(stopDate.getUTCDate())} ${pad(stopDate.getUTCHours())}:${pad(stopDate.getUTCMinutes())}`;
    
    // Latitudine, Longitudine ed elevazione (in km per JPL)
    const lat = state.lat.toFixed(4);
    const lon = state.lon.toFixed(4);
    const altKm = (state.alt / 1000).toFixed(3);
    
    // Formattazione con virgolette singole codificate (%27) richieste rigorosamente dalle API NASA JPL
    const qCommand = encodeURIComponent(`'${command}'`);
    const qCenter = encodeURIComponent(`'coord@399'`);
    const qCoordType = encodeURIComponent(`'GEODETIC'`);
    const qSiteCoord = encodeURIComponent(`'${lon},${lat},${altKm}'`);
    const qStartTime = encodeURIComponent(`'${startUtc}'`);
    const qStopTime = encodeURIComponent(`'${stopUtc}'`);
    const qStepSize = encodeURIComponent(`'1m'`);
    const qQuantities = encodeURIComponent(`'4'`);
    
    // Endpoint ufficiale di produzione per le API REST NASA JPL Horizons
    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json` +
                `&COMMAND=${qCommand}` +
                `&OBJ_DATA='NO'` +
                `&MAKE_EPHEM='YES'` +
                `&EPHEM_TYPE='OBSERVER'` +
                `&CENTER=${qCenter}` +
                `&COORD_TYPE=${qCoordType}` +
                `&SITE_COORD=${qSiteCoord}` +
                `&START_TIME=${qStartTime}` +
                `&STOP_TIME=${qStopTime}` +
                `&STEP_SIZE=${qStepSize}` +
                `&QUANTITIES=${qQuantities}`;
    
    dom.jplUrlDisplay.value = url;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.result) {
                dom.jplRawResponse.value = data.result;
            } else if (data && data.error) {
                dom.jplRawResponse.value = `Errore restituito da NASA:\n${data.error}`;
            } else {
                dom.jplRawResponse.value = JSON.stringify(data, null, 2);
            }
        })
        .catch(err => {
            dom.jplRawResponse.value = `Errore di rete / Blocco CORS:\n${err.message}\n\nNota: Poiché stai aprendo la pagina tramite protocollo "file://", alcuni browser bloccano le richieste dirette alle API esterne.\n\nPUOI COMUNQUE VERIFICARE:\nCopia l'URL sopra indicato, incollalo in una nuova scheda del browser e premi Invio. Potrai visualizzare la risposta ufficiale grezza direttamente da NASA!`;
        });
}

// Richiesta geolocalizzazione GPS del browser
function requestGPS(force = false) {
    if (!navigator.geolocation) {
        showError("Geolocalizzazione non supportata dal tuo browser.");
        updateGPSDisplay(false, "Non disponibile");
        return;
    }
    
    dom.gpsError.style.display = 'none';
    updateGPSDisplay(null, "Rilevamento in corso...");
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const alt = position.coords.altitude || 0;
            
            dom.inputLat.value = lat.toFixed(4);
            dom.inputLon.value = lon.toFixed(4);
            dom.inputAlt.value = Math.round(alt);
            
            state.lat = lat;
            state.lon = lon;
            state.alt = alt;
            
            dom.selectCity.value = 'current';
            saveSettings();
            updateGPSDisplay(true, "GPS Attivo");
            recalculate();
        },
        (error) => {
            console.warn("Errore GPS:", error);
            if (force) {
                showError("Impossibile rilevare la posizione GPS automaticamente. Verifica i permessi del browser.");
            }
            updateGPSDisplay(false, "GPS Non Rilevato");
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// Aggiorna lo stato visivo della geolocalizzazione
function updateGPSDisplay(active, text) {
    if (active === true) {
        dom.gpsIndicator.style.backgroundColor = 'var(--neon-green)';
        dom.gpsIndicator.style.boxShadow = '0 0 8px var(--neon-green)';
    } else if (active === false) {
        dom.gpsIndicator.style.backgroundColor = 'var(--neon-red)';
        dom.gpsIndicator.style.boxShadow = '0 0 8px var(--neon-red)';
    } else {
        dom.gpsIndicator.style.backgroundColor = '#f59e0b';
        dom.gpsIndicator.style.boxShadow = '0 0 8px #f59e0b';
    }
    dom.gpsStatusText.innerText = text;
    dom.coordsDisplay.innerText = `${Math.abs(state.lat).toFixed(4)}° ${state.lat >= 0 ? 'N' : 'S'}, ${Math.abs(state.lon).toFixed(4)}° ${state.lon >= 0 ? 'E' : 'W'}`;
}

// Mostra messaggio di errore nella sidebar
function showError(msg) {
    dom.gpsError.innerText = msg;
    dom.gpsError.style.display = 'block';
    setTimeout(() => {
        dom.gpsError.style.display = 'none';
    }, 8000);
}

// Regola l'orario manuale di un delta in ms
function adjustManualTime(deltaMs) {
    state.customDate = new Date(state.customDate.getTime() + deltaMs);
    state.simulatedDate = new Date(state.simulatedDate.getTime() + deltaMs);
    syncManualTimeFromState();
    recalculate();
}

// Sincronizza i controlli manuali sullo stato interno
function syncManualTimeFromState() {
    const year = state.customDate.getFullYear();
    const month = String(state.customDate.getMonth() + 1).padStart(2, '0');
    const day = String(state.customDate.getDate()).padStart(2, '0');
    dom.inputDate.value = `${year}-${month}-${day}`;
    // Ora locale corretta per timezone
    const hrs = String(state.customDate.getHours()).padStart(2, '0');
    const mins = String(state.customDate.getMinutes()).padStart(2, '0');
    const secs = String(state.customDate.getSeconds()).padStart(2, '0');
    dom.inputTime.value = `${hrs}:${mins}:${secs}`;
}

// Restituisce la data da usare per le effemeridi generali (reale o manuale)
function getActiveDate() {
    return state.isRealTime ? new Date() : state.customDate;
}

// Salvataggio Impostazioni su LocalStorage
function saveSettings() {
    try {
        localStorage.setItem('vespereye_astro_lat', state.lat);
        localStorage.setItem('vespereye_astro_lon', state.lon);
        localStorage.setItem('vespereye_astro_alt', state.alt);
    } catch (e) {
        console.error(e);
    }
}

// Caricamento Impostazioni salvate
function loadSavedSettings() {
    try {
        let savedLat = localStorage.getItem('vespereye_astro_lat') || localStorage.getItem('rdm_astro_lat');
        let savedLon = localStorage.getItem('vespereye_astro_lon') || localStorage.getItem('rdm_astro_lon');
        let savedAlt = localStorage.getItem('vespereye_astro_alt') || localStorage.getItem('rdm_astro_alt');
        
        if (savedLat && savedLon) {
            state.lat = parseFloat(savedLat);
            state.lon = parseFloat(savedLon);
            state.alt = parseFloat(savedAlt) || 0;
            
            dom.inputLat.value = state.lat.toFixed(4);
            dom.inputLon.value = state.lon.toFixed(4);
            dom.inputAlt.value = Math.round(state.alt);
            updateGPSDisplay(false, "Caricato da memoria");
        }
    } catch (e) {
        console.error(e);
    }
}

// Ricalcola tutto (Dashboard e Bussola)
function recalculate() {
    const activeDate = getActiveDate();
    const observer = new Astronomy.Observer(state.lat, state.lon, state.alt);
    const astroTime = Astronomy.MakeTime(activeDate);
    
    // Sincronizza la data di simulazione delle lune con la data attiva
    state.simulatedDate = new Date(activeDate);

    // 1. Calcola Alba e Tramonto del Sole per la data corrente
    try {
        const pad = (n) => String(n).padStart(2, '0');
        const formatTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
        const dateStart = new Date(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate(), 0, 0, 0);
        const startAstroTime = Astronomy.MakeTime(dateStart);
        
        let riseTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, startAstroTime, 1);
        let setTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, startAstroTime, 1);
        
        document.getElementById('sunRiseVal').innerText = riseTime ? formatTime(riseTime.date) : '--:--';
        document.getElementById('sunSetVal').innerText = setTime ? formatTime(setTime.date) : '--:--';
    } catch (e) {
        console.error("Errore Alba/Tramonto:", e);
    }

    // 2. Calcola lo stato della Luna
    try {
        const moon = Astronomy.Body.Moon;
        const ill = Astronomy.Illumination(moon, astroTime);
        // Calcola la frazione 6 ore dopo per determinare se cresce (Waxing) o cala (Waning)
        const timeLater = Astronomy.MakeTime(new Date(activeDate.getTime() + 6 * 3600 * 1000));
        const illLater = Astronomy.Illumination(moon, timeLater);
        const isWaxing = illLater.phase_fraction > ill.phase_fraction;
        
        const frac = ill.phase_fraction;
        let phaseName = 'Luna Nuova';
        if (frac > 0.98) phaseName = 'Luna Piena 🌕';
        else if (frac < 0.02) phaseName = 'Luna Nuova 🌑';
        else if (isWaxing) {
            if (frac < 0.48) phaseName = 'Luna Crescente 🌒';
            else if (frac < 0.52) phaseName = 'Primo Quarto 🌓';
            else phaseName = 'Gibbosa Crescente 🌔';
        } else {
            if (frac > 0.52) phaseName = 'Gibbosa Calante 🌖';
            else if (frac > 0.48) phaseName = 'Ultimo Quarto 🌗';
            else phaseName = 'Luna Calante 🌘';
        }
        
        document.getElementById('moonPhaseVal').innerText = phaseName;
        document.getElementById('moonIllumVal').innerText = `${(frac * 100).toFixed(1)}%`;
    } catch (e) {
        console.error("Errore Stato Luna:", e);
    }

    let cardsHtml = '';
    let compassNodesHtml = '';
    
    PLANETS.forEach(p => {
        // Calcola coordinate equatoriali e poi altazimutali
        const bodyEnum = Astronomy.Body[p.body];
        const equ = Astronomy.Equator(bodyEnum, astroTime, observer, true, true);
        const hor = Astronomy.Horizon(astroTime, observer, equ.ra, equ.dec, 'normal');
        
        const alt = hor.altitude;
        const az = hor.azimuth;
        const isVisible = alt > 0;
        
        // Formatta Azimut in direzione cardinale indicativa
        const cardDir = getCardinalDirection(az);
        
        // Verifica se è il pianeta selezionato per le lune
        const isSelected = p.id === state.selectedPlanet;
        const selectedClass = isSelected ? 'active-selection' : '';
        
        let extraTimesHtml = `
            <span>AR: ${formatRA(equ.ra)}</span>
            <span>Dec: ${equ.dec.toFixed(2)}°</span>
        `;
        
        // Calcola ed evidenzia l'elongazione solo per Mercurio
        if (p.id === 'Mercury') {
            try {
                const el = Astronomy.Elongation(Astronomy.Body.Mercury, astroTime);
                const elDir = el.visibility === 'evening' ? 'Est (Sera)' : 'Ovest (Mattina)';
                extraTimesHtml = `
                    <span style="grid-column: span 2; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem; margin-bottom: 0.25rem; color: var(--color-venus); font-weight: 500;">
                        Elongaz.: ${el.elongation.toFixed(1)}° ${elDir}
                    </span>
                    <span>AR: ${formatRA(equ.ra)}</span>
                    <span>Dec: ${equ.dec.toFixed(2)}°</span>
                `;
            } catch (e) {
                console.error("Errore Elongazione Mercurio:", e);
            }
        }
        
        cardsHtml += `
            <div class="planet-card ${selectedClass}" style="--planet-color: ${p.color}" onclick="selectPlanet('${p.id}')" role="button" tabindex="0">
                <div class="planet-header">
                    <div class="planet-info">
                        <div class="planet-dot" style="background-color: ${p.color}"></div>
                        <span class="planet-name">${p.name}</span>
                    </div>
                    <span class="visibility-badge ${isVisible ? 'visible' : 'invisible'}">
                        ${isVisible ? 'Visibile' : 'Non Visibile'}
                    </span>
                </div>
                
                <div class="planet-coords">
                    <div class="coord-box">
                        <span class="coord-label">Altezza</span>
                        <span class="coord-val">${alt.toFixed(2)}°</span>
                    </div>
                    <div class="coord-box">
                        <span class="coord-label">Azimut</span>
                        <span class="coord-val">${az.toFixed(1)}° (${cardDir})</span>
                    </div>
                </div>
                
                <div class="planet-times" style="${p.id === 'Mercury' ? 'display: grid; grid-template-columns: 1fr 1fr;' : ''}">
                    ${extraTimesHtml}
                </div>
            </div>
        `;
        
        // Posiziona il pianeta sulla Bussola Celeste (Bussola SVG)
        if (isVisible) {
            const r = 90 * (90 - alt) / 90;
            const angleRad = (az - 90) * Math.PI / 180;
            const x = 100 + r * Math.cos(angleRad);
            const y = 100 + r * Math.sin(angleRad);
            
            compassNodesHtml += `
                <circle cx="${x}" cy="${y}" r="5" fill="${p.color}" class="compass-planet-node" style="--planet-color: ${p.color}" onclick="selectPlanet('${p.id}')">
                    <title>${p.name} (Alt: ${alt.toFixed(1)}°, Az: ${az.toFixed(1)}°)</title>
                </circle>
                <text x="${x}" y="${y - 8}" fill="#fff" font-size="7" font-weight="600" text-anchor="middle">${p.name}</text>
            `;
        }
    });
    
    dom.planetsGrid.innerHTML = cardsHtml;
    dom.compassPlanetsGroup.innerHTML = compassNodesHtml;
    
    updateMoonsPanel();
    drawMoons();
    
    // 4. Calcola passaggi ISS
    if (!issTle) {
        fetchIssTle(calculateIssPasses);
    } else {
        calculateIssPasses();
    }
    
    // 5. Calcola visibilità Pianeti Nani e Asteroidi
    calculateDwarfs();
}

// Converte gradi di azimut in direzione cardinale breve
function getCardinalDirection(az) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(((az % 360) / 22.5)) % 16;
    return directions[index];
}

// Formatta Ascensione Retta da ore decimali a hh m s
function formatRA(raHours) {
    const h = Math.floor(raHours);
    const m = Math.floor((raHours - h) * 60);
    return `${h}h ${m}m`;
}

// Loop timer per aggiornamento Real-Time (ogni secondo)
function tick() {
    if (state.isRealTime) {
        recalculate();
    }
    setTimeout(tick, 1000);
}

// Selezione del pianeta per visualizzazione lune
window.selectPlanet = function(planetId) {
    if (planetId === 'Jupiter' || planetId === 'Saturn' || planetId === 'Uranus') {
        state.selectedPlanet = planetId;
        state.simulatedDate = new Date(getActiveDate());
        recalculate();
        resizeCanvas();
        dom.moonsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Nasconde il pannello lune se viene cliccato un pianeta che non ha lune supportate
        state.selectedPlanet = planetId;
        recalculate();
    }
};

// Mostra o nasconde il pannello lune in base alla selezione
function updateMoonsPanel() {
    if (state.selectedPlanet === 'Jupiter' || state.selectedPlanet === 'Saturn' || state.selectedPlanet === 'Uranus') {
        dom.moonsSection.style.display = 'grid';
        if (state.selectedPlanet === 'Jupiter') {
            dom.selectedPlanetTitle.innerHTML = `
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-jupiter)"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="6" y1="9" x2="18" y2="9"></line></svg>
                Satelliti Galileiani di Giove
            `;
        } else if (state.selectedPlanet === 'Saturn') {
            dom.selectedPlanetTitle.innerHTML = `
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-saturn)"><circle cx="12" cy="12" r="8"></circle><path d="M2 12h20M5 15h14M8 9h8"></path></svg>
                Satelliti Principali di Saturno
            `;
        } else if (state.selectedPlanet === 'Uranus') {
            dom.selectedPlanetTitle.innerHTML = `
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-uranus)"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v22M2 12h20"></path></svg>
                Satelliti Principali di Urano
            `;
        }
    } else {
        dom.moonsSection.style.display = 'none';
    }
}

// Ridimensionamento del canvas per adattarsi responsivamente
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = dom.moonsCanvas.getBoundingClientRect();
    dom.moonsCanvas.width = rect.width * dpr;
    dom.moonsCanvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    drawMoons();
}

// Disegna lune sul Canvas
function drawMoons() {
    if (state.selectedPlanet !== 'Jupiter' && state.selectedPlanet !== 'Saturn' && state.selectedPlanet !== 'Uranus') return;

    const w = dom.moonsCanvas.width / (window.devicePixelRatio || 1);
    const h = dom.moonsCanvas.height / (window.devicePixelRatio || 1);
    
    // Pulisci Canvas con gradiente cosmico scuro
    ctx.clearRect(0, 0, w, h);
    const bgGrad = ctx.createRadialGradient(w/2, h/2, 5, w/2, h/2, Math.max(w, h)/2);
    bgGrad.addColorStop(0, '#0a0d1a');
    bgGrad.addColorStop(1, '#020308');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Disegna stelle di sfondo statiche
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i < 20; i++) {
        // Stelle pseudo-casuali stabili usando i seni
        const sx = (Math.sin(i * 123.45) * 0.5 + 0.5) * w;
        const sy = (Math.cos(i * 678.90) * 0.5 + 0.5) * h;
        ctx.fillRect(sx, sy, 1.2, 1.2);
    }

    const centerX = w / 2;
    const centerY = h / 2;

    if (state.selectedPlanet === 'Jupiter') {
        renderJupiterSystem(centerX, centerY, w, h);
    } else if (state.selectedPlanet === 'Saturn') {
        renderSaturnSystem(centerX, centerY, w, h);
    } else if (state.selectedPlanet === 'Uranus') {
        renderUranusSystem(centerX, centerY, w, h);
    }
}

function renderJupiterSystem(cx, cy, w, h) {
    const astroTime = Astronomy.MakeTime(state.simulatedDate);
    const moonsData = Astronomy.JupiterMoons(astroTime);
    if (!moonsData) return;

    // Astronomy.JupiterMoons restituisce le coordinate relative a Giove in UA.
    const jupEquatorialRadiusAu = Astronomy.JUPITER_EQUATORIAL_RADIUS_KM / Astronomy.KM_PER_AU;

    // Calcoliamo la proiezione delle coordinate 3D J2000 (EQJ) sul piano tangente dell'osservatore (RA/Dec di Giove)
    // per ottenere la corretta visualizzazione angolare prospettica da Terra (Est celeste a sinistra, Ovest a destra).
    const observer = new Astronomy.Observer(state.lat, state.lon, state.alt);
    const equJup = Astronomy.Equator(Astronomy.Body.Jupiter, astroTime, observer, true, true);
    const raRad = equJup.ra * 15 * Math.PI / 180;
    
    // Vettore unitario orientato verso l'Est celeste nel piano perpendicolare alla linea di vista
    const ex = [-Math.sin(raRad), Math.cos(raRad), 0];
    const dotProduct = (vec, unit) => vec.x * unit[0] + vec.y * unit[1] + vec.z * unit[2];

    // Proiettiamo e convertiamo le coordinate 3D delle lune in Raggi di Giove (RJ) apparenti
    const moons = [
        { name: 'Io', x: dotProduct(moonsData.io, ex) / jupEquatorialRadiusAu, y: 0, z: moonsData.io.z / jupEquatorialRadiusAu },
        { name: 'Europa', x: dotProduct(moonsData.europa, ex) / jupEquatorialRadiusAu, y: 0, z: moonsData.europa.z / jupEquatorialRadiusAu },
        { name: 'Ganymede', x: dotProduct(moonsData.ganymede, ex) / jupEquatorialRadiusAu, y: 0, z: moonsData.ganymede.z / jupEquatorialRadiusAu },
        { name: 'Callisto', x: dotProduct(moonsData.callisto, ex) / jupEquatorialRadiusAu, y: 0, z: moonsData.callisto.z / jupEquatorialRadiusAu }
    ];

    // Raggio visuale di Giove sul canvas
    const jupRadius = Math.min(w, h) * 0.08; 

    // Regoliamo lo zoom scale per far rientrare agevolmente Callisto sul canvas (scale = jupRadius * 0.45)
    const scale = jupRadius * 0.45; 

    // 1. Disegna le linee delle orbite dei satelliti perfettamente orizzontali e dritte
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    
    moons.forEach(m => {
        let maxR = 6;
        if (m.name === 'Io') maxR = 5.9;
        else if (m.name === 'Europa') maxR = 9.4;
        else if (m.name === 'Ganymede') maxR = 15.0;
        else if (m.name === 'Callisto') maxR = 26.3;

        ctx.beginPath();
        ctx.ellipse(cx, cy, maxR * scale, maxR * scale * 0.05, 0, 0, 2 * Math.PI);
        ctx.stroke();
    });

    // 2. Calcola la rotazione di Giove (Sistema II per la Grande Macchia Rossa - GRS)
    const rotationAxis = Astronomy.RotationAxis(Astronomy.Body.Jupiter, astroTime);
    const centralLongitudeSysII = (rotationAxis.spin) % 360;
    
    let grsDiff = Math.abs(centralLongitudeSysII - 105);
    if (grsDiff > 180) grsDiff = 360 - grsDiff;
    const isGrsVisible = grsDiff < 85; 
    
    const grsXOffset = Math.sin((105 - centralLongitudeSysII) * Math.PI / 180);

    // 3. Disegna Giove (bande e pianeta dritti orizzontali)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, jupRadius, 0, 2 * Math.PI);
    ctx.clip();

    // Sfondo Giove (arancione sabbia)
    ctx.fillStyle = "#e2a96f";
    ctx.fillRect(cx - jupRadius, cy - jupRadius, jupRadius * 2, jupRadius * 2);

    // Bande rosse/marroni (allineate orizzontalmente)
    ctx.fillStyle = "#8a583a";
    ctx.fillRect(cx - jupRadius, cy - jupRadius * 0.5, jupRadius * 2, jupRadius * 0.15);
    ctx.fillRect(cx - jupRadius, cy - jupRadius * 0.1, jupRadius * 2, jupRadius * 0.08);
    ctx.fillRect(cx - jupRadius, cy + jupRadius * 0.25, jupRadius * 2, jupRadius * 0.18);
    ctx.fillRect(cx - jupRadius, cy + jupRadius * 0.55, jupRadius * 2, jupRadius * 0.08);

    // Disegna la Grande Macchia Rossa (allineata orizzontalmente nell'emisfero sud)
    if (isGrsVisible) {
        ctx.fillStyle = grsXOffset > 0 ? "#b43d22" : "rgba(180, 61, 34, 0.7)";
        ctx.beginPath();
        ctx.ellipse(cx + grsXOffset * jupRadius * 0.8, cy + jupRadius * 0.35, jupRadius * 0.22, jupRadius * 0.12, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.restore();

    // Glow esterno Giove
    const jupGlow = ctx.createRadialGradient(cx, cy, jupRadius * 0.9, cx, cy, jupRadius * 1.2);
    jupGlow.addColorStop(0, 'rgba(253, 186, 116, 0.25)');
    jupGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = jupGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, jupRadius * 1.2, 0, 2*Math.PI);
    ctx.fill();

    // 4. Disegna le Lune galileiane in linea retta orizzontale, ma inclina di 30 gradi solo la scritta dell'etichetta
    const moonColors = {
        'Io': '#fde047',      // Giallo zolfo
        'Europa': '#e2e8f0',  // Ghiaccio bianco
        'Ganymede': '#94a3b8',// Grigio roccioso
        'Callisto': '#64748b' // Grigio scuro
    };

    moons.forEach(m => {
        // Est è a sinistra sul canvas (coordinata x decrescente), Ovest è a destra
        const mx = cx - m.x * scale;
        const my = cy; // Perfettamente allineate orizzontalmente
        const mz = m.z;

        const mColor = moonColors[m.name] || '#fff';
        
        const isBehind = mz < 0 && (Math.hypot(m.x, 0) < 1.05);

        if (!isBehind) {
            // Disegna il pallino del satellite
            ctx.beginPath();
            ctx.arc(mx, my, 3.5, 0, 2 * Math.PI);
            ctx.fillStyle = mColor;
            ctx.fill();
            
            ctx.shadowColor = mColor;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.arc(mx, my, 1, 0, 2 * Math.PI);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.shadowBlur = 0; 

            // Scritta ruotata di 30 gradi: salviamo lo stato del contesto, trasliamo sulla coordinata della luna,
            // ruotiamo di -30 gradi ed effettuiamo la scrittura del testo a coordinate relative (0,0) per evitare sovrapposizioni.
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate(-30 * Math.PI / 180); // Inclinazione scritte a 30 gradi
            ctx.fillStyle = "rgba(255,255,255,0.85)";
            ctx.font = "500 10px " + varFontSans();
            ctx.fillText(m.name, 8, -4);
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(mx, my, 2.5, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
            ctx.fill();
        }
    });

    // 5. Calcola la Sequenza dei satelliti da Ovest ad Est (sinistra a destra sul canvas, cioè RA decrescente)
    // Ordiniamo le lune per coordinata X di proiezione decrescente (highest X = Est/Left, lowest X = Ovest/Right)
    const sortedMoons = [...moons].sort((a, b) => b.x - a.x);
    const sequenceStr = sortedMoons.map(m => m.name).join(' — ');

    // 6. Popola Legenda con la Sequenza e lo Stato GRS
    let legendHtml = `
        <div class="moon-legend-item" style="grid-column: span 2; background: rgba(147, 51, 234, 0.08); border-color: rgba(168, 85, 247, 0.3);">
            <div style="display: flex; flex-direction: column; width: 100%;">
                <span class="moon-legend-name" style="color: var(--color-venus); font-weight: 600; font-size: 0.85rem;">
                    🔴 Grande Macchia Rossa (GRS)
                </span>
                <span style="font-size: 0.8rem; color: #fff; margin-top: 2px;">
                    Stato: ${isGrsVisible ? `<strong>Visibile</strong> (Transito meridiano in corso)` : 'Non visibile (sulla faccia opposta)'}
                </span>
            </div>
        </div>
        <div class="moon-legend-item" style="grid-column: span 2; background: rgba(255, 255, 255, 0.02);">
            <div style="display: flex; flex-direction: column; width: 100%;">
                <span class="moon-legend-name" style="color: #67e8f9; font-weight: 600; font-size: 0.85rem;">
                    ↔️ Sequenza Sinistra ➔ Destra (Est ➔ Ovest)
                </span>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: #fff; margin-top: 4px; letter-spacing: 0.5px;">
                    ${sequenceStr}
                </span>
            </div>
        </div>
    `;

    moons.forEach(m => {
        const mColor = moonColors[m.name] || '#fff';
        const direction = m.x > 0 ? 'Est' : 'Ovest';
        legendHtml += `
            <div class="moon-legend-item">
                <span class="moon-legend-name">
                    <span class="moon-legend-dot" style="background-color: ${mColor}; box-shadow: 0 0 6px ${mColor}"></span>
                    ${mColorName(m.name)}
                </span>
                <span class="moon-legend-offset">${Math.abs(m.x).toFixed(1)} RJ (${direction})</span>
            </div>
        `;
    });

    dom.lunesLegend.innerHTML = legendHtml;
    showSimulationTime();
}

// Funzione ausiliaria per la precessione delle coordinate eclittiche da un'epoca a un'altra (Jean Meeus)
function precessEcliptic(lon, lat, epochFrom, epochTo) {
    const d = Math.PI / 180;
    const s = d / 3600;
    const T = (epochFrom - 2000) * 0.01;
    const horner = (x, ...coeffs) => {
        let res = 0;
        for (let i = coeffs.length - 1; i >= 0; i--) {
            res = res * x + coeffs[i];
        }
        return res;
    };
    const ηT = [47.0029 * s, -0.06603 * s, 0.000598 * s];
    const πT = [174.876384 * d, 3289.4789 * s, 0.60622 * s];
    const pT = [5029.0966 * s, 2.22226 * s, -0.000042 * s];
    
    const ηt = [47.0029 * s, -0.03302 * s, 0.000060 * s];
    const πt = [174.876384 * d, -869.8089 * s, 0.03536 * s];
    const pt = [5029.0966 * s, 1.11113 * s, -0.000006 * s];

    let ηCoeff = ηt;
    let πCoeff = πt;
    let pCoeff = pt;
    if (epochFrom !== 2000) {
        ηCoeff = [horner(T, ...ηT), -0.03302 * s + 0.000598 * s * T, 0.000060 * s];
        πCoeff = [horner(T, ...πT), -869.8089 * s - 0.50491 * s * T, 0.03536 * s];
        pCoeff = [horner(T, ...pT), 1.11113 * s - 0.000042 * s * T, -0.000006 * s];
    }
    const t = (epochTo - epochFrom) * 0.01;
    const π = horner(t, ...πCoeff);
    const p = horner(t, ...pCoeff) * t;
    const η = horner(t, ...ηCoeff) * t;

    const sη = Math.sin(η);
    const cη = Math.cos(η);
    const sβ = Math.sin(lat);
    const cβ = Math.cos(lat);
    const sd = Math.sin(π - lon);
    const cd = Math.cos(π - lon);

    const A = cη * cβ * sd - sη * sβ;
    const B = cβ * cd;
    const C = cη * sβ + sη * cβ * sd;

    const lonTo = p + π - Math.atan2(A, B);
    const latTo = Math.asin(C);
    return { lon: lonTo, lat: latTo };
}

// Algoritmo analitico di Jean Meeus per il calcolo delle coordinate tridimensionali
// delle lune di Saturno in raggi equatoriali di Saturno.
function positionsMeeusSaturn(jde, elonDeg, elatDeg, distAu) {
    const d = Math.PI / 180;
    const λ0 = elonDeg * d;
    const β0 = elatDeg * d;
    
    // Precessione coordinate all'epoca B1950.0 (richiesta dalle formule dei satelliti)
    const epoch = 2000.0 + (jde - 2451545.0) / 365.25;
    const prec = precessEcliptic(λ0, β0, epoch, 1950.0);
    const λ0_prec = prec.lon;
    const β0_prec = prec.lat;
    
    // Correzione per il tempo di viaggio della luce (light travel time)
    const jde_corr = jde - (distAu / 173.1446);
    
    const t1 = jde_corr - 2411093;
    const t2 = t1 / 365.25;
    const t3 = (jde_corr - 2433282.423) / 365.25 + 1950;
    const t4 = jde_corr - 2411368;
    const t5 = t4 / 365.25;
    const t6 = jde_corr - 2415020;
    const t7 = t6 / 36525;
    const t8 = t6 / 365.25;
    const t9 = (jde_corr - 2442000.5) / 365.25;
    const t10 = jde_corr - 2409786;
    const t11 = t10 / 36525;

    const W0 = 5.095 * d * (t3 - 1866.39);
    const W1 = 74.4 * d + 32.39 * d * t2;
    const W2 = 134.3 * d + 92.62 * d * t2;
    const W3 = 42 * d - 0.5118 * d * t5;
    const W4 = 276.59 * d + 0.5118 * d * t5;
    const W5 = 267.2635 * d + 1222.1136 * d * t7;
    const W6 = 175.4762 * d + 1221.5515 * d * t7;
    const W7 = 2.4891 * d + 0.002435 * d * t7;
    const W8 = 113.35 * d - 0.2597 * d * t7;

    const sW0 = Math.sin(W0);
    const s3W0 = Math.sin(3 * W0);
    const s5W0 = Math.sin(5 * W0);
    const sW1 = Math.sin(W1);
    const sW2 = Math.sin(W2);
    const sW3 = Math.sin(W3);
    const cW3 = Math.cos(W3);
    const sW4 = Math.sin(W4);
    const cW4 = Math.cos(W4);
    const sW7 = Math.sin(W7);
    const cW7 = Math.cos(W7);

    const c1 = Math.cos(28.0817 * d);
    const s1 = Math.sin(28.0817 * d);
    const c2 = Math.cos(168.8112 * d);
    const s2 = Math.sin(168.8112 * d);
    const e1 = 0.05589 - 0.000346 * t7;

    const subr = (λ_prime, p, e, a, Ω, i) => {
        const M = λ_prime - p;
        const e2 = e * e;
        const e3 = e2 * e;
        const e4 = e2 * e2;
        const e5 = e3 * e2;
        const C = (2 * e - 0.25 * e3 + 0.0520833333 * e5) * Math.sin(M) +
            (1.25 * e2 - 0.458333333 * e4) * Math.sin(2 * M) +
            (1.083333333 * e3 - 0.671875 * e5) * Math.sin(3 * M) +
            1.072917 * e4 * Math.sin(4 * M) + 1.142708 * e5 * Math.sin(5 * M);
        const r_val = a * (1 - e2) / (1 + e * Math.cos(M + C));
        const g = Ω - 168.8112 * d;
        const sg = Math.sin(g);
        const cg = Math.cos(g);
        const si = Math.sin(i);
        const ci = Math.cos(i);
        const a1 = si * sg;
        const a2 = c1 * si * cg - s1 * ci;
        const γ = Math.asin(Math.hypot(a1, a2));
        const u = Math.atan2(a1, a2);
        const Ω_val = 168.8112 * d + u;
        const h = c1 * si - s1 * ci * cg;
        const ψ = Math.atan2(s1 * sg, h);
        const λ_val = λ_prime + C + u - g - ψ;
        return { λ: λ_val, r: r_val, γ: γ, Ω: Ω_val };
    };

    const s4 = [null];
    
    // Mimas
    s4[1] = (() => {
        const L = 127.64 * d + 381.994497 * d * t1 - 43.57 * d * sW0 - 0.72 * d * s3W0 - 0.02144 * d * s5W0;
        const p = 106.1 * d + 365.549 * d * t2;
        const M = L - p;
        const C = 2.18287 * d * Math.sin(M) + 0.025988 * d * Math.sin(2 * M) + 0.00043 * d * Math.sin(3 * M);
        return { λ: L + C, r: 3.06879 / (1 + 0.01905 * Math.cos(M + C)), γ: 1.563 * d, Ω: 54.5 * d - 365.072 * d * t2 };
    })();

    // Enceladus
    s4[2] = (() => {
        const L = 200.317 * d + 262.7319002 * d * t1 + 0.25667 * d * sW1 + 0.20883 * d * sW2;
        const p = 309.107 * d + 123.44121 * d * t2;
        const M = L - p;
        const C = 0.55577 * d * Math.sin(M) + 0.00168 * d * Math.sin(2 * M);
        return { λ: L + C, r: 3.94118 / (1 + 0.00485 * Math.cos(M + C)), γ: 0.0262 * d, Ω: 348 * d - 151.95 * d * t2 };
    })();

    // Tethys
    s4[3] = {
        λ: 285.306 * d + 190.69791226 * d * t1 + 2.063 * d * sW0 + 0.03409 * d * s3W0 + 0.001015 * d * s5W0,
        r: 4.880998,
        γ: 1.0976 * d,
        Ω: 111.33 * d - 72.2441 * d * t2
    };

    // Dione
    s4[4] = (() => {
        const L = 254.712 * d + 131.53493193 * d * t1 - 0.0215 * d * sW1 - 0.01733 * d * sW2;
        const p = 174.8 * d + 30.82 * d * t2;
        const M = L - p;
        const C = 0.24717 * d * Math.sin(M) + 0.00033 * d * Math.sin(2 * M);
        return { λ: L + C, r: 6.24871 / (1 + 0.002157 * Math.cos(M + C)), γ: 0.0139 * d, Ω: 232 * d - 30.27 * d * t2 };
    })();

    // Rhea
    s4[5] = (() => {
        const p_prime = 342.7 * d + 10.057 * d * t2;
        const sp_prime = Math.sin(p_prime);
        const cp_prime = Math.cos(p_prime);
        const a1 = 0.000265 * sp_prime + 0.001 * sW4;
        const a2 = 0.000265 * cp_prime + 0.001 * cW4;
        const e = Math.hypot(a1, a2);
        const p = Math.atan2(a1, a2);
        const N = 345 * d - 10.057 * d * t2;
        const sN = Math.sin(N);
        const cN = Math.cos(N);
        const λ_prime = 359.244 * d + 79.6900472 * d * t1 + 0.086754 * d * sN;
        const i = 28.0362 * d + 0.346898 * d * cN + 0.0193 * d * cW3;
        const Ω = 168.8034 * d + 0.736936 * d * sN + 0.041 * d * sW3;
        const a = 8.725924;
        return subr(λ_prime, p, e, a, Ω, i);
    })();

    // Titan
    s4[6] = (() => {
        const L = 261.1582 * d + 22.57697855 * d * t4 + 0.074025 * d * sW3;
        const i_prime = 27.45141 * d + 0.295999 * d * cW3;
        const Ω_prime = 168.66925 * d + 0.628808 * d * sW3;
        const si_prime = Math.sin(i_prime);
        const ci_prime = Math.cos(i_prime);
        const sΩ_primeW8 = Math.sin(Ω_prime - W8);
        const cΩ_primeW8 = Math.cos(Ω_prime - W8);
        const a1 = sW7 * sΩ_primeW8;
        const a2 = cW7 * si_prime - sW7 * ci_prime * cΩ_primeW8;
        const g0 = 102.8623 * d;
        const ψ = Math.atan2(a1, a2);
        const s = Math.hypot(a1, a2);
        let g = W4 - Ω_prime - ψ;
        let ϖ = 0;
        const s2g0 = Math.sin(2 * g0);
        const c2g0 = Math.cos(2 * g0);
        const f = () => {
            ϖ = W4 + 0.37515 * d * (Math.sin(2 * g) - s2g0);
            g = ϖ - Ω_prime - ψ;
        };
        f(); f(); f();
        const e_prime = 0.029092 + 0.00019048 * (Math.cos(2 * g) - c2g0);
        const qq = 2 * (W5 - ϖ);
        const b1 = si_prime * sΩ_primeW8;
        const b2 = cW7 * si_prime * cΩ_primeW8 - sW7 * ci_prime;
        const θ = Math.atan2(b1, b2) + W8;
        const sq = Math.sin(qq);
        const cq = Math.cos(qq);
        const e = e_prime + 0.002778797 * e_prime * cq;
        const p = ϖ + 0.159215 * d * sq;
        const u = 2 * W5 - 2 * θ + ψ;
        const su = Math.sin(u);
        const cu = Math.cos(u);
        const h = 0.9375 * e_prime * e_prime * sq + 0.1875 * s * s * Math.sin(2 * (W5 - θ));
        const λ_prime = L - 0.254744 * d * (e1 * Math.sin(W6) + 0.75 * e1 * e1 * Math.sin(2 * W6) + h);
        const i = i_prime + 0.031843 * d * s * cu;
        const Ω = Ω_prime + 0.031843 * d * s * su / si_prime;
        const a = 20.216193;
        return subr(λ_prime, p, e, a, Ω, i);
    })();

    s4[7] = null; // Hyperion saltato

    // Iapetus
    s4[8] = (() => {
        const L = 261.1582 * d + 22.57697855 * d * t4;
        const ϖ_prime = 91.796 * d + 0.562 * d * t7;
        const ψ = 4.367 * d - 0.195 * d * t7;
        const θ = 146.819 * d - 3.198 * d * t7;
        const φ = 60.47 * d + 1.521 * d * t7;
        const Φ = 205.055 * d - 2.091 * d * t7;
        const e_prime = 0.028298 + 0.001156 * t11;
        const ϖ0 = 352.91 * d + 11.71 * d * t11;
        const μ = 76.3852 * d + 4.53795125 * d * t10;
        const horner = (x, ...coeffs) => {
            let res = 0;
            for (let i = coeffs.length - 1; i >= 0; i--) {
                res = res * x + coeffs[i];
            }
            return res;
        };
        const i_prime = horner(t11, 18.4602 * d, -0.9518 * d, -0.072 * d, 0.0054 * d);
        const Ω_prime = horner(t11, 143.198 * d, -3.919 * d, 0.116 * d, 0.008 * d);
        const l = μ - ϖ0;
        const g = ϖ0 - Ω_prime - ψ;
        const g1 = ϖ0 - Ω_prime - φ;
        const ls = W5 - ϖ_prime;
        const gs = ϖ_prime - θ;
        const lT = L - W4;
        const gT = W4 - Φ;
        const u1 = 2 * (l + g - ls - gs);
        const u2 = l + g1 - lT - gT;
        const u3 = l + 2 * (g - ls - gs);
        const u4 = lT + gT - g1;
        const u5 = 2 * (ls + gs);
        
        const cg1gT = Math.cos(g1 - gT);
        const cu52g = Math.cos(u5 - 2 * g);
        const cu5ψ = Math.cos(u5 + ψ);
        const su5ψ = Math.sin(u5 + ψ);
        const cu2φ = Math.cos(u2 + φ);
        const s5 = Math.sin(l + g1 + lT + gT + φ);
        const c5 = Math.cos(l + g1 + lT + gT + φ);
        
        const a = 58.935028 + 0.004638 * Math.cos(u1) + 0.058222 * Math.cos(u2);
        const e = e_prime - 0.0014097 * cg1gT + 0.0003733 * cu52g + 0.000118 * Math.cos(u3) + 0.0002408 * Math.cos(l) + 0.0002849 * Math.cos(l + u2) + 0.000619 * Math.cos(u4);
        const w = 0.08077 * d * Math.sin(g1 - gT) + 0.02139 * d * Math.sin(u5 - 2 * g) - 0.00676 * d * Math.sin(u3) + 0.0138 * d * Math.sin(l) + 0.01632 * d * Math.sin(l + u2) + 0.03547 * d * Math.sin(u4);
        const p = ϖ0 + w / e_prime;
        const λ_prime = μ - 0.04299 * d * Math.sin(u2) - 0.00789 * d * Math.sin(u1) - 0.06312 * d * Math.sin(ls) - 0.00295 * d * Math.sin(2 * ls) - 0.02231 * d * Math.sin(u5) + 0.0065 * d * Math.sin(u5 + ψ);
        const i = i_prime + 0.04204 * d * cu5ψ + 0.00235 * d * c5 + 0.0036 * d * cu2φ;
        const w_prime = 0.04204 * d * su5ψ + 0.00235 * d * s5 + 0.00358 * d * Math.sin(u2 + φ);
        const Ω = Ω_prime + w_prime / Math.sin(i_prime);
        return subr(λ_prime, p, e, a, Ω, i);
    })();

    const X = new Array(9).fill(0);
    const Y = new Array(9).fill(0);
    const Z = new Array(9).fill(0);
    
    for (let j = 1; j <= 8; j++) {
        if (j === 7) continue;
        const u = s4[j].λ - s4[j].Ω;
        const w = s4[j].Ω - 168.8112 * d;
        const su = Math.sin(u);
        const cu = Math.cos(u);
        const sw = Math.sin(w);
        const cw = Math.cos(w);
        const sγ = Math.sin(s4[j].γ);
        const cγ = Math.cos(s4[j].γ);
        const r = s4[j].r;
        X[j] = r * (cu * cw - su * cγ * sw);
        Y[j] = r * (su * cw * cγ + cu * sw);
        Z[j] = r * su * sγ;
    }
    
    Z[0] = 1;
    
    const sλ0 = Math.sin(λ0_prec);
    const cλ0 = Math.cos(λ0_prec);
    const sβ0 = Math.sin(β0_prec);
    const cβ0 = Math.cos(β0_prec);
    
    const A = new Array(9).fill(0);
    const B = new Array(9).fill(0);
    const C = new Array(9).fill(0);
    
    for (let j = 0; j <= 8; j++) {
        if (j === 7) continue;
        let a = X[j];
        let b = c1 * Y[j] - s1 * Z[j];
        const c = s1 * Y[j] + c1 * Z[j];
        const a0 = c2 * a - s2 * b;
        b = s2 * a + c2 * b;
        a = a0;

        A[j] = a * sλ0 - b * cλ0;
        b = a * cλ0 + b * sλ0;

        B[j] = b * cβ0 + c * sβ0;
        C[j] = c * cβ0 - b * sβ0;
    }
    
    const k = [0, 20947, 23715, 26382, 29876, 35313, 53800, 59222, 91820];
    const pos = {};
    const D = Math.atan2(A[0], C[0]);
    const sD = Math.sin(D);
    const cD = Math.cos(D);
    
    const names = [null, 'Mimas', 'Enceladus', 'Tethys', 'Dione', 'Rhea', 'Titan', null, 'Iapetus'];
    for (let j = 1; j <= 8; j++) {
        if (j === 7) continue;
        let x_out = A[j] * cD - C[j] * sD;
        let y_out = A[j] * sD + C[j] * cD;
        let z_out = B[j];
        
        const d_ratio = x_out / s4[j].r;
        x_out += Math.abs(z_out) / k[j] * Math.sqrt(1 - d_ratio * d_ratio);
        const W = distAu / (distAu + z_out / 2475);
        pos[names[j]] = { x: x_out * W, y: y_out * W, z: z_out };
    }
    return pos;
}

// Disegna
function renderSaturnSystem(cx, cy, w, h) {
    const astroTime = Astronomy.MakeTime(state.simulatedDate);
    const observer = new Astronomy.Observer(state.lat, state.lon, state.alt);
    
    // Raggio del corpo di Saturno sul canvas
    const satRadius = Math.min(w, h) * 0.06;
    // Scala per i satelliti: regolata per far stare Titan (20 RS) perfettamente sul canvas
    const scale = satRadius * 0.55;

    // Recupera le coordinate eclittiche e la distanza geocentrica reali di Saturno tramite Astronomy Engine
    const vec = Astronomy.GeoVector(Astronomy.Body.Saturn, astroTime, true);
    const ecl = Astronomy.Ecliptic(vec);
    const distAu = Math.hypot(vec.x, vec.y, vec.z);

    // Calcolo inclinazione dinamica degli anelli (ring_tilt) da Astronomy Engine
    const satIllum = Astronomy.Illumination(Astronomy.Body.Saturn, astroTime);
    const ringTiltRad = satIllum.ring_tilt * Math.PI / 180;
    const tiltFactor = Math.abs(Math.sin(ringTiltRad));

    // Calcola le lune con l'algoritmo di Meeus
    const jde = astroTime.tt + 2451545.0;
    const meeusPos = positionsMeeusSaturn(jde, ecl.elon, ecl.elat, distAu);

    const satMoons = [
        { name: 'Mimas', color: '#cbd5e1', size: 2.2 },
        { name: 'Enceladus', color: '#38bdf8', size: 2.5 },
        { name: 'Tethys', color: '#94a3b8', size: 2.5 },
        { name: 'Dione', color: '#cbd5e1', size: 2.8 },
        { name: 'Rhea', color: '#f1f5f9', size: 3.0 },
        { name: 'Titan', color: '#f59e0b', size: 5.0 },
        { name: 'Iapetus', color: '#a1a1aa', size: 2.8 }
    ];

    // 1. Disegna le orbite delle lune allineate orizzontalmente coerenti con il tilt degli anelli
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 0.75;
    
    // Semiasse maggiore in raggi di Saturno
    const moonRadii = {
        'Mimas': 3.07,
        'Enceladus': 3.95,
        'Tethys': 4.88,
        'Dione': 6.26,
        'Rhea': 8.74,
        'Titan': 20.27,
        'Iapetus': 59.03
    };

    satMoons.forEach(m => {
        const radius = moonRadii[m.name];
        ctx.beginPath();
        // Le orbite di Meeus viste di taglio si proiettano come ellissi orizzontali
        ctx.ellipse(cx, cy, radius * scale, radius * scale * tiltFactor, 0, 0, 2 * Math.PI);
        ctx.stroke();
    });

    // 2. Disegna gli Anelli Posteriori (dietro il pianeta): mascheriamo per la parte superiore (Y < 0)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.rect(-satRadius * 4, -satRadius * 4, satRadius * 8, satRadius * 4);
    ctx.clip();
    drawSaturnRings(0, 0, satRadius, 0, true, tiltFactor);
    ctx.restore();

    // 3. Disegna il pianeta Saturno (sferoide oblato orizzontale)
    ctx.save();
    ctx.beginPath();
    // Saturno è visibilmente schiacciato ai poli (1.12 di raggio equatoriale e 0.95 di raggio polare)
    ctx.ellipse(cx, cy, satRadius * 1.12, satRadius * 0.95, 0, 0, 2 * Math.PI);
    ctx.clip();

    ctx.translate(cx, cy);
    // Sfondo Saturno
    ctx.fillStyle = "#e2cfa7";
    ctx.fillRect(-satRadius * 2, -satRadius * 2, satRadius * 4, satRadius * 4);

    // Bande atmosferiche
    ctx.fillStyle = "#c2ab7e";
    ctx.fillRect(-satRadius * 2, -satRadius * 0.2, satRadius * 4, satRadius * 0.1);
    ctx.fillRect(-satRadius * 2, +satRadius * 0.1, satRadius * 4, satRadius * 0.15);
    ctx.restore();

    // 4. Disegna gli Anelli Anteriori (davanti al pianeta): mascheriamo per la parte inferiore (Y > 0)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.rect(-satRadius * 4, 0, satRadius * 8, satRadius * 4);
    ctx.clip();
    drawSaturnRings(0, 0, satRadius, 0, false, tiltFactor);
    ctx.restore();

    // 5. Proietta e disegna le lune
    const projectedMoons = satMoons.map(m => {
        const pos = meeusPos[m.name];
        return {
            name: m.name,
            x: pos.x,
            y: pos.y,
            z: pos.z,
            color: m.color,
            size: m.size
        };
    });

    projectedMoons.forEach(m => {
        const mx = cx + m.x * scale;
        const my = cy - m.y * scale;
        
        // Verifica di occultazione usando lo sferoide oblato di Saturno
        // Se la luna è dietro (z < 0) e all'interno dell'ellisse del corpo di Saturno
        const isBehind = m.z < 0 && (m.x * m.x + (m.y * m.y) / 0.81 < 1.0);

        if (!isBehind) {
            ctx.beginPath();
            ctx.arc(mx, my, m.size, 0, 2 * Math.PI);
            ctx.fillStyle = m.color;
            ctx.fill();

            // Effetto glow per Titano
            if (m.name === 'Titan') {
                ctx.shadowColor = m.color;
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.arc(mx, my, m.size * 0.5, 0, 2 * Math.PI);
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // Etichette di identificazione per tutte le lune, ruotate a -20 gradi
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate(-20 * Math.PI / 180);
            ctx.fillStyle = "rgba(255,255,255,0.85)";
            ctx.font = "500 9px " + varFontSans();
            ctx.fillText(m.name, 6, -2);
            ctx.restore();
        } else {
            // Eclissata
            ctx.beginPath();
            ctx.arc(mx, my, m.size * 0.5, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
            ctx.fill();
        }
    });

    // Ordiniamo le lune per Est-Ovest per la sequenza da sinistra a destra (Est = coordinate m.x crescenti)
    const sortedMoons = [...projectedMoons].sort((a, b) => a.x - b.x);
    const sequenceStr = sortedMoons.map(m => m.name).join(' — ');

    let legendHtml = `
        <div class="moon-legend-item" style="grid-column: span 2; background: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.05);">
            <div style="display: flex; flex-direction: column; width: 100%;">
                <span class="moon-legend-name" style="color: #f59e0b; font-weight: 600; font-size: 0.85rem;">
                    🪐 Angolo e Apertura degli Anelli
                </span>
                <span style="font-size: 0.8rem; color: #fff; margin-top: 2px;">
                    Inclinazione anelli: <strong>${(satIllum.ring_tilt).toFixed(2)}°</strong> (Polo Nord rivolto a Terra)
                </span>
            </div>
        </div>
        <div class="moon-legend-item" style="grid-column: span 2; background: rgba(255, 255, 255, 0.02);">
            <div style="display: flex; flex-direction: column; width: 100%;">
                <span class="moon-legend-name" style="color: #67e8f9; font-weight: 600; font-size: 0.85rem;">
                    ↔️ Sequenza Sinistra ➔ Destra (Est ➔ Ovest)
                </span>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: #fff; margin-top: 4px; letter-spacing: 0.5px;">
                    ${sequenceStr}
                </span>
            </div>
        </div>
    `;

    // Popoliamo la legenda con i dettagli orbitali per le lune principali
    projectedMoons.forEach(m => {
        if (['Enceladus', 'Tethys', 'Dione', 'Rhea', 'Titan'].includes(m.name)) {
            const direction = m.x > 0 ? 'Ovest' : 'Est';
            legendHtml += `
                <div class="moon-legend-item">
                    <span class="moon-legend-name">
                        <span class="moon-legend-dot" style="background-color: ${m.color}; box-shadow: 0 0 6px ${m.color}"></span>
                        ${m.name}
                    </span>
                    <span class="moon-legend-offset">${Math.abs(m.x).toFixed(1)} RS (${direction})</span>
                </div>
            `;
        }
    });

    dom.lunesLegend.innerHTML = legendHtml;
    showSimulationTime();
}

// Disegna Urano con simulazione analitica delle sue lune verticali
function renderUranusSystem(cx, cy, w, h) {
    const astroTime = Astronomy.MakeTime(state.simulatedDate);
    const observer = new Astronomy.Observer(state.lat, state.lon, state.alt);
    
    // Raggio di Urano sul canvas
    const uranusRadius = Math.min(w, h) * 0.055;
    const scale = uranusRadius * 0.25;

    // Recupera la rotazione e la posizione geocentrica di Urano
    let rot, satIllum;
    try {
        rot = Astronomy.RotationAxis(Astronomy.Body.Uranus, astroTime);
        satIllum = Astronomy.Illumination(Astronomy.Body.Uranus, astroTime);
    } catch (e) {
        console.error("Errore nel recuperare i dati di Urano:", e);
        return;
    }

    const ux = satIllum.gc.x;
    const uy = satIllum.gc.y;
    const uz = satIllum.gc.z;
    const dist = Math.hypot(ux, uy, uz);

    // Vettore unitario Line of Sight (dall'osservatore al pianeta)
    const los = [ux / dist, uy / dist, uz / dist];

    // Celeste Est (sinistra sul cielo / canvas)
    const est = [-los[1], los[0], 0];
    const estLen = Math.hypot(est[0], est[1], est[2]);
    const eEast = [est[0] / estLen, est[1] / estLen, 0];

    // Celeste Nord (alto sul cielo / canvas)
    const eNorth = [
        los[1] * eEast[2] - los[2] * eEast[1],
        los[2] * eEast[0] - los[0] * eEast[2],
        los[0] * eEast[1] - los[1] * eEast[0]
    ];

    // Vettore polo Nord di Urano (J2000 EQJ)
    const np = [rot.north.x, rot.north.y, rot.north.z];

    // Ascendente del piano equatoriale di Urano su equatore terrestre J2000
    const node = [-np[1], np[0], 0];
    const nodeLen = Math.hypot(node[0], node[1], node[2]);
    const uNode = [node[0] / nodeLen, node[1] / nodeLen, 0];

    // Vettore perpendicolare nel piano equatoriale di Urano
    const vNode = [
        np[1] * uNode[2] - np[2] * uNode[1],
        np[2] * uNode[0] - np[0] * uNode[2],
        np[0] * uNode[1] - np[1] * uNode[0]
    ];

    // Configurazione lune di Urano (semiasse maggiore in raggi di Urano RU, periodo in giorni terrestri,
    // angolo orbitale iniziale calibrato su JPL Horizons il 2026-05-31 07:00 UTC)
    const uranusMoons = [
        { name: 'Miranda', radius: 5.08, period: 1.413479, theta0: 294.35, color: '#94a3b8', size: 2.2 },
        { name: 'Ariel', radius: 7.46, period: 2.520379, theta0: 168.00, color: '#cbd5e1', size: 2.5 },
        { name: 'Umbriel', radius: 10.42, period: 4.144177, theta0: 12.50, color: '#78716c', size: 2.5 },
        { name: 'Titania', radius: 17.07, period: 8.705872, theta0: 234.50, color: '#e2e8f0', size: 3.0 },
        { name: 'Oberon', radius: 22.84, period: 13.463239, theta0: 0.35, color: '#cbd5e1', size: 2.8 }
    ];

    // Tempo di calibrazione di riferimento: 2026-05-31 07:00:00 UTC
    const t0 = new Date('2026-05-31T07:00:00Z').getTime();
    const simTimeMs = state.simulatedDate.getTime();
    const dtDays = (simTimeMs - t0) / (24 * 3600 * 1000);

    const projectedMoons = uranusMoons.map(m => {
        const thetaRad = (m.theta0 + (360.0 / m.period) * dtDays) * Math.PI / 180;
        
        // Posizione 3D relativa a Urano nel piano equatoriale (RU)
        const xOrb = m.radius * Math.cos(thetaRad);
        const yOrb = m.radius * Math.sin(thetaRad);
        
        const pos3D = [
            xOrb * uNode[0] + yOrb * vNode[0],
            xOrb * uNode[1] + yOrb * vNode[1],
            xOrb * uNode[2] + yOrb * vNode[2]
        ];

        // Coordinate apparenti sul piano del cielo:
        // xApp è positiva verso Ovest (ovvero a destra sul canvas)
        const xApp = -(pos3D[0] * eEast[0] + pos3D[1] * eEast[1] + pos3D[2] * eEast[2]);
        // yApp è positiva verso Nord (ovvero in alto sul canvas)
        const yApp = pos3D[0] * eNorth[0] + pos3D[1] * eNorth[1] + pos3D[2] * eNorth[2];
        const zApp = pos3D[0] * los[0] + pos3D[1] * los[1] + pos3D[2] * los[2];

        return {
            name: m.name,
            x: xApp,
            y: yApp,
            z: zApp,
            radius: m.radius,
            color: m.color,
            size: m.size
        };
    });

    // 1. Disegna le orbite proiettate in base alla vera geometria 3D
    ctx.strokeStyle = "rgba(103, 232, 249, 0.04)";
    ctx.lineWidth = 0.75;
    
    projectedMoons.forEach(m => {
        ctx.beginPath();
        // Disegna l'orbita tracciando l'ellisse proiettata passo-passo a 360° per precisione geometrica
        for (let deg = 0; deg <= 360; deg += 2) {
            const rad = deg * Math.PI / 180;
            const px = m.radius * Math.cos(rad);
            const py = m.radius * Math.sin(rad);
            const p3D = [
                px * uNode[0] + py * vNode[0],
                px * uNode[1] + py * vNode[1],
                px * uNode[2] + py * vNode[2]
            ];
            const pxApp = -(p3D[0] * eEast[0] + p3D[1] * eEast[1] + p3D[2] * eEast[2]);
            const pyApp = p3D[0] * eNorth[0] + p3D[1] * eNorth[1] + p3D[2] * eNorth[2];
            
            const mx = cx + pxApp * scale;
            const my = cy - pyApp * scale;
            
            if (deg === 0) ctx.moveTo(mx, my);
            else ctx.lineTo(mx, my);
        }
        ctx.stroke();
    });

    // 2. Disegna il corpo di Urano (azzurro/verde)
    const uranusGlow = ctx.createRadialGradient(cx, cy, uranusRadius * 0.5, cx, cy, uranusRadius * 1.3);
    uranusGlow.addColorStop(0, '#a5f3fc');
    uranusGlow.addColorStop(0.6, '#0891b2');
    uranusGlow.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = uranusGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, uranusRadius * 1.3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#67e8f9";
    ctx.beginPath();
    ctx.arc(cx, cy, uranusRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Sottile anello verticale caratteristico di Urano (Anello Epsilon proiettato in 3D)
    ctx.strokeStyle = "rgba(103, 232, 249, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let deg = 0; deg <= 360; deg += 2) {
        const rad = deg * Math.PI / 180;
        const ringRad = 2.0; // raggio dell'anello in raggi di Urano
        const px = ringRad * Math.cos(rad);
        const py = ringRad * Math.sin(rad);
        const p3D = [
            px * uNode[0] + py * vNode[0],
            px * uNode[1] + py * vNode[1],
            px * uNode[2] + py * vNode[2]
        ];
        const pxApp = -(p3D[0] * eEast[0] + p3D[1] * eEast[1] + p3D[2] * eEast[2]);
        const pyApp = p3D[0] * eNorth[0] + p3D[1] * eNorth[1] + p3D[2] * eNorth[2];
        const mx = cx + pxApp * scale;
        const my = cy - pyApp * scale;
        
        if (deg === 0) ctx.moveTo(mx, my);
        else ctx.lineTo(mx, my);
    }
    ctx.stroke();

    // 3. Disegna le lune
    projectedMoons.forEach(m => {
        const mx = cx + m.x * scale;
        const my = cy - m.y * scale;

        // Occultazione dietro il pianeta (z < 0 e dentro il raggio fisico di Urano)
        const isBehind = m.z < 0 && (m.x * m.x + m.y * m.y < 1.0);

        if (!isBehind) {
            ctx.beginPath();
            ctx.arc(mx, my, m.size, 0, 2 * Math.PI);
            ctx.fillStyle = m.color;
            ctx.fill();

            // Glow sui satelliti maggiori (Titania e Oberon)
            if (m.name === 'Titania' || m.name === 'Oberon') {
                ctx.shadowColor = m.color;
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.arc(mx, my, m.size * 0.5, 0, 2 * Math.PI);
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // Etichetta testuale
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate(-20 * Math.PI / 180);
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.font = "500 9px " + varFontSans();
            ctx.fillText(m.name, 6, -2);
            ctx.restore();
        } else {
            // Eclissata
            ctx.beginPath();
            ctx.arc(mx, my, m.size * 0.5, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
            ctx.fill();
        }
    });

    // Ordinamento da sinistra a destra (Est-Ovest) per la legenda
    const sortedMoons = [...projectedMoons].sort((a, b) => a.x - b.x);
    const sequenceStr = sortedMoons.map(m => m.name).join(' — ');

    // 4. Popola la legenda
    let legendHtml = `
        <div class="moon-legend-item" style="grid-column: span 2; background: rgba(103, 232, 249, 0.05); border-color: rgba(103, 232, 249, 0.15);">
            <div style="display: flex; flex-direction: column; width: 100%;">
                <span class="moon-legend-name" style="color: #67e8f9; font-weight: 600; font-size: 0.85rem;">
                    🌀 Visualizzazione delle Orbite Circolari
                </span>
                <span style="font-size: 0.8rem; color: #fff; margin-top: 2px;">
                    Inclinazione polare: <strong>${Math.abs(rot.dec).toFixed(1)}°</strong> (Sistema aperto, orbite quasi circolari da Terra)
                </span>
            </div>
        </div>
        <div class="moon-legend-item" style="grid-column: span 2; background: rgba(255, 255, 255, 0.02);">
            <div style="display: flex; flex-direction: column; width: 100%;">
                <span class="moon-legend-name" style="color: #67e8f9; font-weight: 600; font-size: 0.85rem;">
                    ↔️ Sequenza Sinistra ➔ Destra (Est ➔ Ovest)
                </span>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: #fff; margin-top: 4px; letter-spacing: 0.5px;">
                    ${sequenceStr}
                </span>
            </div>
        </div>
    `;

    projectedMoons.forEach(m => {
        const direction = m.x > 0 ? 'Ovest' : 'Est';
        legendHtml += `
            <div class="moon-legend-item">
                <span class="moon-legend-name">
                    <span class="moon-legend-dot" style="background-color: ${m.color}; box-shadow: 0 0 6px ${m.color}"></span>
                    ${m.name}
                </span>
                <span class="moon-legend-offset">${Math.abs(m.x).toFixed(1)} RU (${direction})</span>
            </div>
        `;
    });

    dom.lunesLegend.innerHTML = legendHtml;
    showSimulationTime();
}

// Helper per disegnare gli anelli di Saturno
function drawSaturnRings(cx, cy, satRadius, angle, isBack, tiltFactor) {
    // Definizione fisica dei principali anelli di Saturno (in raggi di Saturno RS) e colori premium
    const rings = [
        { name: 'C Ring', outer: 1.52, inner: 1.20, color: 'rgba(120, 100, 80, 0.3)' },      // Flocculo interno debole
        { name: 'B Ring', outer: 1.95, inner: 1.52, color: 'rgba(230, 210, 180, 0.8)' },     // Anello centrale molto luminoso
        { name: 'Cassini', outer: 2.03, inner: 1.95, color: 'rgba(10, 13, 26, 0.95)' },      // Divisione scura
        { name: 'A Ring', outer: 2.27, inner: 2.03, color: 'rgba(180, 160, 130, 0.6)' }      // Anello esterno translucido
    ];

    rings.forEach(r => {
        const rOuterX = satRadius * r.outer;
        const rOuterY = rOuterX * tiltFactor;
        const rInnerX = satRadius * r.inner;
        const rInnerY = rInnerX * tiltFactor;

        ctx.beginPath();
        ctx.ellipse(cx, cy, rOuterX, rOuterY, angle, 0, 2 * Math.PI);
        // Utilizziamo il senso antiorario per l'anello interno (nonzero winding rule) per lasciare il centro vuoto
        ctx.ellipse(cx, cy, rInnerX, rInnerY, angle, 2 * Math.PI, 0, true);
        ctx.fillStyle = r.color;
        ctx.fill();
    });
}

// Restituisce il nome italiano o dettagliato delle lune galileiane
function mColorName(name) {
    if (name === 'Ganymede') return 'Ganimede';
    return name;
}

// Ottiene il nome del font del sistema configurato
function varFontSans() {
    return getComputedStyle(document.documentElement).getPropertyValue('--font-sans') || 'Outfit';
}

// Scrive l'orario simulato corrente sul canvas delle lune
function showSimulationTime() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.font = "400 10px " + varFontSans();
    ctx.textAlign = "left";
    
    // Formatta data simulata
    const d = state.simulatedDate;
    const dateStr = d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    ctx.fillText(`Tempo simulato: ${dateStr} - ${timeStr}`, 12, 22);
}

// Carica i dati TLE per la ISS (con caching e fallback offline)
function fetchIssTle(onComplete) {
    if (issTle) {
        if (onComplete) onComplete();
        return;
    }
    if (isTleFetching) {
        const checkInterval = setInterval(() => {
            if (issTle) {
                clearInterval(checkInterval);
                if (onComplete) onComplete();
            }
        }, 100);
        return;
    }
    
    isTleFetching = true;
    if (dom.issLoading) dom.issLoading.style.display = 'block';
    if (dom.issError) dom.issError.style.display = 'none';
    
    fetch('https://api.wheretheiss.at/v1/satellites/25544/tles')
        .then(response => {
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return response.json();
        })
        .then(data => {
            if (data && data.line1 && data.line2) {
                issTle = data;
                console.log("ISS TLE caricati con successo da API");
            } else {
                throw new Error("Dati TLE non validi");
            }
        })
        .catch(err => {
            console.warn("Impossibile caricare TLE da API (CORS o Rete). Uso TLE di fallback:", err);
            issTle = FALLBACK_ISS_TLE;
        })
        .finally(() => {
            isTleFetching = false;
            if (dom.issLoading) dom.issLoading.style.display = 'none';
            if (onComplete) onComplete();
        });
}

// Calcola i passaggi visibili della ISS nella finestra da 1 ora prima a 2.5 ore dopo il tramonto
function calculateIssPasses() {
    if (typeof satellite === 'undefined') {
        if (dom.issError) {
            dom.issError.innerText = "Attenzione: la libreria satellite.js non è caricata. Controlla la tua connessione internet.";
            dom.issError.style.display = 'block';
        }
        return;
    }
    if (!issTle) {
        return;
    }
    
    const observer = new Astronomy.Observer(state.lat, state.lon, state.alt);
    const activeDate = getActiveDate();
    
    // Calcola il tramonto per trovare la finestra temporale corretta
    const dateStart = new Date(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate(), 0, 0, 0);
    const startAstroTime = Astronomy.MakeTime(dateStart);
    let sunsetEvent = null;
    try {
        sunsetEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, startAstroTime, 1);
    } catch (e) {
        console.error("Errore nel calcolo del tramonto per ISS:", e);
    }
    
    if (!sunsetEvent) {
        if (dom.issContent) {
            dom.issContent.innerHTML = `<div class="iss-no-passes">Impossibile calcolare l'ora del tramonto del Sole per la posizione attuale.</div>`;
        }
        return;
    }
    
    const sunsetTime = sunsetEvent.date;
    const startTime = new Date(sunsetTime.getTime() - 60 * 60 * 1000); // 1h prima
    const endTime = new Date(sunsetTime.getTime() + 150 * 60 * 1000); // 2.5h dopo
    
    let satrec;
    try {
        satrec = satellite.twoline2satrec(issTle.line1, issTle.line2);
    } catch (e) {
        console.error("Errore nel parsing del TLE:", e);
        if (dom.issContent) {
            dom.issContent.innerHTML = `<div class="iss-no-passes" style="color: #fca5a5;">Errore nel caricamento dei dati orbitali (TLE).</div>`;
        }
        return;
    }
    
    // Rileva i passaggi campionando ogni 10 secondi
    const stepSeconds = 10;
    const totalSteps = (endTime.getTime() - startTime.getTime()) / (stepSeconds * 1000);
    
    let passes = [];
    let currentPass = null;
    
    const observerGd = {
        latitude: satellite.degreesToRadians(state.lat),
        longitude: satellite.degreesToRadians(state.lon),
        height: state.alt / 1000
    };
    
    for (let i = 0; i <= totalSteps; i++) {
        const time = new Date(startTime.getTime() + i * stepSeconds * 1000);
        let positionAndVelocity;
        try {
            positionAndVelocity = satellite.propagate(satrec, time);
        } catch (e) {
            continue;
        }
        
        if (!positionAndVelocity || !positionAndVelocity.position) continue;
        
        const satPos = positionAndVelocity.position;
        const gmst = satellite.gstime(time);
        const positionEcf = satellite.eciToEcf(satPos, gmst);
        const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);
        const elevation = satellite.radiansToDegrees(lookAngles.elevation);
        const azimuth = satellite.radiansToDegrees(lookAngles.azimuth);
        
        if (elevation > 0) {
            // Verifica se il satellite è in ombra della Terra (eclissato) o illuminato
            let isIlluminated = true;
            try {
                const astroTime = Astronomy.MakeTime(time);
                const sunVector = Astronomy.HelioVector(Astronomy.Body.Earth, astroTime);
                const sunEci = {
                    x: -sunVector.x * 149597870.7,
                    y: -sunVector.y * 149597870.7,
                    z: -sunVector.z * 149597870.7
                };
                const sunLen = Math.hypot(sunEci.x, sunEci.y, sunEci.z);
                const sunUnit = { x: sunEci.x / sunLen, y: sunEci.y / sunLen, z: sunEci.z / sunLen };
                
                const dot = satPos.x * sunUnit.x + satPos.y * sunUnit.y + satPos.z * sunUnit.z;
                const satDist = Math.hypot(satPos.x, satPos.y, satPos.z);
                if (dot < 0) {
                    const perp = Math.sqrt(satDist * satDist - dot * dot);
                    if (perp < 6371.0) isIlluminated = false;
                }
            } catch (e) {
                // In caso di errore nel calcolo dell'eclisse, consideralo illuminato
            }
            
            if (!currentPass) {
                currentPass = {
                    startTime: time,
                    endTime: time,
                    maxElevation: elevation,
                    maxElevationTime: time,
                    maxElevationAzimuth: azimuth,
                    startAzimuth: azimuth,
                    endAzimuth: azimuth,
                    maxElevationIlluminated: isIlluminated,
                    illuminatedPoints: isIlluminated ? 1 : 0,
                    totalPoints: 1
                };
            } else {
                currentPass.endTime = time;
                currentPass.endAzimuth = azimuth;
                currentPass.totalPoints++;
                if (isIlluminated) currentPass.illuminatedPoints++;
                
                if (elevation > currentPass.maxElevation) {
                    currentPass.maxElevation = elevation;
                    currentPass.maxElevationTime = time;
                    currentPass.maxElevationAzimuth = azimuth;
                    currentPass.maxElevationIlluminated = isIlluminated;
                }
            }
        } else {
            if (currentPass) {
                passes.push(currentPass);
                currentPass = null;
            }
        }
    }
    
    if (currentPass) {
        passes.push(currentPass);
    }
    
    // Mostriamo solo passaggi con altezza max reale di almeno 5 gradi
    passes = passes.filter(p => p.maxElevation >= 5);
    
    function getCardinalDirection(deg) {
        const idx = Math.floor(((deg + 22.5) % 360) / 45);
        const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
        return directions[idx];
    }
    
    const pad = (n) => String(n).padStart(2, '0');
    const formatTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    
    let html = '';
    
    if (passes.length === 0) {
        html = `
            <div class="iss-no-passes">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 0.5rem; opacity: 0.4; color: #38bdf8;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <p style="font-weight: 500;">Nessun passaggio della ISS sopra l'orizzonte (alt &gt; 5°) nella finestra selezionata.</p>
                <span style="font-size: 0.75rem; opacity: 0.6; margin-top: 6px; display: block; font-family: var(--font-mono);">
                    Finestra analizzata: dalle ${formatTime(startTime)} alle ${formatTime(endTime)}
                </span>
            </div>
        `;
    } else {
        html += `
            <div class="iss-table-wrapper">
                <table class="iss-table">
                    <thead>
                        <tr>
                            <th>Inizio</th>
                            <th>Picco (Max)</th>
                            <th>Elev. Max</th>
                            <th>Traiettoria</th>
                            <th>Visibilità</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        passes.forEach(p => {
            const isAfterSunset = p.maxElevationTime.getTime() > sunsetTime.getTime();
            // ISS è visibile se è illuminata dal Sole e l'osservatore è dopo il tramonto (cielo scuro)
            const visible = p.maxElevationIlluminated && isAfterSunset;
            
            const visBadgeClass = visible ? 'iss-vis-yes' : 'iss-vis-no';
            const visBadgeText = visible ? '✨ Eccellente (Visibile)' : (!isAfterSunset ? '☀️ Diurno (Cielo troppo chiaro)' : '🌑 Eclissata (In ombra)');
            
            let elevClass = 'iss-elev-low';
            if (p.maxElevation >= 40) elevClass = 'iss-elev-high';
            else if (p.maxElevation >= 15) elevClass = 'iss-elev-mid';
            
            const startCard = getCardinalDirection(p.startAzimuth);
            const peakCard = getCardinalDirection(p.maxElevationAzimuth);
            const endCard = getCardinalDirection(p.endAzimuth);
            
            html += `
                <tr>
                    <td class="iss-time-cell">${formatTime(p.startTime)}</td>
                    <td class="iss-time-cell" style="color: #38bdf8; font-weight: bold;">${formatTime(p.maxElevationTime)}</td>
                    <td>
                        <span class="iss-elev-badge ${elevClass}">
                            ${p.maxElevation.toFixed(0)}°
                        </span>
                    </td>
                    <td>
                        <span style="font-weight: 500;">${startCard}</span> 
                        <span class="iss-arrow">➔</span> 
                        <span style="font-weight: 600; color: #fff;">${peakCard}</span> 
                        <span class="iss-arrow">➔</span> 
                        <span style="font-weight: 500;">${endCard}</span>
                        <span style="color: var(--text-muted); font-size: 0.75rem; margin-left: 6px; font-family: var(--font-mono);">
                            (${p.maxElevationAzimuth.toFixed(0)}°)
                        </span>
                    </td>
                    <td>
                        <span class="iss-vis-badge ${visBadgeClass}">
                            ${visBadgeText}
                        </span>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    if (issTle) {
        const tleTimestamp = issTle.tle_timestamp ? new Date(issTle.tle_timestamp * 1000).toLocaleDateString('it-IT') : 'Recente';
        html += `
            <div class="iss-tle-info">
                Dati orbitali ISS (TLE) aggiornati al: <strong>${tleTimestamp}</strong> ${issTle.header === 'ISS (ZARYA)' ? '(Fallback locale)' : '(API Live)'}
            </div>
        `;
    }
    
    if (dom.issContent) {
        dom.issContent.innerHTML = html;
    }
}

// Calcola la visibilità e le coordinate dei pianeti nani e degli asteroidi maggiori
function calculateDwarfs() {
    if (!dom.dwarfsGrid) return;
    
    const activeDate = getActiveDate();
    const observer = new Astronomy.Observer(state.lat, state.lon, state.alt);
    const astroTime = Astronomy.MakeTime(activeDate);
    
    // Inclinazione dell'eclittica J2000
    const eps = 23.4392911 * Math.PI / 180;
    const cos_eps = Math.cos(eps);
    const sin_eps = Math.sin(eps);
    
    // Vettore Terra
    let earthHel;
    try {
        earthHel = Astronomy.HelioVector(Astronomy.Body.Earth, astroTime);
    } catch(e) {
        console.error("Errore nel calcolo del vettore Terra:", e);
        return;
    }
    
    let cardsHtml = '';
    
    DWARF_PLANETS.forEach(d => {
        let alt = 0;
        let az = 0;
        let ra = 0;
        let dec = 0;
        let isVisible = false;
        
        if (d.useNative) {
            try {
                const equ = Astronomy.Equator(Astronomy.Body.Pluto, astroTime, observer, true, true);
                const hor = Astronomy.Horizon(astroTime, observer, equ.ra, equ.dec, 'normal');
                alt = hor.altitude;
                az = hor.azimuth;
                ra = equ.ra;
                dec = equ.dec;
                isVisible = alt > 0;
            } catch(e) {
                console.error("Errore nel calcolo nativo di Plutone:", e);
            }
        } else {
            try {
                const el = d.elements;
                const dt = astroTime.tt; // giorni dal J2000 epoch
                
                // 1. Anomalia media
                let M = (el.M0 + el.n * dt) % 360;
                if (M < 0) M += 360;
                
                // 2. Risoluzione dell'equazione di Keplero
                const M_rad = M * Math.PI / 180;
                let E = M_rad;
                for (let iter = 0; iter < 8; iter++) {
                    E = E - (E - el.e * Math.sin(E) - M_rad) / (1 - el.e * Math.cos(E));
                }
                
                // 3. Coordinate nel piano orbitale
                const x_orb = el.a * (Math.cos(E) - el.e);
                const y_orb = el.a * Math.sqrt(1 - el.e * el.e) * Math.sin(E);
                
                // 4. Rotazione in coordinate Eclittiche Eliocentriche J2000
                const i_rad = el.i * Math.PI / 180;
                const node_rad = el.node * Math.PI / 180;
                const peri_rad = el.peri * Math.PI / 180;
                
                const cos_w = Math.cos(peri_rad);
                const sin_w = Math.sin(peri_rad);
                const cos_N = Math.cos(node_rad);
                const sin_N = Math.sin(node_rad);
                const cos_i = Math.cos(i_rad);
                const sin_i = Math.sin(i_rad);
                
                const x_hel = x_orb * (cos_w * cos_N - sin_w * sin_N * cos_i) - y_orb * (sin_w * cos_N + cos_w * sin_N * cos_i);
                const y_hel = x_orb * (cos_w * sin_N + sin_w * cos_N * cos_i) - y_orb * (sin_w * sin_N - cos_w * cos_N * cos_i);
                const z_hel = x_orb * (sin_w * sin_i) + y_orb * (cos_w * sin_i);
                
                // 5. Coordinate Geocentriche Eclittiche
                const x_geo = x_hel - earthHel.x;
                const y_geo = y_hel - earthHel.y;
                const z_geo = z_hel - earthHel.z;
                
                // 6. Rotazione in Equatoriale J2000
                const x_eq = x_geo;
                const y_eq = y_geo * cos_eps - z_geo * sin_eps;
                const z_eq = y_geo * sin_eps + z_geo * cos_eps;
                
                // 7. Calcolo RA & Dec
                let RA_rad = Math.atan2(y_eq, x_eq);
                if (RA_rad < 0) RA_rad += 2 * Math.PI;
                const Dec_rad = Math.atan2(z_eq, Math.hypot(x_eq, y_eq));
                
                ra = RA_rad * 12 / Math.PI;
                dec = Dec_rad * 180 / Math.PI;
                
                // 8. Conversione all'orizzonte dell'osservatore
                const hor = Astronomy.Horizon(astroTime, observer, ra, dec, 'normal');
                alt = hor.altitude;
                az = hor.azimuth;
                isVisible = alt > 0;
            } catch(e) {
                console.error(`Errore nel calcolo del corpo ${d.name}:`, e);
            }
        }
        
        const cardDir = getCardinalDirection(az);
        
        cardsHtml += `
            <div class="planet-card" style="--planet-color: ${d.color}; cursor: default;">
                <div class="planet-header">
                    <div class="planet-info">
                        <div class="planet-dot" style="background-color: ${d.color}"></div>
                        <span class="planet-name" style="font-size: 1rem;">${d.name}</span>
                    </div>
                    <span class="visibility-badge ${isVisible ? 'visible' : 'invisible'}">
                        ${isVisible ? 'Visibile' : 'Non Visibile'}
                    </span>
                </div>
                
                <div class="planet-coords">
                    <div class="coord-box">
                        <span class="coord-label">Altezza</span>
                        <span class="coord-val">${alt.toFixed(2)}°</span>
                    </div>
                    <div class="coord-box">
                        <span class="coord-label">Azimut</span>
                        <span class="coord-val">${az.toFixed(1)}° (${cardDir})</span>
                    </div>
                </div>
                
                <div class="planet-times" style="font-size: 0.72rem; color: var(--text-secondary); display: flex; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 0.5rem; margin-top: 0.25rem;">
                    <span>AR: ${formatRA(ra)}</span>
                    <span>Dec: ${dec.toFixed(2)}°</span>
                    <span style="color: var(--text-muted); font-size: 0.65rem; font-weight: 600; text-transform: uppercase;">${d.type}</span>
                </div>
            </div>
        `;
    });
    
    dom.dwarfsGrid.innerHTML = cardsHtml;
}
