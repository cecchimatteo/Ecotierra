(function () {
  var root = document.getElementById("fhSourcingDashboard");
  if (!root) return;

  var metaEl = document.getElementById("fhSdContractsMeta");
  var contracts = [];
  try {
    contracts = metaEl ? JSON.parse(metaEl.textContent || "[]") : [];
  } catch (e) {
    contracts = [];
  }

  function hashSeed(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function contractBasePrice(contractId) {
    var s = hashSeed(contractId || "x");
    return 355 + (s % 420) / 10;
  }

  function buildSeries(contractId, rangeKey) {
    var base = contractBasePrice(contractId);
    var n;
    var hourly = rangeKey === "24H";
    if (rangeKey === "24H") n = 24;
    else if (rangeKey === "5D") n = 5;
    else if (rangeKey === "1M") n = 22;
    else if (rangeKey === "3M") n = 45;
    else n = 78;

    var out = [];
    var v = base - (n * 0.08);
    for (var i = 0; i < n; i++) {
      var wobble = Math.sin(i * 0.7 + hashSeed(contractId) * 0.001) * (hourly ? 0.35 : 1.1);
      var drift = i * (hourly ? 0.04 : 0.12);
      v = Math.round((base - drift + wobble + (Math.random() - 0.5) * (hourly ? 0.15 : 0.4)) * 100) / 100;
      out.push(v);
    }
    out[out.length - 1] = Math.round((base + (Math.random() - 0.5) * 0.5) * 100) / 100;
    return out;
  }

  function xLabelsForRange(rangeKey, len) {
    if (rangeKey === "24H") {
      var lab = [];
      for (var h = 0; h < len; h++) {
        if (h % 4 !== 0 && h !== len - 1) continue;
        var hr = (17 + h) % 24;
        lab.push({ i: h, t: hr + ":00" });
      }
      return lab;
    }
    if (rangeKey === "5D") {
      return [
        { i: 0, t: "D-4" },
        { i: Math.floor(len / 2), t: "D-2" },
        { i: len - 1, t: "Today" },
      ];
    }
    if (rangeKey === "1M") {
      return [
        { i: 0, t: "Wk 1" },
        { i: Math.floor(len / 3), t: "Wk 2" },
        { i: Math.floor((2 * len) / 3), t: "Wk 3" },
        { i: len - 1, t: "Now" },
      ];
    }
    if (rangeKey === "3M") {
      return [
        { i: 0, t: "M-3" },
        { i: Math.floor(len / 2), t: "Mid" },
        { i: len - 1, t: "Now" },
      ];
    }
    return [
      { i: 0, t: "T0" },
      { i: Math.floor(len / 2), t: "Mid" },
      { i: len - 1, t: "Now" },
    ];
  }

  var selectEl = document.getElementById("fhSdContractSelect");
  var selectedContractId = selectEl && selectEl.value ? selectEl.value : contracts[0] && contracts[0].id;
  var rangeKey = "24H";
  var data = buildSeries(selectedContractId, rangeKey);

  var openRef = contractBasePrice(selectedContractId) - 1.25;
  var icePrice = data.length ? data[data.length - 1] : 382.5;

  var priceEl = document.getElementById("fhSdIceLarge");
  var chgArrow = document.getElementById("fhSdIceChgArrow");
  var chgNum = document.getElementById("fhSdIceChgNum");
  var liveFooter = document.getElementById("fhSdLiveFooter");
  var chartContractLabel = document.getElementById("fhSdChartContractLabel");
  var chartHint = document.getElementById("fhSdChartRangeHint");
  var statOpen = document.getElementById("fhSdIceStatOpen");
  var statHigh = document.getElementById("fhSdIceStatHigh");
  var statLow = document.getElementById("fhSdIceStatLow");
  var statSettle = document.getElementById("fhSdIceStatSettle");

  function contractLabel(id) {
    for (var i = 0; i < contracts.length; i++) {
      if (contracts[i].id === id) return contracts[i].label;
    }
    return id || "ICE C";
  }

  function flashIce(direction) {
    if (!priceEl) return;
    priceEl.classList.remove("fh-sd-ice-price--up", "fh-sd-ice-price--down");
    if (direction === "up") priceEl.classList.add("fh-sd-ice-price--up");
    else if (direction === "down") priceEl.classList.add("fh-sd-ice-price--down");
    setTimeout(function () {
      priceEl.classList.remove("fh-sd-ice-price--up", "fh-sd-ice-price--down");
      priceEl.style.color = "#fff";
    }, 450);
  }

  function updateIceStatsFromSeries(series, openPx) {
    if (!series.length) return;
    var lo = Math.min.apply(null, series);
    var hi = Math.max.apply(null, series);
    var last = series[series.length - 1];
    if (statOpen) statOpen.textContent = openPx.toFixed(2);
    if (statHigh) statHigh.textContent = hi.toFixed(2);
    if (statLow) statLow.textContent = lo.toFixed(2);
    if (statSettle) statSettle.textContent = last.toFixed(2);
  }

  function renderIce(price, silent) {
    var chg = Math.round((price - openRef) * 100) / 100;
    var up = chg >= 0;
    if (priceEl) {
      priceEl.textContent = price.toFixed(2);
      priceEl.style.color = "";
    }
    if (chgArrow) chgArrow.textContent = up ? "▲" : "▼";
    if (chgNum) chgNum.textContent = Math.abs(chg).toFixed(2);
    if (chgNum && chgNum.parentElement) {
      chgNum.parentElement.style.color = up ? "var(--sd-positive)" : "var(--sd-accent)";
    }
    if (liveFooter) liveFooter.textContent = price.toFixed(2);
    if (!silent) flashIce(up ? "up" : "down");
  }

  function updateChartHint() {
    if (!chartHint || !data.length) return;
    var lo = Math.min.apply(null, data);
    var hi = Math.max.apply(null, data);
    var u = rangeKey === "24H" ? "Hourly" : "Daily-style";
    chartHint.innerHTML =
      u +
      " · Range: <strong style=\"color:var(--sd-accent)\">" +
      lo.toFixed(2) +
      "</strong> – <strong style=\"color:#27ae60\">" +
      hi.toFixed(2) +
      "</strong> ¢/lb";
  }

  var canvas = document.getElementById("fhSdIceCanvas");

  function drawChart() {
    if (!canvas || !data.length) return;
    var ctx = canvas.getContext("2d");
    var W = canvas.offsetWidth;
    var H = canvas.offsetHeight;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var pad = { top: 12, right: 12, bottom: 28, left: 44 };
    var chartW = W - pad.left - pad.right;
    var chartH = H - pad.top - pad.bottom;
    var minV = Math.min.apply(null, data) - 1.5;
    var maxV = Math.max.apply(null, data) + 1.5;
    var range = maxV - minV || 1;
    var lastI = data.length - 1;

    function xScale(i) {
      return pad.left + (lastI ? (i / lastI) * chartW : chartW / 2);
    }
    function yScale(v) {
      return pad.top + chartH - ((v - minV) / range) * chartH;
    }

    ctx.clearRect(0, 0, W, H);

    var ticks = 4;
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 1;
    for (var t = 0; t <= ticks; t++) {
      var v = minV + (range / ticks) * t;
      var y = yScale(v);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();
      ctx.fillStyle = "#9ca3af";
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(v.toFixed(1), pad.left - 6, y + 3);
    }

    var xlabs = xLabelsForRange(rangeKey, data.length);
    ctx.fillStyle = "#9ca3af";
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "center";
    for (var xi = 0; xi < xlabs.length; xi++) {
      var L = xlabs[xi];
      var x = xScale(L.i);
      ctx.fillText(L.t, x, H - 6);
    }

    var grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, "rgba(0,150,186,0.18)");
    grad.addColorStop(1, "rgba(0,150,186,0.01)");
    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(data[0]));
    for (var i = 1; i < data.length; i++) {
      ctx.lineTo(xScale(i), yScale(data[i]));
    }
    ctx.lineTo(xScale(data.length - 1), pad.top + chartH);
    ctx.lineTo(xScale(0), pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(data[0]));
    for (var j = 1; j < data.length; j++) {
      ctx.lineTo(xScale(j), yScale(data[j]));
    }
    ctx.strokeStyle = "#0096ba";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.stroke();

    var lastX = xScale(data.length - 1);
    var lastY = yScale(data[data.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#0096ba";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#0096ba";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(data[data.length - 1].toFixed(2), lastX - 6, lastY - 8);
  }

  function onContractChange() {
    if (!selectEl) return;
    selectedContractId = selectEl.value;
    openRef = contractBasePrice(selectedContractId) - 1.25;
    data = buildSeries(selectedContractId, rangeKey);
    icePrice = data[data.length - 1];
    if (chartContractLabel) chartContractLabel.textContent = contractLabel(selectedContractId);
    renderIce(icePrice, true);
    updateIceStatsFromSeries(data, openRef);
    updateChartHint();
    drawChart();
  }

  function onRangeChange(btn) {
    rangeKey = btn.getAttribute("data-range") || "24H";
    root.querySelectorAll(".fh-sd-range-btn").forEach(function (b) {
      b.classList.toggle("active", b === btn);
    });
    data = buildSeries(selectedContractId, rangeKey);
    icePrice = data[data.length - 1];
    updateIceStatsFromSeries(data, openRef);
    updateChartHint();
    drawChart();
  }

  if (selectEl) {
    selectEl.addEventListener("change", onContractChange);
  }

  root.querySelectorAll(".fh-sd-range-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      onRangeChange(btn);
    });
  });

  setInterval(function () {
    var delta = (Math.random() - 0.49) * 0.55;
    icePrice = Math.round((icePrice + delta) * 100) / 100;
    if (data.length) data[data.length - 1] = icePrice;
    renderIce(icePrice, false);
    updateIceStatsFromSeries(data, openRef);
    drawChart();
  }, 3500);

  window.addEventListener("resize", drawChart);
  onContractChange();

  var OVERVIEW_PAGE_SIZE = 6;

  function renderOverviewPage(panel) {
    var scroll = panel.querySelector(".fh-sd-overview-scroll");
    var pag = panel.querySelector(".fh-sd-overview-pagination");
    if (!scroll || !pag) return;
    var rows = scroll.querySelectorAll("tbody tr");
    var n = rows.length;
    var pages = Math.max(1, Math.ceil(n / OVERVIEW_PAGE_SIZE));
    var cur = panel._sdPage || 1;
    if (cur > pages) cur = pages;
    if (cur < 1) cur = 1;
    panel._sdPage = cur;
    var start = (cur - 1) * OVERVIEW_PAGE_SIZE;
    var end = start + OVERVIEW_PAGE_SIZE;
    for (var i = 0; i < rows.length; i++) {
      rows[i].classList.toggle("fh-sd-row-page-hidden", i < start || i >= end);
    }
    var curEl = pag.querySelector(".fh-sd-page-cur");
    var totEl = pag.querySelector(".fh-sd-page-tot");
    var prev = pag.querySelector('[data-page-dir="prev"]');
    var next = pag.querySelector('[data-page-dir="next"]');
    if (curEl) curEl.textContent = String(cur);
    if (totEl) totEl.textContent = String(pages);
    if (prev) prev.disabled = cur <= 1;
    if (next) next.disabled = cur >= pages;
    pag.classList.toggle("fh-sd-pagination--hidden", n <= OVERVIEW_PAGE_SIZE);
  }

  /* Overview tabs */
  root.querySelectorAll(".fh-sd-overview-tab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-overview-tab");
      root.querySelectorAll(".fh-sd-overview-tab").forEach(function (b) {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      root.querySelectorAll(".fh-sd-overview-panel").forEach(function (p) {
        var on = p.getAttribute("data-overview-panel") === id;
        p.classList.toggle("active", on);
        if (on) {
          p.removeAttribute("hidden");
          p._sdPage = 1;
          renderOverviewPage(p);
        } else {
          p.setAttribute("hidden", "");
        }
      });
    });
  });

  root.querySelectorAll(".fh-sd-kpi-mini").forEach(function (card) {
    card.addEventListener("click", function () {
      var href = card.getAttribute("data-href");
      if (href) {
        window.location.href = href;
        return;
      }
      var id = card.getAttribute("data-overview-jump");
      if (!id) return;
      var tab = root.querySelector('.fh-sd-overview-tab[data-overview-tab="' + id + '"]');
      if (tab) tab.click();
    });
  });

  root.querySelectorAll(".fh-sd-overview-panel").forEach(function (panel) {
    panel._sdPage = 1;
    renderOverviewPage(panel);
  });

  root.addEventListener("click", function (ev) {
    var btn = ev.target.closest(".fh-sd-page-btn");
    if (!btn || !root.contains(btn)) return;
    var panel = btn.closest(".fh-sd-overview-panel");
    if (!panel) return;
    var scroll = panel.querySelector(".fh-sd-overview-scroll");
    if (!scroll) return;
    var rows = scroll.querySelectorAll("tbody tr");
    var pages = Math.max(1, Math.ceil(rows.length / OVERVIEW_PAGE_SIZE));
    var cur = panel._sdPage || 1;
    var dir = btn.getAttribute("data-page-dir");
    if (dir === "prev") cur = Math.max(1, cur - 1);
    else if (dir === "next") cur = Math.min(pages, cur + 1);
    panel._sdPage = cur;
    renderOverviewPage(panel);
  });
})();
