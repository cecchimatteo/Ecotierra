(function () {
  var root = document.getElementById("fhPoModule");
  if (!root) return;

  var dataEl = document.getElementById("fhPoDataJson");
  var metaEl = document.getElementById("fhPoMetaJson");
  var PO_DATA = [];
  /** KPI deep-link: ?lots_pending=1 */
  var lotsPendingFromQuery = false;
  var META = { fixation_url: "/sourcing/fixation/", lot_intake_url: "/sourcing/lot-intake/" };
  try {
    PO_DATA = dataEl ? JSON.parse(dataEl.textContent || "[]") : [];
  } catch (e) {
    PO_DATA = [];
  }
  try {
    META = metaEl ? Object.assign(META, JSON.parse(metaEl.textContent || "{}")) : META;
  } catch (e2) {}

  var DISCREPANCY_THRESHOLD = 0.5;

  var DELIVERY_LABELS = {
    pending_contract: "Pending Contract",
    open: "Open",
    partially_delivered: "Partially Delivered",
    fully_delivered: "Fully Delivered",
    cancelled: "Cancelled",
  };

  var FIXATION_LABELS = {
    gate_blocked: "Gate Blocked",
    gate_cleared_not_submitted: "Gate Cleared, Not Submitted",
    partially_fixed: "Partially Fixed",
    fully_fixed: "Fully Fixed",
    has_expired_orders: "Has Expired Orders",
  };

  var OVERALL_LABELS = {
    active: "Active",
    awaiting_fixation: "Awaiting Fixation",
    closed: "Closed",
    cancelled: "Cancelled",
  };

  var listBody = document.getElementById("fhPoListBody");
  var listRoot = document.getElementById("fhPoListRoot");
  var detailRoot = document.getElementById("fhPoDetailRoot");
  var backBtn = document.getElementById("fhPoBackToList");
  var countEl = document.getElementById("fhPoResultCount");

  var searchFieldEl = document.getElementById("unifiedSearchField");
  var searchInputEl = document.getElementById("unifiedSearchInput");
  var searchDropdownEl = document.getElementById("searchDropdown");
  var lockedFiltersEl = document.getElementById("lockedFilters");
  var lockedFiltersCountEl = document.getElementById("lockedFiltersCount");
  var andBtn = document.getElementById("filterLogicAND");
  var orBtn = document.getElementById("filterLogicOR");
  var clearFiltersBtn = document.getElementById("clearAllFilters");
  var poDateFromEl = document.getElementById("unifiedPoDateFrom");
  var poDateToEl = document.getElementById("unifiedPoDateTo");
  var expiredOnlyEl = document.getElementById("unifiedOverdueOnly");
  var gateClearedOnlyEl = document.getElementById("unifiedGateClearedOnly");
  var approachingGateOnlyEl = document.getElementById("unifiedApproachingGateOnly");
  var kpiTotalCountEl = document.getElementById("fhPoKpiTotalCount");
  var kpiTotalValueEl = document.getElementById("fhPoKpiTotalValue");
  var kpiOpenCountEl = document.getElementById("fhPoKpiOpenCount");
  var kpiOpenValueEl = document.getElementById("fhPoKpiOpenValue");

  var selectedId = null;
  var filterLogic = "AND";
  var searchTimeout = null;
  var lockedFilters = {
    suppliers: [],
    coffees: [],
    certifications: [],
    delivery_statuses: [],
    fixation_statuses: [],
    overall_statuses: [],
  };

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Match sourcing dashboard Overview status pills (fh-sd-pill). */
  function deliveryPillClass(key) {
    var map = {
      cancelled: "fh-sd-pill fh-sd-pill--cancelled",
      fully_delivered: "fh-sd-pill fh-sd-pill--fully_fixed",
      partially_delivered: "fh-sd-pill fh-sd-pill--partially_fixed",
      open: "fh-sd-pill fh-sd-pill--active",
      pending_contract: "fh-sd-pill fh-sd-pill--not_ready",
    };
    return map[key] || "fh-sd-pill fh-sd-pill--pending_delivery";
  }

  function fixationPillClass(key) {
    var map = {
      gate_blocked: "fh-sd-pill fh-sd-pill--not_ready",
      gate_cleared_not_submitted: "fh-sd-pill fh-sd-pill--action_needed",
      has_expired_orders: "fh-sd-pill fh-sd-pill--expired",
      partially_fixed: "fh-sd-pill fh-sd-pill--partially_fixed",
      fully_fixed: "fh-sd-pill fh-sd-pill--fully_fixed",
    };
    return map[key] || "fh-sd-pill fh-sd-pill--not_ready";
  }

  function overallPillClass(key) {
    var map = {
      closed: "fh-sd-pill fh-sd-pill--fully_fixed",
      cancelled: "fh-sd-pill fh-sd-pill--cancelled",
      awaiting_fixation: "fh-sd-pill fh-sd-pill--negotiating",
      active: "fh-sd-pill fh-sd-pill--active",
    };
    return map[key] || "fh-sd-pill fh-sd-pill--pending_delivery";
  }

  function uniqueSorted(arr) {
    return Array.from(new Set(arr.filter(Boolean))).sort(function (a, b) {
      return String(a).localeCompare(String(b));
    });
  }

  function getFilterDefinitions() {
    return [
      {
        type: "suppliers",
        field: "supplier",
        label: "Supplier",
        values: uniqueSorted(
          PO_DATA.map(function (p) {
            return p.supplier_name;
          })
        ),
      },
      {
        type: "coffees",
        field: "coffee",
        label: "Coffee",
        values: uniqueSorted(
          PO_DATA.map(function (p) {
            return p.coffee_display;
          })
        ),
      },
      {
        type: "certifications",
        field: "certification",
        label: "Certification",
        values: uniqueSorted(
          PO_DATA.map(function (p) {
            return p.certification || "None";
          })
        ),
      },
      {
        type: "delivery_statuses",
        field: "delivery_status",
        label: "Delivery Status",
        values: Object.keys(DELIVERY_LABELS).map(function (k) {
          return DELIVERY_LABELS[k];
        }),
      },
      {
        type: "fixation_statuses",
        field: "fixation_status",
        label: "Fixation Status",
        values: Object.keys(FIXATION_LABELS).map(function (k) {
          return FIXATION_LABELS[k];
        }),
      },
      {
        type: "overall_statuses",
        field: "overall_status",
        label: "Overall Status",
        values: Object.keys(OVERALL_LABELS).map(function (k) {
          return OVERALL_LABELS[k];
        }),
      },
    ];
  }

  function getSearchResults(query, field) {
    var q = String(query || "").trim().toLowerCase();
    if (q.length < 2) return [];
    var defs = getFilterDefinitions();
    if (field) {
      defs = defs.filter(function (d) {
        return d.field === field;
      });
    }
    var out = [];
    defs.forEach(function (def) {
      def.values.forEach(function (value) {
        if (String(value).toLowerCase().indexOf(q) >= 0) {
          out.push({
            type: def.type,
            typeLabel: def.label,
            value: value,
          });
        }
      });
    });
    return out.slice(0, 40);
  }

  function displaySearchResults(results) {
    if (!searchDropdownEl) return;
    searchDropdownEl.innerHTML = "";
    if (!results.length) {
      searchDropdownEl.innerHTML =
        '<div class="fh-po-search-empty">No results found</div>';
      searchDropdownEl.style.display = "block";
      return;
    }
    results.forEach(function (item) {
      var row = document.createElement("button");
      row.type = "button";
      row.className = "fh-po-search-item";
      row.innerHTML =
        "<strong>" +
        escapeHtml(item.value) +
        '</strong> <span>' +
        escapeHtml(item.typeLabel) +
        "</span>";
      row.addEventListener("click", function () {
        lockFilter(item.type, item.value);
        if (searchInputEl) searchInputEl.value = "";
        searchDropdownEl.style.display = "none";
      });
      searchDropdownEl.appendChild(row);
    });
    searchDropdownEl.style.display = "block";
  }

  function lockFilter(type, value) {
    if (!lockedFilters[type]) return;
    if (lockedFilters[type].indexOf(value) >= 0) {
      unlockFilter(type, value);
      return;
    }
    lockedFilters[type].push(value);
    renderLockedFilters();
    renderList();
    updateUrlFromFilters();
  }

  function unlockFilter(type, value) {
    if (!lockedFilters[type]) return;
    lockedFilters[type] = lockedFilters[type].filter(function (v) {
      return v !== value;
    });
    renderLockedFilters();
    renderList();
    updateUrlFromFilters();
  }

  function renderLockedFilters() {
    if (!lockedFiltersEl) return;
    lockedFiltersEl.innerHTML = "";
    var count = 0;
    Object.keys(lockedFilters).forEach(function (k) {
      count += lockedFilters[k].length;
    });
    if (lockedFiltersCountEl) lockedFiltersCountEl.textContent = String(count);
    if (!count) {
      lockedFiltersEl.innerHTML =
        '<div class="fh-po-search-empty">No active filters</div>';
      return;
    }
    var labels = {
      suppliers: "Supplier",
      coffees: "Coffee",
      certifications: "Certification",
      delivery_statuses: "Delivery",
      fixation_statuses: "Fixation",
      overall_statuses: "Overall",
    };
    Object.keys(lockedFilters).forEach(function (type) {
      lockedFilters[type].forEach(function (value) {
        var chip = document.createElement("span");
        chip.className = "fh-po-locked-chip";
        chip.innerHTML =
          "<strong>" +
          escapeHtml(labels[type] || type) +
          ":</strong> " +
          escapeHtml(value) +
          ' <button type="button" aria-label="Remove filter">×</button>';
        chip.querySelector("button").addEventListener("click", function () {
          unlockFilter(type, value);
        });
        lockedFiltersEl.appendChild(chip);
      });
    });
  }

  function rowMatchesLockedFilters(row) {
    var checks = [];
    if (lockedFilters.suppliers.length) {
      checks.push(lockedFilters.suppliers.indexOf(row.supplier_name) >= 0);
    }
    if (lockedFilters.coffees.length) {
      checks.push(lockedFilters.coffees.indexOf(row.coffee_display) >= 0);
    }
    if (lockedFilters.certifications.length) {
      checks.push(
        lockedFilters.certifications.indexOf(row.certification || "None") >= 0
      );
    }
    if (lockedFilters.delivery_statuses.length) {
      checks.push(
        lockedFilters.delivery_statuses.indexOf(
          DELIVERY_LABELS[row.delivery_status] || row.delivery_status
        ) >= 0
      );
    }
    if (lockedFilters.fixation_statuses.length) {
      checks.push(
        lockedFilters.fixation_statuses.indexOf(
          FIXATION_LABELS[row.fixation_status] || row.fixation_status
        ) >= 0
      );
    }
    if (lockedFilters.overall_statuses.length) {
      checks.push(
        lockedFilters.overall_statuses.indexOf(
          OVERALL_LABELS[row.overall_status] || row.overall_status
        ) >= 0
      );
    }
    if (!checks.length) return true;
    if (filterLogic === "OR") {
      return checks.some(Boolean);
    }
    return checks.every(Boolean);
  }

  function passesFilters(row) {
    if (!rowMatchesLockedFilters(row)) return false;
    if (poDateFromEl && poDateFromEl.value && row.po_date < poDateFromEl.value) return false;
    if (poDateToEl && poDateToEl.value && row.po_date > poDateToEl.value) return false;
    if (expiredOnlyEl && expiredOnlyEl.checked && row.fixation_status !== "has_expired_orders") return false;
    if (
      gateClearedOnlyEl &&
      gateClearedOnlyEl.checked &&
      row.fixation_status !== "gate_cleared_not_submitted"
    )
      return false;
    if (approachingGateOnlyEl && approachingGateOnlyEl.checked && !row.approaching_gate) return false;
    if (lotsPendingFromQuery && !row.lots_pending_delivery) return false;
    return true;
  }

  function totalQty(rows) {
    return rows.reduce(function (sum, r) {
      return sum + Number(r.contracted_qq || 0);
    }, 0);
  }

  function updateKpis() {
    var totalCount = PO_DATA.length;
    var totalValue = totalQty(PO_DATA);
    var openRows = PO_DATA.filter(function (r) {
      return r.delivery_status !== "fully_delivered" && r.delivery_status !== "cancelled";
    });
    var openCount = openRows.length;
    var openValue = totalQty(openRows);
    if (kpiTotalCountEl) kpiTotalCountEl.textContent = String(totalCount);
    if (kpiTotalValueEl)
      kpiTotalValueEl.textContent = totalValue.toLocaleString();
    if (kpiOpenCountEl) kpiOpenCountEl.textContent = String(openCount);
    if (kpiOpenValueEl) kpiOpenValueEl.textContent = openValue.toLocaleString();
  }

  function sortRows(rows) {
    return rows.slice().sort(function (a, b) {
      var pa = a.fixation_status === "gate_cleared_not_submitted" ? 0 : 1;
      var pb = b.fixation_status === "gate_cleared_not_submitted" ? 0 : 1;
      if (pa !== pb) return pa - pb;
      var da = a.expected_delivery_iso || "";
      var db = b.expected_delivery_iso || "";
      return da.localeCompare(db);
    });
  }

  function originChip(row) {
    var label = row.origin_id;
    var path =
      row.origin_kind === "requirement"
        ? "#origin-requirement"
        : "#origin-offer";
    return (
      '<a href="' +
      path +
      '" class="fh-po-chip" title="Origin record (placeholder link)">' +
      '<i class="bi bi-link-45deg" aria-hidden="true"></i>' +
      escapeHtml(label) +
      "</a>"
    );
  }

  function renderList() {
    if (!listBody) return;
    var filtered = PO_DATA.filter(function (r) {
      return passesFilters(r);
    });
    var rows = sortRows(filtered);
    if (countEl) {
      countEl.textContent =
        rows.length === PO_DATA.length
          ? rows.length + " purchase orders"
          : rows.length + " of " + PO_DATA.length + " purchase orders";
    }
    var html = "";
    for (var i = 0; i < rows.length; i++) {
      var p = rows[i];
      html +=
        '<tr tabindex="0" role="button" data-po-id="' +
        escapeHtml(p.id) +
        '" class="fh-sd-row-clickable' +
        (selectedId === p.id ? " fh-po-row-selected" : "") +
        '">';
      html +=
        '<td><span class="fh-sd-mono fw-semibold" style="color: var(--sd-secondary);">' +
        escapeHtml(p.id) +
        "</span></td>";
      html += "<td>" + escapeHtml(p.supplier_name) + "</td>";
      html += "<td>" + escapeHtml(p.coffee_display) + "</td>";
      html +=
        '<td class="num">' + escapeHtml(p.contracted_display) + "</td>";
      html += "<td>" + escapeHtml(p.buying_differential) + "</td>";
      html += "<td>" + escapeHtml(p.expected_delivery_label) + "</td>";
      html += '<td><div class="fh-po-badge-pair"><span class="' +
        deliveryPillClass(p.delivery_status) +
        '">' +
        escapeHtml(DELIVERY_LABELS[p.delivery_status] || p.delivery_status) +
        "</span></div></td>";
      html += '<td><div class="fh-po-badge-pair"><span class="' +
        fixationPillClass(p.fixation_status) +
        '">' +
        escapeHtml(FIXATION_LABELS[p.fixation_status] || p.fixation_status) +
        "</span></div></td>";
      html += '<td class="num">' + escapeHtml(String(p.days_open)) + "</td>";
      html += "<td>" + originChip(p) + "</td>";
      html +=
        '<td class="text-end fh-po-row-actions"><button type="button" class="btn-sd-outline btn-sd-outline-sm" data-act="detail">View</button>';
      html +=
        '<div class="dropdown fh-po-row-menu"><button class="btn-sd-outline btn-sd-outline-sm fh-po-menu-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="More row actions"><i class="bi bi-three-dots"></i></button>';
      html += '<ul class="dropdown-menu dropdown-menu-end">';
      html += '<li><button type="button" class="dropdown-item" data-act="fixation">Jump to fixation</button></li>';
      html += '<li><button type="button" class="dropdown-item" data-act="lots">Jump to lots</button></li>';
      if (p.cancel_permitted) {
        html +=
          '<li><hr class="dropdown-divider"></li><li><button type="button" class="dropdown-item text-danger" data-act="cancel">Cancel PO</button></li>';
      }
      html += "</ul></div></td></tr>";
    }
    listBody.innerHTML = html;
  }

  function findPo(id) {
    for (var i = 0; i < PO_DATA.length; i++) {
      if (PO_DATA[i].id === id) return PO_DATA[i];
    }
    return null;
  }

  function setDetailVisible(on) {
    if (detailRoot) detailRoot.hidden = !on;
    if (listRoot) listRoot.hidden = on;
    if (backBtn) backBtn.hidden = !on;
  }

  function contractStatusLabel(c) {
    if (!c) return "Unknown";
    if (c.status === "signed_uploaded") return "Signed & Uploaded";
    return "Pending Signature";
  }

  function invoiceGateBadge(st) {
    var ok = st === "cleared";
    return ok ? "Gate Cleared" : "Gate Blocked";
  }

  function renderDetail(po) {
    if (!detailRoot || !po) return;
    var sum = po.fixation_summary || {};
    var alloc = typeof po.allocated_qq_total === "number" ? po.allocated_qq_total : 0;
    var overUnder =
      alloc > po.contracted_qq
        ? '<span class="fh-po-flag-warn ms-2">Allocation exceeds contracted volume.</span>'
        : alloc < po.contracted_qq
          ? '<span class="fh-po-flag-warn ms-2">Allocation under-contracted volume.</span>'
          : "";

    var lots = po.lots || [];
    var pending =
      po.pending_delivery_labels && po.pending_delivery_labels.length
        ? po.pending_delivery_labels
        : [];
    var planned = po.planned_deliveries || 0;
    var recvCnt = lots.length;
    var recvQcPassed = lots.filter(function (l) {
      return l.recv_qc === "Passed";
    }).length;
    var postPassed = lots.filter(function (l) {
      return l.post_qc === "Passed";
    }).length;

    var invRows = "";
    (po.invoices || []).forEach(function (inv) {
      invRows +=
        "<tr><td>" +
        escapeHtml(inv.invoice_id) +
        "</td><td>" +
        escapeHtml(inv.classification) +
        "</td><td>" +
        escapeHtml(inv.allocated_volume) +
        '</td><td><span class="fh-sd-pill fh-sd-pill--active">' +
        escapeHtml(inv.invoice_status) +
        '</span></td><td><span class="' +
        (inv.gate_status === "cleared"
          ? "fh-sd-pill fh-sd-pill--confirmed"
          : "fh-sd-pill fh-sd-pill--not_ready") +
        '">' +
        escapeHtml(invoiceGateBadge(inv.gate_status)) +
        "</span></td></tr>";
    });

    var lotRows = "";
    lots.forEach(function (l) {
      var disc =
        typeof l.discrepancy_pct === "number"
          ? l.discrepancy_pct.toFixed(2) + "%"
          : "—";
      var trClass =
        typeof l.discrepancy_pct === "number" &&
        l.discrepancy_pct > DISCREPANCY_THRESHOLD
          ? ' class="fh-po-discrepancy-warn"'
          : "";
      lotRows += "<tr" + trClass + "><td>" + escapeHtml(l.lot_id) + "</td>";
      lotRows += "<td>" + escapeHtml(l.delivery_date) + "</td>";
      lotRows += "<td>" + escapeHtml(l.truck_weight) + "</td>";
      lotRows += "<td>" + escapeHtml(l.mill_weight) + "</td>";
      lotRows += "<td>" + escapeHtml(disc) + "</td>";
      lotRows +=
        "<td>" +
        escapeHtml(l.humidity_pct == null ? "" : String(l.humidity_pct)) +
        "</td>";
      lotRows +=
        "<td>" +
        escapeHtml(l.water_activity == null ? "" : String(l.water_activity)) +
        "</td>";
      lotRows += "<td>" + escapeHtml(l.stage) + "</td>";
      lotRows +=
        '<td><span class="fh-sd-pill fh-sd-pill--not_ready">' +
        escapeHtml(l.recv_qc) +
        "</span></td>";
      lotRows +=
        "<td>" +
        escapeHtml(l.recv_qc_date || "") +
        "</td>";
      lotRows +=
        '<td><span class="fh-sd-pill fh-sd-pill--not_ready">' +
        escapeHtml(l.post_qc) +
        "</span></td>";
      lotRows +=
        "<td>" +
        escapeHtml(l.post_qc_date || "") +
        "</td>";
      lotRows +=
        "<td>" +
        escapeHtml(l.days_in_stage == null ? "" : String(l.days_in_stage)) +
        "</td></tr>";
    });
    for (var pi = 0; pi < pending.length; pi++) {
      lotRows +=
        '<tr class="fh-po-placeholder-row"><td colspan="12">Pending delivery — ' +
        escapeHtml(pending[pi]) +
        "</td></tr>";
    }

    var gateHtml = "";
    (po.gate_checklists || []).forEach(function (g) {
      gateHtml += '<div class="fh-po-gate-card"><h4>' + escapeHtml(g.invoice_id);
      gateHtml +=
        ' <span class="text-muted small">(' +
        escapeHtml(g.classification) +
        ")</span></h4>";
      (g.conditions || []).forEach(function (c) {
        var icon = c.ok ? "bi-check-circle-fill" : "bi-x-circle-fill";
        var note = c.completed_at
          ? ' <span class="text-muted">· ' + escapeHtml(c.completed_at) + "</span>"
          : "";
        gateHtml +=
          '<div class="fh-po-gate-row"><i class="bi ' +
          icon +
          '" aria-hidden="true"></i><div><strong>' +
          escapeHtml(c.label) +
          "</strong>" +
          note +
          "</div></div>";
      });
      gateHtml += "</div>";
    });

    var fxRows = "";
    (po.fixation_records || []).forEach(function (fx) {
      fxRows +=
        "<tr><td>" +
        escapeHtml(fx.fix_id) +
        "</td><td>" +
        escapeHtml((fx.target_invoices || []).join(", ")) +
        "</td><td>" +
        escapeHtml(fx.order_type) +
        "</td><td>" +
        escapeHtml(fx.requested_level || "—") +
        "</td><td>" +
        escapeHtml(fx.futures_month) +
        "</td><td>" +
        escapeHtml(String(fx.volume_ice_lots)) +
        "</td><td>" +
        escapeHtml(fx.status) +
        "</td><td>" +
        escapeHtml(fx.submission_date || "") +
        "</td><td>" +
        escapeHtml(fx.execution_date || "") +
        "</td><td>" +
        escapeHtml(fx.expiry_date || "") +
        "</td></tr>";
    });

    var logHtml = "";
    var log = (po.activity_log || []).slice().reverse();
    log.forEach(function (e) {
      logHtml +=
        '<div class="fh-po-activity-item"><time>' +
        escapeHtml(e.at) +
        " · " +
        escapeHtml(e.actor) +
        "</time><div>" +
        escapeHtml(e.message) +
        "</div></div>";
    });

    var c = po.contract || {};
    var avgPx =
      sum.avg_fixed_price_per_lb != null ? String(sum.avg_fixed_price_per_lb) : "—";

    var html =
      '<div class="fh-sd-card-header fh-po-detail-hero">' +
      '<div class="fh-po-detail-hero-text">' +
      '<div class="fh-sd-kpi-label text-uppercase small">Purchase order</div>' +
      '<h2 class="mb-1" style="font-size: 1.35rem; font-weight: 700; color: #2c3e50;">' +
      escapeHtml(po.id) +
      "</h2>";
    html +=
      '<div class="fh-sd-kpi-sub">' +
      "PO date " +
      escapeHtml(po.po_date) +
      " · " +
      escapeHtml(String(po.days_open)) +
      ' days open</div><div class="mt-2">' +
      originChip(po) +
      "</div>" +
      "</div>";
    html += '<div class="fh-po-detail-badges-top">';
    html +=
      '<span class="' +
      overallPillClass(po.overall_status) +
      '">' +
      escapeHtml(OVERALL_LABELS[po.overall_status] || po.overall_status) +
      "</span>";
    html +=
      '<span class="' +
      deliveryPillClass(po.delivery_status) +
      '">' +
      escapeHtml(DELIVERY_LABELS[po.delivery_status] || po.delivery_status) +
      "</span>";
    html +=
      '<span class="' +
      fixationPillClass(po.fixation_status) +
      '">' +
      escapeHtml(FIXATION_LABELS[po.fixation_status] || po.fixation_status) +
      "</span>";
    html += "</div></div>";

    html +=
      '<div class="fh-po-detail-toolbar">' +
      '<button type="button" class="btn-sd-outline btn-sd-outline-sm" data-ha="upload-contract"><i class="bi bi-upload"></i> Upload contract</button> ';
    html +=
      '<button type="button" class="btn-sd-outline btn-sd-outline-sm" data-ha="edit-delivery"><i class="bi bi-calendar-event"></i> Edit expected delivery</button> ';
    html +=
      '<button type="button" class="btn-sd-secondary" data-ha="receive"><i class="bi bi-box-arrow-in-down"></i> Receive lot</button> ';
    html +=
      '<button type="button" class="btn-sd-primary" data-ha="fixation-submit"><i class="bi bi-lightning-fill"></i> Submit fixation</button> ';
    if (po.cancel_permitted) {
      html +=
        '<button type="button" class="btn btn-outline-danger btn-sm ms-auto" data-ha="cancel-po"><i class="bi bi-x-octagon"></i> Cancel PO</button>';
    }
    html += "</div>";

    html +=
      '<div class="fh-po-detail-body">' +
      '<section class="fh-po-section"><h3><i class="bi bi-info-circle" style="color: var(--sd-secondary);"></i> Basic Information</h3>';
    html += '<dl class="fh-po-kv-grid">';
    html += "<dt>Supplier</dt><dd><a href=\"#supplier-registry\">" + escapeHtml(po.supplier_name) + "</a></dd>";
    html += "<dt>Coffee type / variety</dt><dd>" + escapeHtml(po.coffee_display) + "</dd>";
    html +=
      "<dt>Contracted quantity</dt><dd>" + escapeHtml(po.contracted_display) + "</dd>";
    html +=
      "<dt>Buying differential</dt><dd>" +
      escapeHtml(po.buying_differential) +
      " <span class='text-muted'>(locked)</span></dd>";
    html +=
      "<dt>Expected delivery</dt><dd>" +
      escapeHtml(po.expected_delivery_label) +
      "</dd>";
    html += "</dl></section>";

    html +=
      '<section class="fh-po-section"><h3><i class="bi bi-file-text" style="color: var(--sd-secondary);"></i> Contractual</h3>';
    html += '<div class="mb-3 small">';
    html +=
      "<strong>Contract status:</strong> " +
      escapeHtml(contractStatusLabel(c));
    if (c.upload_actor) html += " · Uploaded by " + escapeHtml(c.upload_actor);
    if (c.uploaded_at) html += " on " + escapeHtml(c.uploaded_at);
    html += "</div>";
    html +=
      c.file_label
        ? '<p class="small"><a href="#">' +
          escapeHtml(c.file_label) +
          '</a> <span class="text-muted">(download placeholder)</span></p>'
        : '<p class="small text-muted">No signed document on file.</p>';

    html += '<div class="fh-po-summary-line"><strong>Linked Invoices · allocation</strong>';
    html +=
      "Allocated <strong>" +
      escapeHtml(String(alloc)) +
      '</strong> QQ vs contracted <strong>' +
      escapeHtml(String(po.contracted_qq)) +
      "</strong> QQ." +
      overUnder +
      "</div>";
    html +=
      '<div class="table-responsive"><table class="fh-sd-table fh-sd-overview-table fh-po-detail-table">';
    html +=
      "<thead><tr><th>Invoice ID</th><th>Classification</th><th>Allocated Volume</th><th>Invoice Status</th><th>Per-invoice Gate</th></tr></thead>";
    html += "<tbody>" + (invRows || '<tr><td colspan="5" class="text-muted">No allocations yet.</td></tr>');
    html += "</tbody></table></div>";
    html +=
      '<p class="small text-muted mb-0 mt-2">Sell-side identifiers and commercial terms are withheld per information barrier.</p>';
    html += "</section>";

    html +=
      '<section class="fh-po-section"><h3><i class="bi bi-truck" style="color: var(--sd-secondary);"></i> Delivery</h3>';
    html +=
      '<p class="small mb-3"><strong>' +
      escapeHtml(String(recvCnt)) +
      " of " +
      escapeHtml(String(planned)) +
      '</strong> deliveries received · <strong>' +
      escapeHtml(String(recvQcPassed)) +
      " of " +
      escapeHtml(String(recvCnt)) +
      '</strong> cleared Receiving QC · <strong>' +
      escapeHtml(String(postPassed)) +
      " of " +
      escapeHtml(String(recvCnt)) +
      "</strong> cleared Post-Milling QC</p>";
    html +=
      '<div class="table-responsive"><table class="fh-sd-table fh-sd-overview-table fh-po-detail-table">';
    html +=
      "<thead><tr><th>Lot ID</th><th>Delivery Date</th><th>Truck Weight</th><th>Mill Weight</th><th>Disc.</th>";
    html +=
      "<th>Humidity %</th><th>H₂O Activity</th><th>Lot Stage</th>";
    html +=
      "<th>Recv QC</th><th>Recv QC Date</th><th>Post QC</th><th>Post QC Date</th><th>Days in Stage</th></tr></thead>";
    html += "<tbody>" + (lotRows || '<tr><td colspan="12" class="text-muted">No physical lots recorded.</td></tr>');
    html += "</tbody></table></div>";
    html +=
      '<p class="small text-muted"><strong>Note:</strong> SM sees QC pass/fail only — grading detail is withheld.</p></section>';

    html +=
      '<section class="fh-po-section"><h3><i class="bi bi-lightning-fill" style="color: var(--sd-secondary);"></i> Fixation</h3>';
    html += '<p class="small text-muted mb-2">Gate checklist is evaluated per Invoice (classification-dependent).</p>';
    html += gateHtml || '<p class="small text-muted">No gate rows yet.</p>';
    html +=
      '<button type="button" class="btn-sd-primary mt-3 mb-2" style="font-size: 13px; padding: 6px 14px;" data-ha="fixation-submit"><i class="bi bi-send"></i> Submit new fixation</button>';
    html +=
      '<div class="table-responsive mb-4"><table class="fh-sd-table fh-sd-overview-table fh-po-detail-table">';
    html +=
      "<thead><tr><th>FIX ID</th><th>Targets</th><th>Order Type</th><th>Requested Level</th><th>Futures Month</th><th>Vol (lots)</th><th>Status</th><th>Submitted</th><th>Executed</th><th>Expiry</th></tr></thead>";
    html +=
      "<tbody>" +
      (fxRows ||
        '<tr><td colspan="10" class="text-muted">No fixation submissions yet.</td></tr>') +
      "</tbody></table></div>";
    html += '<div class="row g-2 small">';
    html +=
      '<div class="col-md-4"><span class="fh-sd-kpi-label d-block">Contract volume</span><strong>' +
      escapeHtml(
        sum.contract_volume_ice_lots == null
          ? "—"
          : String(sum.contract_volume_ice_lots)
      ) +
      " ICE lots</strong></div>";
    html +=
      '<div class="col-md-4"><span class="fh-sd-kpi-label d-block">Active orders volume</span><strong>' +
      escapeHtml(
        sum.volume_in_active_orders == null
          ? "—"
          : String(sum.volume_in_active_orders)
      ) +
      "</strong></div>";
    html +=
      '<div class="col-md-4"><span class="fh-sd-kpi-label d-block">Executed volume</span><strong>' +
      escapeHtml(
        sum.volume_executed == null ? "—" : String(sum.volume_executed)
      ) +
      "</strong></div>";
    html +=
      '<div class="col-md-4"><span class="fh-sd-kpi-label d-block">Weighted avg fixed</span><strong>' +
      escapeHtml(avgPx) +
      " ¢/lb demo</strong></div>";
    html +=
      '<div class="col-md-4"><span class="fh-sd-kpi-label d-block">Unfixed balance</span><strong>' +
      escapeHtml(
        sum.unfixed_balance_ice_lots == null
          ? "—"
          : String(sum.unfixed_balance_ice_lots)
      ) +
      " ICE lots</strong></div>";
    html += "</div>";
    html +=
      '<p class="small text-muted mt-3 mb-0">Records are retracted upstream only — ElevaFinca advances orders after submission.</p></section>';

    html +=
      '<section class="fh-po-section"><h3><i class="bi bi-clock-history" style="color: var(--sd-secondary);"></i> Activity Log</h3>';
    html +=
      '<div class="fh-po-activity">' +
      (logHtml ||
        '<p class="text-muted small mb-0">No events recorded yet.</p>') +
      "</div>";
    html += "</section>";
    html += "</div>";

    detailRoot.innerHTML = html;

    var canSubmitFx = gatesClearedInvoices(po).length > 0;
    detailRoot.querySelectorAll('[data-ha="fixation-submit"]').forEach(function (btn) {
      btn.disabled = !canSubmitFx;
      btn.setAttribute(
        "title",
        canSubmitFx ? "Opens submit fixation modal" : "Blocked until at least one Invoice clears the gate."
      );
    });

    detailRoot.querySelectorAll("[data-ha]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var act = btn.getAttribute("data-ha");
        if (act === "receive") openReceiveModal(po);
        else if (act === "fixation-submit") openFixationModal(po);
        else if (act === "cancel-po") openCancelModal(po);
        else if (act === "upload-contract" || act === "edit-delivery")
          window.alert(
            act === "upload-contract"
              ? "Upload flow will open when storage is wired."
              : "Expected delivery edit is audited once backend events exist."
          );
      });
    });
  }

  function openReceiveModal(po) {
    var nextExpected =
      po.pending_delivery_labels && po.pending_delivery_labels[0]
        ? po.pending_delivery_labels[0]
        : po.expected_delivery_label;
    document.getElementById("fhPoRlPo").value = po.id;
    document.getElementById("fhPoRlSupplier").value = po.supplier_name;
    document.getElementById("fhPoRlCoffee").value = po.coffee_display;
    document.getElementById("fhPoRlExpected").value = nextExpected;
    document.getElementById("fhPoRlTruck").value = "";
    document.getElementById("fhPoRlMill").value = "";
    document.getElementById("fhPoRlHumid").value = "";
    document.getElementById("fhPoRlAw").value = "";
    document.getElementById("fhPoRlCondition").value = "";
    document.getElementById("fhPoRlNotes").value = "";
    document.getElementById("fhPoRlActualDate").value = new Date()
      .toISOString()
      .slice(0, 10);
    var m = bootstrap.Modal.getOrCreateInstance(
      document.getElementById("fhPoReceiveLotModal")
    );
    m.show();
    var form = document.getElementById("fhPoReceiveLotForm");
    form.onsubmit = function (ev) {
      ev.preventDefault();
      var truck = parseFloat(
        document.getElementById("fhPoRlTruck").value.replace(/[^0-9.]/g, "")
      );
      var mill = parseFloat(
        document.getElementById("fhPoRlMill").value.replace(/[^0-9.]/g, "")
      );
      var discPct =
        truck > 0 && mill > 0 ? (Math.abs(truck - mill) / truck) * 100 : 0;
      var msgs = [];
      if (discPct > DISCREPANCY_THRESHOLD)
        msgs.push(
          "Discrepancy " +
            discPct.toFixed(2) +
            "% exceeds " +
            DISCREPANCY_THRESHOLD +
            "% — flags to SM & Warehouse scheduled (demo)."
        );
      else msgs.push("Discrepancy within threshold.");
      msgs.push(
        "Receiving QC task stub · Warehouse ping · gate refresh scheduled (demo)."
      );
      window.alert(msgs.join("\n"));
      m.hide();
    };
    root.dataset.receivePoId = po.id;
  }

  function gatesClearedInvoices(po) {
    return (po.invoices || []).filter(function (i) {
      return i.gate_status === "cleared";
    });
  }

  function openFixationModal(po) {
    var clears = gatesClearedInvoices(po);
    if (!clears.length) {
      window.alert("No Invoice has cleared the gate — submission stays disabled.");
      return;
    }
    document.getElementById("fhPoFxPo").value = po.id;
    var invListEl = document.getElementById("fhPoFxInvoiceList");
    var lines = clears
      .map(function (x) {
        return (
          escapeHtml(x.invoice_id) +
          " · " +
          escapeHtml(x.classification) +
          ' · <span class="text-success">Gate Cleared</span>'
        );
      })
      .join("<br>");
    invListEl.innerHTML =
      "<strong class='small'>Gate-cleared invoices</strong><br><span class='small'>" +
      lines +
      "</span>";
    var box = document.getElementById("fhPoFxTargets");
    box.innerHTML = "";
    clears.forEach(function (inv) {
      var sid = escapeHtml(inv.invoice_id.replace(/[^A-Za-z0-9_-]+/g, "_"));
      box.innerHTML +=
        '<div class="form-check"><input class="form-check-input" type="checkbox" value="' +
        escapeHtml(inv.invoice_id) +
        '" id="fx_tgt_' +
        sid +
        '" checked> <label class="form-check-label" for="fx_tgt_' +
        sid +
        '">' +
        escapeHtml(inv.invoice_id) +
        "</label></div>";
    });
    var bal = po.fixation_summary && po.fixation_summary.unfixed_balance_ice_lots;
    document.getElementById("fhPoFxVol").value =
      typeof bal === "number" ? String(Math.min(bal, bal)) : "";
    document.getElementById("fhPoFxMonth").value = "Sep 2026";
    document.getElementById("fhPoFxLevel").value = "";
    document.getElementById("fhPoFxOrderType").value = "Market";
    var m = bootstrap.Modal.getOrCreateInstance(
      document.getElementById("fhPoFixationModal")
    );
    m.show();
    document.getElementById("fhPoFixationForm").onsubmit = function (ev) {
      ev.preventDefault();
      var type = document.getElementById("fhPoFxOrderType").value;
      var level = document.getElementById("fhPoFxLevel").value;
      var expiry = document.getElementById("fhPoFxExpiry").value;
      if (
        (type === "Stop" || type === "GTC") &&
        (!level || !expiry)
      ) {
        window.alert("Stop/GTC orders require requested level and expiry.");
        return;
      }
      window.alert(
        "Fixation Record created · Status Pending (stub). Submission is non-retractable."
      );
      m.hide();
    };
    root.dataset.fixPoId = po.id;
  }

  function openCancelModal(po) {
    document.getElementById(
      "fhPoCancelLead"
    ).textContent =
      "Explain why " + po.id + " is being cancelled.";
    document.getElementById("fhPoCancelReason").value = "";
    var modalEl = document.getElementById("fhPoCancelModal");
    var m = bootstrap.Modal.getOrCreateInstance(modalEl);
    m.show();
    document.getElementById("fhPoCancelConfirm").onclick = function () {
      var reason = document.getElementById("fhPoCancelReason").value.trim();
      if (!reason) {
        window.alert("Cancellation requires a reason.");
        return;
      }
      window.alert("Cancellation recorded against PO (audit trail stub).");
      m.hide();
    };
  }

  function openDetail(id) {
    selectedId = id;
    renderList();
    var po = findPo(id);
    if (!po) return;
    renderDetail(po);
    setDetailVisible(true);
    window.history.replaceState({}, "", "#/po/" + encodeURIComponent(id));
  }

  function closeDetail() {
    selectedId = null;
    renderList();
    setDetailVisible(false);
    window.history.replaceState({}, "", window.location.pathname + window.location.search);
  }

  function attachListHandlers() {
    if (!listBody) return;
    listBody.addEventListener("click", function (ev) {
      var tr = ev.target.closest("tr[data-po-id]");
      var btn = ev.target.closest("button[data-act]");
      var inDropdown = ev.target.closest("[data-bs-toggle=\"dropdown\"], .dropdown-menu");
      if (btn && tr) {
        var id = tr.getAttribute("data-po-id");
        var act = btn.getAttribute("data-act");
        if (act === "detail") openDetail(id);
        else if (act === "fixation")
          window.location.href =
            META.fixation_url + "?po=" + encodeURIComponent(id);
        else if (act === "lots")
          window.location.href =
            META.lot_intake_url + "?po=" + encodeURIComponent(id);
        else if (act === "cancel") {
          var p = findPo(id);
          if (p) openCancelModal(p);
        }
      } else if (tr && (ev.target.closest("a") || inDropdown))
        ;
      else if (tr && !btn) openDetail(tr.getAttribute("data-po-id"));
    });

    listBody.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      var tr = ev.target.closest("tr[data-po-id]");
      if (!tr) return;
      ev.preventDefault();
      openDetail(tr.getAttribute("data-po-id"));
    });
  }

  function wireFilters() {
    if (searchInputEl) {
      searchInputEl.addEventListener("input", function (e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
          var field = searchFieldEl ? searchFieldEl.value : "";
          displaySearchResults(getSearchResults(e.target.value || "", field));
        }, 220);
      });
    }
    if (searchFieldEl) {
      searchFieldEl.addEventListener("change", function () {
        if (!searchInputEl) return;
        displaySearchResults(
          getSearchResults(searchInputEl.value || "", searchFieldEl.value || "")
        );
      });
    }
    if (andBtn) {
      andBtn.addEventListener("click", function () {
        filterLogic = "AND";
        andBtn.classList.add("active");
        if (orBtn) orBtn.classList.remove("active");
        renderList();
        updateUrlFromFilters();
      });
    }
    if (orBtn) {
      orBtn.addEventListener("click", function () {
        filterLogic = "OR";
        orBtn.classList.add("active");
        if (andBtn) andBtn.classList.remove("active");
        renderList();
        updateUrlFromFilters();
      });
    }
    [poDateFromEl, poDateToEl].forEach(function (el) {
      if (!el) return;
      el.addEventListener("change", function () {
        renderList();
        updateUrlFromFilters();
      });
    });
    [expiredOnlyEl, gateClearedOnlyEl, approachingGateOnlyEl].forEach(function (el) {
      if (!el) return;
      el.addEventListener("change", function () {
        renderList();
        updateUrlFromFilters();
      });
    });
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", function () {
        lockedFilters = {
          suppliers: [],
          coffees: [],
          certifications: [],
          delivery_statuses: [],
          fixation_statuses: [],
          overall_statuses: [],
        };
        if (searchInputEl) searchInputEl.value = "";
        if (poDateFromEl) poDateFromEl.value = "";
        if (poDateToEl) poDateToEl.value = "";
        if (expiredOnlyEl) expiredOnlyEl.checked = false;
        if (gateClearedOnlyEl) gateClearedOnlyEl.checked = false;
        if (approachingGateOnlyEl) approachingGateOnlyEl.checked = false;
        lotsPendingFromQuery = false;
        renderLockedFilters();
        renderList();
        updateUrlFromFilters();
      });
    }
    document.addEventListener("click", function (e) {
      if (!searchDropdownEl) return;
      var inInput = searchInputEl && searchInputEl.contains(e.target);
      var inDropdown = searchDropdownEl.contains(e.target);
      if (!inInput && !inDropdown) searchDropdownEl.style.display = "none";
    });
  }

  function updateUrlFromFilters() {
    try {
      var u = new URL(window.location.href);
      u.pathname = window.location.pathname;
      u.searchParams.delete("logic");
      u.searchParams.delete("locked_suppliers");
      u.searchParams.delete("locked_coffees");
      u.searchParams.delete("locked_certifications");
      u.searchParams.delete("locked_delivery");
      u.searchParams.delete("locked_fixation");
      u.searchParams.delete("locked_overall");
      u.searchParams.delete("po_date_from");
      u.searchParams.delete("po_date_to");
      u.searchParams.delete("expired");
      u.searchParams.delete("gate_cleared");
      u.searchParams.delete("approaching_gate");
      u.searchParams.delete("overall");
      u.searchParams.delete("lots_pending");
      u.searchParams.delete("fixation");
      u.searchParams.delete("supplier");
      u.searchParams.delete("coffee");
      u.searchParams.delete("cert");
      u.searchParams.delete("delivery");
      u.searchParams.delete("date_from");
      u.searchParams.delete("date_to");
      u.searchParams.set("logic", filterLogic);
      if (lockedFilters.suppliers.length) u.searchParams.set("locked_suppliers", lockedFilters.suppliers.join("|"));
      if (lockedFilters.coffees.length) u.searchParams.set("locked_coffees", lockedFilters.coffees.join("|"));
      if (lockedFilters.certifications.length) u.searchParams.set("locked_certifications", lockedFilters.certifications.join("|"));
      if (lockedFilters.delivery_statuses.length) u.searchParams.set("locked_delivery", lockedFilters.delivery_statuses.join("|"));
      if (lockedFilters.fixation_statuses.length) u.searchParams.set("locked_fixation", lockedFilters.fixation_statuses.join("|"));
      if (lockedFilters.overall_statuses.length) u.searchParams.set("locked_overall", lockedFilters.overall_statuses.join("|"));
      if (poDateFromEl && poDateFromEl.value) u.searchParams.set("po_date_from", poDateFromEl.value);
      if (poDateToEl && poDateToEl.value) u.searchParams.set("po_date_to", poDateToEl.value);
      if (expiredOnlyEl && expiredOnlyEl.checked) u.searchParams.set("expired", "1");
      if (gateClearedOnlyEl && gateClearedOnlyEl.checked) u.searchParams.set("gate_cleared", "1");
      if (approachingGateOnlyEl && approachingGateOnlyEl.checked) u.searchParams.set("approaching_gate", "1");
      if (lotsPendingFromQuery) u.searchParams.set("lots_pending", "1");
      else u.searchParams.delete("lots_pending");
      window.history.replaceState({}, "", u.toString());
    } catch (_e) {}
  }

  function applyQueryToFiltersOnce() {
    try {
      var u = new URL(window.location.href);
      var qp = u.searchParams;
      var logic = qp.get("logic");
      if (logic === "OR") filterLogic = "OR";
      lockedFilters.suppliers = (qp.get("locked_suppliers") || "").split("|").filter(Boolean);
      lockedFilters.coffees = (qp.get("locked_coffees") || "").split("|").filter(Boolean);
      lockedFilters.certifications = (qp.get("locked_certifications") || "").split("|").filter(Boolean);
      lockedFilters.delivery_statuses = (qp.get("locked_delivery") || "").split("|").filter(Boolean);
      lockedFilters.fixation_statuses = (qp.get("locked_fixation") || "").split("|").filter(Boolean);
      lockedFilters.overall_statuses = (qp.get("locked_overall") || "").split("|").filter(Boolean);
      // Backward-compatible deep links from KPI cards
      if (qp.get("overall")) {
        var ov = String(qp.get("overall")).toLowerCase();
        var ovLabel = OVERALL_LABELS[ov];
        if (ovLabel && lockedFilters.overall_statuses.indexOf(ovLabel) < 0) {
          lockedFilters.overall_statuses.push(ovLabel);
        }
      }
      if (qp.get("fixation")) {
        var fx = String(qp.get("fixation")).toLowerCase();
        var fxLabel = FIXATION_LABELS[fx];
        if (fxLabel && lockedFilters.fixation_statuses.indexOf(fxLabel) < 0) {
          lockedFilters.fixation_statuses.push(fxLabel);
        }
      }
      if (qp.get("supplier")) {
        lockedFilters.suppliers.push(qp.get("supplier"));
      }
      if (qp.get("coffee")) {
        lockedFilters.coffees.push(qp.get("coffee"));
      }
      if (qp.get("cert")) {
        lockedFilters.certifications.push(qp.get("cert"));
      }
      if (qp.get("delivery")) {
        var dv = String(qp.get("delivery")).toLowerCase();
        var dvLabel = DELIVERY_LABELS[dv];
        if (dvLabel && lockedFilters.delivery_statuses.indexOf(dvLabel) < 0) {
          lockedFilters.delivery_statuses.push(dvLabel);
        }
      }
      Object.keys(lockedFilters).forEach(function (k) {
        lockedFilters[k] = Array.from(new Set(lockedFilters[k]));
      });
      lotsPendingFromQuery = qp.get("lots_pending") === "1";
      if (qp.get("expired") === "1" && expiredOnlyEl) expiredOnlyEl.checked = true;
      if (qp.get("gate_cleared") === "1" && gateClearedOnlyEl) gateClearedOnlyEl.checked = true;
      if (qp.get("approaching_gate") === "1" && approachingGateOnlyEl) approachingGateOnlyEl.checked = true;
      if (qp.get("po_date_from") && poDateFromEl) poDateFromEl.value = qp.get("po_date_from");
      if (qp.get("po_date_to") && poDateToEl) poDateToEl.value = qp.get("po_date_to");
    } catch (_e2) {}
  }

  function init() {
    applyQueryToFiltersOnce();
    attachListHandlers();
    wireFilters();
    renderLockedFilters();
    updateKpis();
    renderList();
    if (backBtn) backBtn.addEventListener("click", closeDetail);
    if (andBtn && orBtn) {
      andBtn.classList.toggle("active", filterLogic === "AND");
      orBtn.classList.toggle("active", filterLogic === "OR");
    }
  }

  init();
})();
