# VesperEye 🌌
> **Strumento Astronomico Avanzato per Astrofili | Advanced Astronomical Planner for Stargazers**

---

### [Italiano](#italiano-1) | [English](#english-1)

---

# Italiano

**VesperEye** è un'applicazione web moderna, reattiva e orientata alla massima efficienza sul campo, sviluppata per gli astrofili e gli appassionati di astronomia. Consente di pianificare le sessioni osservative calcolando in tempo reale la visibilità dei pianeti, la posizione dei loro satelliti naturali principali (Giove, Saturno, Urano), i passaggi della Stazione Spaziale Internazionale (ISS) e l'attività solare, il tutto integrato con un planisfero celeste digitale interattivo.

Sviluppato da **Roberto** per l'associazione **Astrofili Ponte di Piave** ([www.astrofilipontedipiave.it](https://www.astrofilipontedipiave.it)).

---

## 🌟 Caratteristiche Principali

*   **Pannello Sole & Luna:** Calcolo dinamico di alba, sorgere, tramonto, percentuale di illuminazione, fase lunare attuale, altezza esatta sull'orizzonte e stato di visibilità reale (con colorazione neon condizionale per l'osservazione immediata).
*   **Stato di Visibilità dei Pianeti:** Schede dettagliate per ciascun pianeta del Sistema Solare con coordinate altazimutali (Altezza/Azimut), direzione cardinale ed eventi di sorgere/tramonto.
*   **Visualizzatore Galileiano e Satelliti:** Grafica in tempo reale delle orbite delle lune di Giove (Io, Europa, Ganimede, Callisto), dei satelliti di Saturno (con inclinazione degli anelli) e delle lune principali di Urano in vista telescopica raddrizzata (Est a sinistra).
*   **Planisfero Celeste Interattivo (Volta Stellata):** 
    *   Ispirato al modello digitale di `in-the-sky.org` con proiezione a raggio massimo `R_MAX = 90`.
    *   Rotazione manuale con tecnologia **Drag-to-Rotate** (mouse & touch) per orientarsi in ogni direzione.
    *   Integrazione con la **Bussola Reale** (sensore d'orientamento del dispositivo mobile) con disattivazione automatica intelligente in caso di drag manuale.
    *   Tracciamento di **10 costellazioni principali** (5 brillanti e 5 strutturali con sole linee di congiunzione e centroidi) e pianeti compatti dotati di neon glow.
*   **Passaggi ISS (Stazione Spaziale Internazionale):** Calcolo e tracciamento in tempo reale tramite TLE (Two-Line Elements) orbitali aggiornati e libreria `satellite.js` per i passaggi visibili.
*   **Pianeti Nani & Asteroidi:** Tabella dei corpi minori (compreso Plutone) attualmente visibili sopra l'orizzonte.
*   **Monitoraggio Attività Solare:** Integrazione in tempo reale delle immagini del disco solare fotosferico dal satellite scientifico della NASA **SDO (HMI Colorized Intensitygram)** per tracciare le macchie solari.

---

## 🛠️ Stack Tecnologico

*   **Core:** HTML5 Semantico, CSS3 Vanilla (con palette oscure e moderne, glassmorfismo e micro-animazioni responsive).
*   **Logica:** JavaScript nativo ES6+.
*   **Motore Astronomico:** **Astronomy Engine** (locale, offline-ready e ad alta precisione).
*   **Calcolo Orbitale ISS:** **satellite.js** (tramite CDN).

---

## 🚀 Installazione e Utilizzo Locale

1.  Clona il repository sul tuo computer locale:
    ```bash
    git clone https://github.com/qsecofr76/VesperEye.git
    ```
2.  Entra nella directory del progetto:
    ```bash
    cd VesperEye
    ```
3.  Avvia un server web locale leggero (ad esempio con Python):
    ```bash
    python -m http.server 8080
    ```
4.  Apri il tuo browser preferito all'indirizzo:
    ```text
    http://localhost:8080
    ```

---

# English

**VesperEye** is a modern, responsive, and field-optimized web application tailored for amateur astronomers and stargazers. It streamlines night-sky planning by calculating planet visibility, natural satellite positions (Jupiter, Saturn, Uranus), International Space Station (ISS) flybys, and solar activity in real-time, all tied together by an interactive digital planisphere.

Developed by **Roberto** for the **Astrofili Ponte di Piave** association ([www.astrofilipontedipiave.it](https://www.astrofilipontedipiave.it)).

---

## 🌟 Key Features

*   **Sun & Moon Dashboard:** Real-time rise, set, illuminated fraction, current moon phase, altitude above the horizon, and dynamic visibility status (with active neon-color indicators).
*   **Planet Visibility Status:** Dedicated cards for every major planet in the Solar System, including Alt/Az coordinates, cardinal direction, and precise rise/set events.
*   **Natural Satellites Orbit Viewer:** Real-time orbital rendering for Jupiter's Galilean moons, Saturn's moons (including ring tilt), and Uranus' major moons in a rectified telescopic view (East to the left).
*   **Interactive Sky Map (Planisphere):**
    *   Inspired by the digital model of `in-the-sky.org` with an expanded projection radius `R_MAX = 90`.
    *   Fluid manual **Drag-to-Rotate** interaction (mouse & touch) to rotate the sky wheel 360°.
    *   Mobile **Compass Mode** integration (Device Orientation API) with automatic suspension when manual dragging starts.
    *   Features **10 major constellations** (5 bright stars/lines + 5 structural hidden star grids with centroids) and compact planet markers with neon glow shadows.
*   **ISS Flyby Predictor:** Real-time orbital propagation using updated TLEs and the `satellite.js` library for visible evening passes.
*   **Dwarf Planets & Asteroids:** Visibility list of minor bodies (including Pluto) currently above the local horizon.
*   **Solar Activity Tracker:** Direct real-time feed of the solar photosphere from NASA's **SDO (HMI Colorized Intensitygram)** satellite for live sunspots monitoring.

---

## 🛠️ Tech Stack

*   **Core:** Semantic HTML5, Vanilla CSS3 (featuring dark theme styling, glassmorphism, and responsive micro-animations).
*   **Logic:** Native JavaScript (ES6+).
*   **Ephemeris Engine:** **Astronomy Engine** (bundled locally for offline performance and high mathematical accuracy).
*   **Orbital Propagation:** **satellite.js** (via CDN).

---

## 🚀 Installation & Local Setup

1.  Clone the repository to your local machine:
    ```bash
    git clone https://github.com/qsecofr76/VesperEye.git
    ```
2.  Navigate to the project folder:
    ```bash
    cd VesperEye
    ```
3.  Launch a lightweight local web server (e.g., using Python):
    ```bash
    python -m http.server 8080
    ```
4.  Open your browser and navigate to:
    ```text
    http://localhost:8080
    ```

---

## 📜 License / Licenza

Questo progetto è distribuito ad uso educativo e per astrofili.
This project is distributed for educational and amateur astronomical purposes.
