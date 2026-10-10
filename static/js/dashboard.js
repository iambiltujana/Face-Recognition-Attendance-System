// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  const trainBtn = $("trainBtn"), trainProgress = $("trainProgress"), trainWrap = $("trainProgressWrap");
  const trainMsg = $("trainMsg"), trainTitle = $("trainTitle");
  const rangeSelect = $("rangeSelect");
  let chart = null;

  // ---------- Stats / chart / recent table ----------
  function delta(el, pct, label) {
    if (pct === null || pct === undefined) { el.innerHTML = `<span class="text-muted">${label}</span>`; return; }
    const up = pct >= 0;
    el.innerHTML = `<b class="${up ? "up" : "down"}"><i class="bi bi-arrow-${up ? "up" : "down"}"></i> ${Math.abs(pct)}%</b><br>${label}`;
  }

  async function loadDashboard() {
    try {
      const res = await fetch(`/dashboard_stats?days=${rangeSelect.value}`);
      const d = await res.json();

      $("todayLabel").innerText = d.today_label;
      $("sTotal").innerText = d.total;
      $("sPresent").innerText = d.present;
      $("sAbsent").innerText = d.absent;
      $("sRate").innerText = d.rate + "%";
      delta($("dTotal"), d.delta.total, "vs. last week");
      delta($("dPresent"), d.delta.present, "vs. yesterday");
      delta($("dAbsent"), d.delta.absent, "vs. yesterday");
      delta($("dRate"), d.delta.rate, "vs. last week");

      drawChart(d.chart);
      drawRecent(d.recent);
      if (!d.model_trained && trainTitle.innerText === "Model not trained yet") return;
      if (d.model_trained && !trainBtn.disabled) {
        trainTitle.innerText = "Model is trained";
        trainMsg.innerText = "Train again after adding new students.";
      }
    } catch (e) { console.error(e); }
  }

  function drawChart(c) {
    const ctx = $("attendanceChart").getContext("2d");
    const ds = (label, data, color) => ({
      label, data, borderColor: color, backgroundColor: color, borderWidth: 2,
      pointRadius: 3, pointBackgroundColor: color, tension: 0
    });
    if (!chart) {
      chart = new Chart(ctx, {
        type: "line",
        data: { labels: c.labels, datasets: [ds("Present", c.present, "#2f5be7"), ds("Absent", c.absent, "#b6bdd0")] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { align: "end", labels: { usePointStyle: true, boxWidth: 7 } } },
          scales: { y: { beginAtZero: true, grid: { color: "#eef1f7" } }, x: { grid: { color: "#eef1f7" } } }
        }
      });
    } else {
      chart.data.labels = c.labels;
      chart.data.datasets[0].data = c.present;
      chart.data.datasets[1].data = c.absent;
      chart.update();
    }
  }

  function drawRecent(rows) {
    const body = $("recentBody");
    if (!rows.length) { body.innerHTML = `<tr><td colspan="4" class="empty">No attendance marked yet.</td></tr>`; return; }
    body.innerHTML = rows.map(r => `
      <tr>
        <td><div class="who"><span class="ini">${r.initials}</span>${r.name}</div></td>
        <td>${r.date}</td><td>${r.time}</td>
        <td><span class="badge-s ${r.status.toLowerCase()}">${r.status}</span></td>
      </tr>`).join("");
  }

  // ---------- Training ----------
  function renderTrain(s) {
    trainProgress.style.width = s.progress + "%";
    trainProgress.innerText = s.progress + "%";
    trainMsg.innerText = s.message || "";
  }

  trainBtn.addEventListener("click", async () => {
    trainBtn.disabled = true;
    trainWrap.classList.remove("d-none");
    trainTitle.innerText = "Training in progress";
    const start = await fetch("/train_model");
    if (!start.ok && start.status !== 202) {
      alert("Failed to start training");
      trainBtn.disabled = false;
      return;
    }
    const t = setInterval(async () => {
      try {
        const s = await (await fetch("/train_status")).json();
        renderTrain(s);
        if (!s.running) {
          clearInterval(t);
          trainBtn.disabled = false;
          if (s.progress >= 100) { trainTitle.innerText = "Model is trained"; }
          else { trainTitle.innerText = "Model not trained yet"; }
        }
      } catch (e) { console.error(e); }
    }, 1500);
  });

  rangeSelect.addEventListener("change", loadDashboard);
  loadDashboard();
  setInterval(loadDashboard, 10000);
});