"""Seed data for the Sourcing Manager dashboard (demo / until APIs exist)."""

MILL_NAME = "Café del Monte Mill"

SOURCING_KPIS_MAIN = (
    {
        "id": "active-pos",
        "overview_tab": "active_pos",
        "label": "Open POs",
        "value": 14,
        "sub": "3 pending fixation",
        "icon": "bi-file-earmark-text",
        "icon_class": "",
        "highlight": False,
        "clickable": True,
        "href": "/sourcing/purchase-orders/?overall=active",
    },
    {
        "id": "lots-pending",
        "overview_tab": "lots_pending",
        "label": "Lots Pending",
        "value": 7,
        "sub": "2 overdue",
        "icon": "bi-box-seam",
        "icon_class": "fh-sd-kpi-icon--warn",
        "highlight": False,
        "clickable": True,
        "href": "/sourcing/purchase-orders/?lots_pending=1",
    },
    {
        "id": "daily-offers",
        "overview_tab": "daily_offers",
        "label": "Open Daily Offers",
        "value": 23,
        "sub": "Updated 18 min ago",
        "icon": "bi-card-list",
        "icon_class": "fh-sd-kpi-icon--info",
        "highlight": False,
    },
    {
        "id": "client-reqs",
        "overview_tab": "client_reqs",
        "label": "Client Reqs",
        "value": 5,
        "sub": "2 eligible for this mill",
        "icon": "bi-clipboard-check",
        "icon_class": "fh-sd-kpi-icon--ok",
        "highlight": False,
    },
    {
        "id": "pending-fixation",
        "overview_tab": "pending_fixation",
        "label": "Pending Fixation",
        "value": 3,
        "sub": "Action required",
        "overdue_fixations": 2,
        "icon": "bi-lightning-fill",
        "icon_class": "fh-sd-kpi-icon--warn",
        "highlight": False,
        "clickable": True,
        "href": "/sourcing/purchase-orders/?gate_cleared=1",
    },
)

# Backwards compatibility if imported elsewhere (fixation is now in SOURCING_KPIS_MAIN)
SOURCING_KPIS = SOURCING_KPIS_MAIN
