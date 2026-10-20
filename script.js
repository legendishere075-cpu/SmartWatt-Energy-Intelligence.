// SmartWatt prototype dashboard.
// All readings below are illustrative sample data, not live electrical measurements.
const initialAppliances = [
  { name: "Air Conditioner", icon: "❄", kwh: 120, review: "Review runtime" },
  { name: "Refrigerator", icon: "▣", kwh: 80, review: "Typical pattern" },
  { name: "Water Heater", icon: "♨", kwh: 60, review: "Review schedule" },
  { name: "Washing Machine", icon: "◉", kwh: 40, review: "Typical pattern" },
  { name: "Television", icon: "▭", kwh: 30, review: "Typical pattern" },
  { name: "Others", icon: "＋", kwh: 90, review: "Category estimate" }
];
let appliances = initialAppliances.map(item => ({...item}));
const sampleDaily = [10,12,13,11,15,16,14,12,17,13,15,18,14,12,16,19,15,13,14,17,12,16,18,14,13,15,17,12,16,14];
const $ = id => document.getElementById(id);
const money = n => Math.round(n).toLocaleString("en-IN");
const tariffInput = $("tariffInput");

function totals() {
  const energy = appliances.reduce((sum, a) => sum + Math.max(0, Number(a.kwh) || 0), 0);
  const tariff = Math.max(0, Number(tariffInput.value) || 0);
  return { energy, tariff, cost: energy * tariff, average: energy / 30 };
}
function renderMetrics() {
  const t = totals();
  $("totalEnergy").textContent = t.energy.toLocaleString("en-IN", {maximumFractionDigits:1});
  $("totalCost").textContent = money(t.cost);
  $("dailyAverage").textContent = t.average.toFixed(1);
  $("trendAverage").textContent = `${t.average.toFixed(1)} kWh`;
  $("alertTotal").textContent = "2";
  $("navAlertCount").textContent = "2";
  const top = [...appliances].sort((a,b) => b.kwh-a.kwh)[0];
  const share = t.energy > 0 ? top.kwh/t.energy*100 : 0;
  $("topAppliance").textContent = top ? top.name : "No data";
  $("topApplianceBar").style.width = `${Math.min(100,share)}%`;
  $("insightCopy").textContent = top
    ? `${top.name} accounts for ${share.toFixed(1)}% of the current sample total. Review operating hours and comfort or usage needs before making changes.`
    : "Enter sample appliance values to see an illustrative breakdown.";
}
function renderAppliances() {
  const t = totals();
  $("applianceRows").innerHTML = appliances.map((a, index) => {
    const kwh = Math.max(0, Number(a.kwh) || 0);
    const share = t.energy ? kwh / t.energy * 100 : 0;
    const cost = kwh * t.tariff;
    return `<tr>
      <td><div class="appliance-name"><span class="appliance-symbol">${a.icon}</span>${a.name}</div></td>
      <td><input class="energy-input" type="number" min="0" step="1" value="${kwh}" data-index="${index}" aria-label="${a.name} sample energy in kWh"></td>
      <td class="share-cell"><div class="share-label"><span>${share.toFixed(1)}%</span><span>${kwh.toFixed(0)} kWh</span></div><div class="share-bar"><div style="width:${share}%"></div></div></td>
      <td class="cost-cell">₹${money(cost)}</td>
      <td><span class="review-label">${a.review}</span></td>
    </tr>`;
  }).join("");
  document.querySelectorAll(".energy-input").forEach(input => {
    input.addEventListener("input", event => {
      const index = Number(event.target.dataset.index);
      appliances[index].kwh = Math.max(0, Number(event.target.value) || 0);
      updateDashboard();
    });
  });
}
function renderAlerts() {
  const t = totals();
  const ac = appliances.find(a => a.name === "Air Conditioner");
  const heater = appliances.find(a => a.name === "Water Heater");
  const alerts = [
    { title: "Example: review air-conditioner runtime", time: "Illustrative rule", text: `The sample value for Air Conditioner is ${ac ? ac.kwh : 0} kWh. Compare actual operating hours with your preferred schedule before deciding whether any change is needed.`, extra: `Estimated cost at current tariff: ₹${money((ac ? ac.kwh : 0) * t.tariff)}` },
    { title: "Example: check water-heater schedule", time: "Illustrative rule", text: `The sample value for Water Heater is ${heater ? heater.kwh : 0} kWh. If real measurements show usage outside the configured window, verify the appliance and schedule first.`, extra: `Estimated cost at current tariff: ₹${money((heater ? heater.kwh : 0) * t.tariff)}` }
  ];
  $("alertsList").innerHTML = alerts.map(a => `<div class="alert-item"><div class="alert-symbol">!</div><div class="alert-body"><div class="alert-head"><strong>${a.title}</strong><span class="alert-time">${a.time}</span></div><p>${a.text}</p><div class="alert-cost">${a.extra}</div></div></div>`).join("");
}
function drawChart() {
  const canvas = $("usageChart");
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, rect.width * dpr);
  canvas.height = Math.max(1, rect.height * dpr);
  ctx.scale(dpr,dpr);
  const w = rect.width, h = rect.height;
  const pad = {left:32,right:10,top:12,bottom:27};
  const cw = w-pad.left-pad.right, ch = h-pad.top-pad.bottom;
  const max = 20;
  ctx.clearRect(0,0,w,h);
  ctx.font = "10px DM Sans, sans-serif";
  ctx.textAlign = "right";
  for(let value=0; value<=20; value+=5){
    const y=pad.top+ch-(value/max)*ch;
    ctx.strokeStyle="#edf1f6";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad.left,y);ctx.lineTo(w-pad.right,y);ctx.stroke();
    ctx.fillStyle="#9ba7b7";ctx.fillText(String(value),pad.left-9,y+3);
  }
  const points=sampleDaily.map((value,i)=>({x:pad.left+(i/(sampleDaily.length-1))*cw,y:pad.top+ch-(value/max)*ch}));
  const gradient=ctx.createLinearGradient(0,pad.top,0,h-pad.bottom);
  gradient.addColorStop(0,"rgba(27,214,177,.23)");gradient.addColorStop(1,"rgba(27,214,177,0)");
  ctx.beginPath();ctx.moveTo(points[0].x,pad.top+ch);points.forEach(p=>ctx.lineTo(p.x,p.y));ctx.lineTo(points[points.length-1].x,pad.top+ch);ctx.closePath();ctx.fillStyle=gradient;ctx.fill();
  ctx.beginPath();points.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));ctx.strokeStyle="#18c9a6";ctx.lineWidth=2.5;ctx.lineJoin="round";ctx.lineCap="round";ctx.stroke();
  [0,7,14,21,29].forEach(i=>{const p=points[i];ctx.fillStyle="#8b9bb0";ctx.textAlign="center";ctx.fillText(["Day 1","Day 8","Day 15","Day 22","Day 30"][["0","7","14","21","29"].indexOf(String(i))],p.x,h-7)});
}
function updateDashboard(){renderMetrics();renderAppliances();renderAlerts();drawChart();}
tariffInput.addEventListener("input", updateDashboard);
$("resetButton").addEventListener("click",()=>{appliances=initialAppliances.map(item=>({...item}));tariffInput.value="7.5";updateDashboard();});
$("menuButton").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-link").forEach(link=>link.addEventListener("click",()=> $("sidebar").classList.remove("open")));
window.addEventListener("resize",drawChart);
updateDashboard();
