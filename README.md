# SmartWatt — Energy Intelligence Dashboard Prototype

SmartWatt is a front-end demonstration of an energy monitoring and electricity cost analysis concept.

## What is included
- Responsive dashboard UI
- Editable example appliance energy values
- Electricity cost estimation using `cost = energy (kWh) × tariff (₹/kWh)`
- Daily usage trend visualization using illustrative data
- Rule-based, explainable example alerts
- Reset control for the sample data

## Important implementation status
This repository contains a **front-end prototype with sample data**. It does not currently connect to an ESP32, PZEM-004T energy meter, IoT backend, live sensors, notifications, or physical switching hardware. Values and alert examples are illustrative and must not be presented as live measurements or validated results.

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser.

No build step is required.

## Publish with GitHub Pages
1. Push these files to a GitHub repository.
2. Ensure `index.html`, `styles.css`, and `script.js` are in the repository root.
3. Open **Settings → Pages**.
4. Under build and deployment, select **Deploy from a branch**.
5. Select branch `main` and folder `/(root)`, then save.
6. Wait for deployment and open the URL shown in the Pages section.

## Core calculation
`Estimated cost (₹) = Energy (kWh) × Tariff (₹/kWh)`

## Potential next development steps
- Connect an ESP32 and compatible energy meter using a suitable isolated measurement design.
- Define and validate a secure data-transfer interface.
- Replace sample values with timestamped measured data.
- Test energy calculations against a reference meter.
- Validate alert rules and document false positives before making performance claims.
