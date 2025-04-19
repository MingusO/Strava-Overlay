
let selectedActivity = null;
let uploadedImage = null;

const activities = [
  {
    title: 'Afternoon Run',
    date: '17.4.2025',
    distance: '2.7 mi',
    time: '00:29:43',
    pace: '10:50 /mi',
    elevation: '69 ft',
    maxElevation: '14 ft',
    calories: '125 Cal'
  }
];

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(div => div.classList.add('hidden'));
  document.getElementById(tab).classList.remove('hidden');
}

function loadActivities() {
  const container = document.getElementById('activityList');
  activities.forEach((a, index) => {
    const div = document.createElement('div');
    div.style.background = '#1a1f2b';
    div.style.margin = '10px';
    div.style.padding = '10px';
    div.style.borderRadius = '10px';
    div.innerHTML = `<h3>${a.title}</h3>
      <p>${a.date} – ${a.distance} – ${a.time}</p>
      <p>${a.pace} – ${a.elevation} – ${a.maxElevation}</p>
      <button onclick="chooseActivity(${index})">Choose this activity →</button>`;
    container.appendChild(div);
  });
}

function chooseActivity(index) {
  selectedActivity = activities[index];
  switchTab('finish');
  drawOverlay();
}

document.getElementById('photoUpload').addEventListener('change', (e) => {
  const reader = new FileReader();
  reader.onload = (evt) => {
    const img = new Image();
    img.onload = () => {
      uploadedImage = img;
      drawOverlay();
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

function drawOverlay() {
  if (!uploadedImage || !selectedActivity) return;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = uploadedImage.width;
  canvas.height = uploadedImage.height;
  ctx.drawImage(uploadedImage, 0, 0);

  const showTrack = document.getElementById('showTrack').checked;
  if (showTrack) {
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.lineTo(300, 250);
    ctx.lineTo(350, 200);
    ctx.lineWidth = parseInt(document.getElementById('trackWidth').value);
    ctx.strokeStyle = hexToRGBA(document.getElementById('trackColor').value, parseFloat(document.getElementById('trackOpacity').value));
    ctx.stroke();
  }

  const showStats = document.getElementById('showStats').checked;
  if (showStats) {
    const color = document.getElementById('textColor').value;
    const opacity = parseFloat(document.getElementById('textOpacity').value);
    const selectedStats = Array.from(document.querySelectorAll('.stat-toggle:checked')).map(cb => cb.value);
    ctx.font = "36px sans-serif";
    ctx.fillStyle = hexToRGBA(color, opacity);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(`${selectedActivity.title} - ${selectedActivity.date}`, 30, 60);
    ctx.fillText(`${selectedActivity.title} - ${selectedActivity.date}`, 30, 60);
    const statMap = {
      distance: `Distance: ${selectedActivity.distance}`,
      pace: `Pace: ${selectedActivity.pace}`,
      time: `Moving Time: ${selectedActivity.time}`,
      elevation: `Elevation Gain: ${selectedActivity.elevation}`,
      calories: `Calories: ${selectedActivity.calories}`,
      maxElevation: `Max Elevation: ${selectedActivity.maxElevation}`
    };
    let y = 110;
    selectedStats.forEach(key => {
      ctx.strokeText(statMap[key], 30, y);
      ctx.fillText(statMap[key], 30, y);
      y += 40;
    });
  }
}

function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function downloadOverlay() {
  const canvas = document.getElementById('canvas');
  const link = document.createElement('a');
  link.download = 'overlay.png';
  link.href = canvas.toDataURL();
  link.click();
}

function openImageInNewTab() {
  const canvas = document.getElementById('canvas');
  const url = canvas.toDataURL();
  const win = window.open();
  win.document.write('<img src="' + url + '" />');
}

loadActivities();
