// Dummy sensor data
const sensors=[{name:'Temp',val:'22°C',status:'OK'},{name:'Humidity',val:'45%',status:'OK'},{name:'Pressure',val:'1013 hPa',status:'OK'}];
const table=document.getElementById('sensorTable');
sensors.forEach(s=>{let tr=document.createElement('tr');tr.innerHTML=`<td>${s.name}</td><td>${s.val}</td><td>${s.status}</td>`;table.appendChild(tr);});

// Dummy material data
const materials=[{sample:'S1',type:'Metal',conf:'95%'},{sample:'S2',type:'Ceramic',conf:'88%'}];
const mtable=document.getElementById('materialTable');
materials.forEach(m=>{let tr=document.createElement('tr');tr.innerHTML=`<td>${m.sample}</td><td>${m.type}</td><td>${m.conf}</td>`;mtable.appendChild(tr);});

// Leaflet map
const map=L.map('mapid').setView([55.7558,37.6176],13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
L.marker([55.7558,37.6176]).addTo(map).bindPopup('Artifact Location').openPopup();
