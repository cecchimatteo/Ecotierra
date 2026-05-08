"""
Sourcing Manager homepage — overview tab tables (mock rows, mill-scoped).
Cell format: {"t": "text", "v": "..."} | {"t": "pill", "v": "Label", "cls": "slug"}.
"""

from __future__ import annotations

from typing import Any, Dict, List, Tuple

OverviewSection = Dict[str, Any]


def _text(v: str) -> Dict[str, str]:
    return {"t": "text", "v": v}


def _pill(label: str, cls: str) -> Dict[str, str]:
    return {"t": "pill", "v": label, "cls": cls}


OVERVIEW_TAB_BUTTONS: Tuple[Dict[str, str], ...] = (
    {"id": "active_pos", "label": "Open POs", "icon": "bi-file-earmark-text"},
    {"id": "lots_pending", "label": "Lots pending", "icon": "bi-box-seam"},
    {"id": "daily_offers", "label": "Open Daily Offers", "icon": "bi-card-list"},
    {"id": "pending_fixation", "label": "Pending Fixation", "icon": "bi-lightning-fill"},
    {"id": "client_reqs", "label": "Clients Reqs", "icon": "bi-clipboard-check"},
)


def overview_sections() -> List[OverviewSection]:
    columns_active = (
        "PO Number",
        "Supplier",
        "Variety",
        "Volume",
        "Buying Diff",
        "Expected Delivery",
        "Fixation Status",
        "Status",
    )
    rows_active: List[List[Dict[str, str]]] = [
        [
            _text("PO-2026-0142"),
            _text("Finca La Esperanza"),
            _text("Catuai"),
            _text("320 QQ"),
            _text("+52"),
            _text("Mar 12, 2026"),
            _pill("Unfixed", "unfixed"),
            _pill("Pending Delivery", "pending_delivery"),
        ],
        [
            _text("PO-2026-0138"),
            _text("Coop. Marcala Norte"),
            _text("Lempira"),
            _text("480 QQ"),
            _text("+48"),
            _text("Mar 18, 2026"),
            _pill("Partially Fixed", "partially_fixed"),
            _pill("In Production", "in_production"),
        ],
        [
            _text("PO-2026-0135"),
            _text("Beneficio San Juan"),
            _text("Bourbon"),
            _text("220 QQ"),
            _text("+65"),
            _text("Mar 5, 2026"),
            _pill("Fully Fixed", "fully_fixed"),
            _pill("In Production", "in_production"),
        ],
        [
            _text("PO-2026-0131"),
            _text("Finca El Roble"),
            _text("Pacas"),
            _text("380 QQ"),
            _text("+45"),
            _text("Feb 28, 2026"),
            _pill("Unfixed", "unfixed"),
            _pill("Overdue Delivery", "overdue_delivery"),
        ],
        [
            _text("PO-2026-0128"),
            _text("Coop. Copán Sur"),
            _text("Catuai"),
            _text("510 QQ"),
            _text("+50"),
            _text("Apr 2, 2026"),
            _pill("Unfixed", "unfixed"),
            _pill("Confirmed", "confirmed"),
        ],
        [
            _text("PO-2026-0125"),
            _text("Finca Santa Rita"),
            _text("Caturra"),
            _text("290 QQ"),
            _text("+58"),
            _text("Mar 22, 2026"),
            _pill("Partially Fixed", "partially_fixed"),
            _pill("Confirmed", "confirmed"),
        ],
        [
            _text("PO-2026-0119"),
            _text("Finca La Esperanza"),
            _text("Geisha"),
            _text("60 QQ"),
            _text("+185"),
            _text("Apr 10, 2026"),
            _pill("Unfixed", "unfixed"),
            _pill("Confirmed", "confirmed"),
        ],
        [
            _text("PO-2026-0117"),
            _text("Coop. Marcala Norte"),
            _text("IH-90"),
            _text("340 QQ"),
            _text("+42"),
            _text("Mar 8, 2026"),
            _pill("Fully Fixed", "fully_fixed"),
            _pill("In Production", "in_production"),
        ],
    ]

    columns_lots = (
        "PO Number",
        "Supplier",
        "Expected Volume",
        "Expected Date",
        "Days Until Due",
        "Status",
    )
    rows_lots: List[List[Dict[str, str]]] = [
        [
            _text("PO-2026-0131"),
            _text("Finca El Roble"),
            _text("380 QQ"),
            _text("Feb 28, 2026"),
            _text("-5 (overdue)"),
            _pill("Overdue", "overdue"),
        ],
        [
            _text("PO-2026-0142"),
            _text("Finca La Esperanza"),
            _text("320 QQ"),
            _text("Mar 12, 2026"),
            _text("7"),
            _pill("At Risk", "at_risk"),
        ],
        [
            _text("PO-2026-0138"),
            _text("Coop. Marcala Norte"),
            _text("480 QQ"),
            _text("Mar 18, 2026"),
            _text("13"),
            _pill("On Track", "on_track"),
        ],
        [
            _text("PO-2026-0125"),
            _text("Finca Santa Rita"),
            _text("290 QQ"),
            _text("Mar 22, 2026"),
            _text("17"),
            _pill("On Track", "on_track"),
        ],
        [
            _text("PO-2026-0128"),
            _text("Coop. Copán Sur"),
            _text("510 QQ"),
            _text("Apr 2, 2026"),
            _text("28"),
            _pill("On Track", "on_track"),
        ],
        [
            _text("PO-2026-0119"),
            _text("Finca La Esperanza"),
            _text("60 QQ"),
            _text("Apr 10, 2026"),
            _text("36"),
            _pill("On Track", "on_track"),
        ],
    ]

    columns_offers = (
        "Offer Date",
        "Supplier",
        "Variety",
        "Volume",
        "Offered Diff",
        "Cert",
        "Days Open",
        "Status",
    )
    rows_offers: List[List[Dict[str, str]]] = [
        [
            _text("May 2, 2026"),
            _text("Finca Buenos Aires"),
            _text("Catuai"),
            _text("240 QQ"),
            _text("+55"),
            _text("Organic"),
            _text("2"),
            _pill("Active", "active"),
        ],
        [
            _text("Apr 30, 2026"),
            _text("Coop. La Labor"),
            _text("Lempira"),
            _text("600 QQ"),
            _text("+42"),
            _text("Conventional"),
            _text("4"),
            _pill("Active", "active"),
        ],
        [
            _text("Apr 28, 2026"),
            _text("(unspecified)"),
            _text("Geisha"),
            _text("80 QQ"),
            _text("+175"),
            _text("Organic, FLO"),
            _text("6"),
            _pill("Active", "active"),
        ],
        [
            _text("Apr 25, 2026"),
            _text("Finca El Mirador"),
            _text("Bourbon"),
            _text("180 QQ"),
            _text("+60"),
            _text("RFA"),
            _text("9"),
            _pill("Stale", "stale"),
        ],
        [
            _text("Apr 22, 2026"),
            _text("Coop. Marcala Norte"),
            _text("IH-90"),
            _text("320 QQ"),
            _text("+44"),
            _text("Conventional"),
            _text("12"),
            _pill("Stale", "stale"),
        ],
        [
            _text("Apr 18, 2026"),
            _text("Finca Las Brumas"),
            _text("Pacamara"),
            _text("95 QQ"),
            _text("+95"),
            _text("Organic"),
            _text("16"),
            _pill("Stale", "stale"),
        ],
    ]

    columns_fix = (
        "PO Number",
        "Supplier",
        "Volume Unfixed",
        "Order Type",
        "Trigger Levels",
        "Futures",
        "Expires",
        "Status",
    )
    rows_fix: List[List[Dict[str, str]]] = [
        [
            _text("PO-2026-0142"),
            _text("Finca La Esperanza"),
            _text("0.85 lots"),
            _text("—"),
            _text("Gate cleared, no order"),
            _text("MAR 2026"),
            _text("—"),
            _pill("Action Needed", "action_needed"),
        ],
        [
            _text("PO-2026-0138"),
            _text("Coop. Marcala Norte"),
            _text("0.43 lots"),
            _text("Stop+GTC"),
            _text("175 / 195"),
            _text("MAY 2026"),
            _text("Feb 28, 2026"),
            _pill("Order Live", "order_live"),
        ],
        [
            _text("PO-2026-0125"),
            _text("Finca Santa Rita"),
            _text("0.31 lots"),
            _text("GTC"),
            _text("198"),
            _text("MAY 2026"),
            _text("Mar 15, 2026"),
            _pill("Order Live", "order_live"),
        ],
        [
            _text("PO-2026-0117"),
            _text("Coop. Marcala Norte"),
            _text("0.12 lots"),
            _text("Stop"),
            _text("178"),
            _text("MAR 2026"),
            _text("May 8, 2026"),
            _pill("Expiring Soon", "expiring_soon"),
        ],
        [
            _text("PO-2026-0119"),
            _text("Finca La Esperanza"),
            _text("0.16 lots"),
            _text("—"),
            _text("Gate not cleared"),
            _text("—"),
            _text("—"),
            _pill("Not Ready", "not_ready"),
        ],
    ]

    columns_req = (
        "REQ Number",
        "Variety",
        "Volume",
        "Cert",
        "Target Diff",
        "Delivery Window",
        "Days Open",
        "Bid Status",
    )
    rows_req: List[List[Dict[str, str]]] = [
        [
            _text("REQ-2026-0089"),
            _text("Catuai"),
            _text("320 QQ"),
            _text("Organic"),
            _text("+50"),
            _text("Apr-May 2026"),
            _text("3"),
            _pill("Not Bid", "not_bid"),
        ],
        [
            _text("REQ-2026-0087"),
            _text("Bourbon"),
            _text("180 QQ"),
            _text("RFA"),
            _text("+65"),
            _text("May 2026"),
            _text("5"),
            _pill("Bid Submitted", "bid_submitted"),
        ],
        [
            _text("REQ-2026-0085"),
            _text("Lempira"),
            _text("480 QQ"),
            _text("Conventional"),
            _text("+40"),
            _text("Apr 2026"),
            _text("7"),
            _pill("Negotiating", "negotiating"),
        ],
        [
            _text("REQ-2026-0083"),
            _text("Geisha"),
            _text("80 QQ"),
            _text("Organic, FLO"),
            _text("+180"),
            _text("Jun 2026"),
            _text("9"),
            _pill("Bid Submitted", "bid_submitted"),
        ],
        [
            _text("REQ-2026-0081"),
            _text("IH-90"),
            _text("340 QQ"),
            _text("Conventional"),
            _text("(withheld)"),
            _text("Apr-May 2026"),
            _text("12"),
            _pill("Not Bid", "not_bid"),
        ],
        [
            _text("REQ-2026-0078"),
            _text("Pacamara"),
            _text("95 QQ"),
            _text("Organic"),
            _text("+90"),
            _text("May-Jun 2026"),
            _text("15"),
            _pill("Expired", "expired"),
        ],
    ]

    return [
        {
            "id": "active_pos",
            "heading": "Open POs",
            "columns": columns_active,
            "rows": rows_active,
        },
        {
            "id": "lots_pending",
            "heading": "Lots Pending Delivery",
            "columns": columns_lots,
            "rows": rows_lots,
        },
        {
            "id": "daily_offers",
            "heading": "Open Daily Offers",
            "columns": columns_offers,
            "rows": rows_offers,
        },
        {
            "id": "pending_fixation",
            "heading": "Pending Fixation",
            "columns": columns_fix,
            "rows": rows_fix,
        },
        {
            "id": "client_reqs",
            "heading": "Open Client Requirements",
            "columns": columns_req,
            "rows": rows_req,
        },
    ]
