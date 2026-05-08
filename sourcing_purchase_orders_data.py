"""
Demo purchase-order payloads for the Sourcing PO module until APIs exist.

Field names mirror the module spec. Sell-side attributes are omitted by design.
"""

from __future__ import annotations

MILL_CONTEXT = {
    "mill_name": "Café del Monte Mill",
    "mill_id": "mill-cdm-01",
}

# Slugs used in filters / URL (?delivery=..., ?fixation=..., ?overall=...)
DELIVERY_STATUSES = (
    ("pending_contract", "Pending Contract"),
    ("open", "Open"),
    ("partially_delivered", "Partially Delivered"),
    ("fully_delivered", "Fully Delivered"),
    ("cancelled", "Cancelled"),
)

FIXATION_STATUSES = (
    ("gate_blocked", "Gate Blocked"),
    ("gate_cleared_not_submitted", "Gate Cleared, Not Submitted"),
    ("partially_fixed", "Partially Fixed"),
    ("fully_fixed", "Fully Fixed"),
    ("has_expired_orders", "Has Expired Orders"),
)

OVERALL_STATUSES = (
    ("active", "Active"),
    ("awaiting_fixation", "Awaiting Fixation"),
    ("closed", "Closed"),
    ("cancelled", "Cancelled"),
)


def _overall_status(delivery: str, fixation: str, payments_released: bool) -> str:
    if delivery == "cancelled":
        return "cancelled"
    if delivery == "fully_delivered":
        if fixation == "fully_fixed" and payments_released:
            return "closed"
        return "awaiting_fixation"
    return "active"


def _allocated_qq_total(invoices: list[dict]) -> float:
    total = 0.0
    for inv in invoices:
        raw = inv.get("allocated_volume") or ""
        s = raw.replace(",", "").replace(" QQ", "").strip()
        if not s:
            continue
        try:
            total += float(s)
        except ValueError:
            continue
    return total


PURCHASE_ORDERS_RAW: list[dict] = [
    {
        "id": "PO-2026-0298",
        "po_date": "2026-04-12",
        "origin_kind": "offer",
        "origin_id": "OFF-2026-0142",
        "supplier_name": "Cooperativa San Juan",
        "supplier_key": "coop-san-juan",
        "coffee_display": "SHG Bourbon",
        "certification": "Fairtrade",
        "contracted_display": "1,200 QQ",
        "contracted_qq": 1200,
        "buying_differential": "ICE + 12¢/lb",
        "expected_delivery_iso": "2026-06-15",
        "expected_delivery_label": "Jun 15, 2026",
        "planned_deliveries": 3,
        "received_deliveries": 1,
        "delivery_status": "partially_delivered",
        "fixation_status": "gate_cleared_not_submitted",
        "payments_released": False,
        "days_open": 24,
        "cancel_permitted": True,
        "contract": {
            "status": "signed_uploaded",
            "uploaded_at": "2026-04-18",
            "upload_actor": "A. Méndez (SM)",
            "file_label": "PO-2026-0298_contract.pdf",
        },
        "invoices": [
            {
                "invoice_id": "ACM000138",
                "classification": "Specialty",
                "allocated_volume": "400 QQ",
                "invoice_status": "Active",
                "gate_status": "cleared",
            },
            {
                "invoice_id": "ACM000141",
                "classification": "Specialty",
                "allocated_volume": "300 QQ",
                "invoice_status": "Active",
                "gate_status": "blocked",
            },
        ],
        "lots": [
            {
                "lot_id": "ACM-LOT-2026-0287",
                "delivery_date": "2026-05-02",
                "truck_weight": "19,842 kg",
                "mill_weight": "19,780 kg",
                "discrepancy_pct": 0.31,
                "humidity_pct": 11.2,
                "water_activity": 0.58,
                "stage": "in_milling",
                "recv_qc": "Passed",
                "recv_qc_date": "2026-05-03",
                "post_qc": "Pending",
                "post_qc_date": "",
                "days_in_stage": 4,
            },
        ],
        "pending_delivery_labels": ["Expected Jun 28, 2026", "Expected Jul 12, 2026"],
        "fixation_records": [],
        "fixation_summary": {
            "contract_volume_ice_lots": 48.0,
            "volume_in_active_orders": 0.0,
            "volume_executed": 0.0,
            "avg_fixed_price_per_lb": None,
            "unfixed_balance_ice_lots": 48.0,
        },
        "gate_checklists": [
            {
                "invoice_id": "ACM000138",
                "classification": "Specialty",
                "conditions": [
                    {"label": "Contract uploaded", "ok": True, "completed_at": "2026-04-18"},
                    {
                        "label": "Receiving QC passed for sufficient volume",
                        "ok": True,
                        "completed_at": "2026-05-03",
                    },
                    {
                        "label": "Post-Milling QC passed for sufficient volume",
                        "ok": False,
                        "completed_at": "",
                    },
                ],
            },
            {
                "invoice_id": "ACM000141",
                "classification": "Specialty",
                "conditions": [
                    {"label": "Contract uploaded", "ok": True, "completed_at": "2026-04-18"},
                    {"label": "Receiving QC passed for sufficient volume", "ok": False, "completed_at": ""},
                    {"label": "Post-Milling QC passed for sufficient volume", "ok": False, "completed_at": ""},
                ],
            },
        ],
        "activity_log": [
            {"at": "2026-04-12T09:12:00", "actor": "System", "message": "PO created from Daily Offer OFF-2026-0142."},
            {"at": "2026-04-18T16:02:00", "actor": "A. Méndez", "message": "Signed contract uploaded."},
            {"at": "2026-05-02T13:45:00", "actor": "Warehouse", "message": "Lot ACM-LOT-2026-0287 received."},
            {"at": "2026-05-03T10:00:00", "actor": "QC", "message": "Receiving QC passed for lot ACM-LOT-2026-0287."},
        ],
    },
    {
        "id": "PO-2026-0271",
        "po_date": "2026-03-08",
        "origin_kind": "requirement",
        "origin_id": "REQ-2026-0093",
        "supplier_name": "Finca El Paraíso SA",
        "supplier_key": "finca-paraiso",
        "coffee_display": "EP Washed Pacamara",
        "certification": "Organic",
        "contracted_display": "800 QQ",
        "contracted_qq": 800,
        "buying_differential": "ICE + 18¢/lb",
        "expected_delivery_iso": "2026-05-22",
        "expected_delivery_label": "May 22, 2026",
        "planned_deliveries": 2,
        "received_deliveries": 2,
        "delivery_status": "fully_delivered",
        "fixation_status": "partially_fixed",
        "payments_released": False,
        "days_open": 59,
        "cancel_permitted": False,
        "contract": {
            "status": "signed_uploaded",
            "uploaded_at": "2026-03-12",
            "upload_actor": "A. Méndez (SM)",
            "file_label": "PO-2026-0271_contract.pdf",
        },
        "invoices": [
            {
                "invoice_id": "ACM000129",
                "classification": "Certified",
                "allocated_volume": "800 QQ",
                "invoice_status": "Active",
                "gate_status": "cleared",
            },
        ],
        "lots": [
            {
                "lot_id": "ACM-LOT-2026-0199",
                "delivery_date": "2026-05-10",
                "truck_weight": "13,200 kg",
                "mill_weight": "13,188 kg",
                "discrepancy_pct": 0.09,
                "humidity_pct": 10.8,
                "water_activity": 0.55,
                "stage": "available",
                "recv_qc": "Passed",
                "recv_qc_date": "2026-05-11",
                "post_qc": "Passed",
                "post_qc_date": "2026-05-14",
                "days_in_stage": 22,
            },
            {
                "lot_id": "ACM-LOT-2026-0214",
                "delivery_date": "2026-05-18",
                "truck_weight": "13,050 kg",
                "mill_weight": "13,001 kg",
                "discrepancy_pct": 0.38,
                "humidity_pct": 11.0,
                "water_activity": 0.56,
                "stage": "available",
                "recv_qc": "Passed",
                "recv_qc_date": "2026-05-19",
                "post_qc": "Passed",
                "post_qc_date": "2026-05-21",
                "days_in_stage": 15,
            },
        ],
        "pending_delivery_labels": [],
        "fixation_records": [
            {
                "fix_id": "FIX-2026-0044",
                "target_invoices": ["ACM000129"],
                "order_type": "Stop",
                "requested_level": "388.50",
                "futures_month": "Sep 2026",
                "volume_ice_lots": 20.0,
                "status": "Fixed",
                "submission_date": "2026-05-20",
                "execution_date": "2026-05-21",
                "expiry_date": "2026-05-26",
            },
        ],
        "fixation_summary": {
            "contract_volume_ice_lots": 32.0,
            "volume_in_active_orders": 0.0,
            "volume_executed": 20.0,
            "avg_fixed_price_per_lb": "387.40",
            "unfixed_balance_ice_lots": 12.0,
        },
        "gate_checklists": [
            {
                "invoice_id": "ACM000129",
                "classification": "Certified",
                "conditions": [
                    {"label": "Contract uploaded", "ok": True, "completed_at": "2026-03-12"},
                    {"label": "Receiving QC + Post-Milling QC passed", "ok": True, "completed_at": "2026-05-21"},
                ],
            },
        ],
        "activity_log": [
            {"at": "2026-03-08T08:05:00", "actor": "System", "message": "PO created from Requirement REQ-2026-0093 acceptance."},
            {"at": "2026-05-21T11:02:00", "actor": "Fixation Ops", "message": "FIX-2026-0044 executed."},
        ],
    },
    {
        "id": "PO-2026-0305",
        "po_date": "2026-04-28",
        "origin_kind": "offer",
        "origin_id": "OFF-2026-0160",
        "supplier_name": "Agroexport Los Andes",
        "supplier_key": "los-andes",
        "coffee_display": "HG EP Blend",
        "certification": "None",
        "contracted_display": "2,400 QQ",
        "contracted_qq": 2400,
        "buying_differential": "ICE + 6¢/lb",
        "expected_delivery_iso": "2026-07-03",
        "expected_delivery_label": "Jul 3, 2026",
        "planned_deliveries": 2,
        "received_deliveries": 0,
        "delivery_status": "pending_contract",
        "fixation_status": "gate_blocked",
        "payments_released": False,
        "days_open": 8,
        "cancel_permitted": True,
        "contract": {
            "status": "pending_signature",
            "uploaded_at": "",
            "upload_actor": "",
            "file_label": "",
        },
        "invoices": [
            {
                "invoice_id": "ACM000150",
                "classification": "CCC",
                "allocated_volume": "1,600 QQ",
                "invoice_status": "Active",
                "gate_status": "blocked",
            },
        ],
        "lots": [],
        "pending_delivery_labels": ["Expected Jul 3, 2026", "Expected Jul 22, 2026"],
        "fixation_records": [],
        "fixation_summary": {
            "contract_volume_ice_lots": 96.0,
            "volume_in_active_orders": 0.0,
            "volume_executed": 0.0,
            "avg_fixed_price_per_lb": None,
            "unfixed_balance_ice_lots": 96.0,
        },
        "gate_checklists": [
            {
                "invoice_id": "ACM000150",
                "classification": "CCC",
                "conditions": [
                    {"label": "Buying differential confirmed", "ok": True, "completed_at": "2026-04-28"},
                    {"label": "Signed contract uploaded", "ok": False, "completed_at": ""},
                    {
                        "label": '“Standard quality, easy to replace” attestation',
                        "ok": False,
                        "completed_at": "",
                    },
                ],
            },
        ],
        "activity_log": [
            {"at": "2026-04-28T15:41:00", "actor": "System", "message": "PO created from Daily Offer OFF-2026-0160."},
        ],
    },
    {
        "id": "PO-2026-0284",
        "po_date": "2026-04-03",
        "origin_kind": "offer",
        "origin_id": "OFF-2026-0151",
        "supplier_name": "Beneficio Santa Rosa",
        "supplier_key": "santa-rosa",
        "coffee_display": "SHB Honey Microlot",
        "certification": "Organic",
        "contracted_display": "420 QQ",
        "contracted_qq": 420,
        "buying_differential": "ICE + 24¢/lb",
        "expected_delivery_iso": "2026-05-30",
        "expected_delivery_label": "May 30, 2026",
        "planned_deliveries": 1,
        "received_deliveries": 1,
        "delivery_status": "open",
        "fixation_status": "has_expired_orders",
        "payments_released": False,
        "days_open": 33,
        "cancel_permitted": True,
        "contract": {
            "status": "signed_uploaded",
            "uploaded_at": "2026-04-09",
            "upload_actor": "A. Méndez (SM)",
            "file_label": "contract.pdf",
        },
        "invoices": [
            {
                "invoice_id": "ACM000144",
                "classification": "Specialty",
                "allocated_volume": "420 QQ",
                "invoice_status": "Active",
                "gate_status": "cleared",
            },
        ],
        "lots": [
            {
                "lot_id": "ACM-LOT-2026-0258",
                "delivery_date": "2026-05-12",
                "truck_weight": "6,960 kg",
                "mill_weight": "6,951 kg",
                "discrepancy_pct": 0.13,
                "humidity_pct": 10.5,
                "water_activity": 0.52,
                "stage": "milling_complete",
                "recv_qc": "Passed",
                "recv_qc_date": "2026-05-13",
                "post_qc": "In Progress",
                "post_qc_date": "",
                "days_in_stage": 6,
            },
        ],
        "pending_delivery_labels": [],
        "fixation_records": [
            {
                "fix_id": "FIX-2026-0082",
                "target_invoices": ["ACM000144"],
                "order_type": "GTC",
                "requested_level": "392.00",
                "futures_month": "Jul 2026",
                "volume_ice_lots": 17.5,
                "status": "Expired",
                "submission_date": "2026-05-14",
                "execution_date": "",
                "expiry_date": "2026-05-19",
            },
        ],
        "fixation_summary": {
            "contract_volume_ice_lots": 17.5,
            "volume_in_active_orders": 0.0,
            "volume_executed": 0.0,
            "avg_fixed_price_per_lb": None,
            "unfixed_balance_ice_lots": 17.5,
        },
        "gate_checklists": [
            {
                "invoice_id": "ACM000144",
                "classification": "Specialty",
                "conditions": [
                    {"label": "Contract uploaded", "ok": True, "completed_at": "2026-04-09"},
                    {"label": "Receiving QC passed", "ok": True, "completed_at": "2026-05-13"},
                    {"label": "Post-Milling QC passed", "ok": False, "completed_at": ""},
                ],
            },
        ],
        "activity_log": [
            {"at": "2026-05-19T16:55:00", "actor": "Fixation Ops", "message": "FIX-2026-0082 expired without execution."},
        ],
    },
    {
        "id": "PO-2026-0240",
        "po_date": "2026-01-21",
        "origin_kind": "requirement",
        "origin_id": "REQ-2026-0012",
        "supplier_name": "Cooperativa San Juan",
        "supplier_key": "coop-san-juan",
        "coffee_display": "Arabica HG",
        "certification": "None",
        "contracted_display": "3,600 QQ",
        "contracted_qq": 3600,
        "buying_differential": "ICE + 5¢/lb",
        "expected_delivery_iso": "2026-03-10",
        "expected_delivery_label": "Mar 10, 2026",
        "planned_deliveries": 3,
        "received_deliveries": 3,
        "delivery_status": "fully_delivered",
        "fixation_status": "fully_fixed",
        "payments_released": True,
        "days_open": 105,
        "cancel_permitted": False,
        "contract": {
            "status": "signed_uploaded",
            "uploaded_at": "2026-01-29",
            "upload_actor": "A. Méndez (SM)",
            "file_label": "contract.pdf",
        },
        "invoices": [
            {
                "invoice_id": "ACM000102",
                "classification": "CCC",
                "allocated_volume": "3,600 QQ",
                "invoice_status": "Active",
                "gate_status": "cleared",
            },
        ],
        "lots": [
            {
                "lot_id": "ACM-LOT-2026-0071",
                "delivery_date": "2026-02-25",
                "truck_weight": "18,050 kg",
                "mill_weight": "18,001 kg",
                "discrepancy_pct": 0.27,
                "humidity_pct": 11.4,
                "water_activity": 0.59,
                "stage": "available",
                "recv_qc": "Passed",
                "recv_qc_date": "2026-02-26",
                "post_qc": "Passed",
                "post_qc_date": "2026-02-28",
                "days_in_stage": 68,
            },
        ],
        "pending_delivery_labels": [],
        "fixation_records": [
            {
                "fix_id": "FIX-2026-0019",
                "target_invoices": ["ACM000102"],
                "order_type": "Market",
                "requested_level": "",
                "futures_month": "Mar 2026",
                "volume_ice_lots": 144.0,
                "status": "Fixed",
                "submission_date": "2026-03-03",
                "execution_date": "2026-03-04",
                "expiry_date": "",
            },
        ],
        "fixation_summary": {
            "contract_volume_ice_lots": 144.0,
            "volume_in_active_orders": 0.0,
            "volume_executed": 144.0,
            "avg_fixed_price_per_lb": "379.82",
            "unfixed_balance_ice_lots": 0.0,
        },
        "gate_checklists": [
            {
                "invoice_id": "ACM000102",
                "classification": "CCC",
                "conditions": [
                    {"label": "Buying differential confirmed", "ok": True, "completed_at": "2026-01-22"},
                    {"label": "Signed contract uploaded", "ok": True, "completed_at": "2026-01-29"},
                    {
                        "label": "Standard quality attestation",
                        "ok": True,
                        "completed_at": "2026-01-29",
                    },
                ],
            },
        ],
        "activity_log": [
            {"at": "2026-03-06T09:01:00", "actor": "Treasury", "message": "Final supplier payment batch released."},
        ],
    },
    {
        "id": "PO-2026-0312",
        "po_date": "2026-05-01",
        "origin_kind": "offer",
        "origin_id": "OFF-2026-0174",
        "supplier_name": "Beneficio Santa Rosa",
        "supplier_key": "santa-rosa",
        "coffee_display": "Organic SHG Typica",
        "certification": "Organic",
        "contracted_display": "600 QQ",
        "contracted_qq": 600,
        "buying_differential": "ICE + 15¢/lb",
        "expected_delivery_iso": "2026-06-08",
        "expected_delivery_label": "Jun 8, 2026",
        "planned_deliveries": 2,
        "received_deliveries": 1,
        "delivery_status": "partially_delivered",
        "fixation_status": "gate_blocked",
        "payments_released": False,
        "days_open": 5,
        "cancel_permitted": True,
        "contract": {
            "status": "signed_uploaded",
            "uploaded_at": "2026-05-02",
            "upload_actor": "A. Méndez (SM)",
            "file_label": "contract.pdf",
        },
        "invoices": [
            {
                "invoice_id": "ACM000155",
                "classification": "Certified",
                "allocated_volume": "350 QQ",
                "invoice_status": "Active",
                "gate_status": "blocked",
            },
        ],
        "lots": [
            {
                "lot_id": "ACM-LOT-2026-0301",
                "delivery_date": "2026-05-04",
                "truck_weight": "11,770 kg",
                "mill_weight": "11,650 kg",
                "discrepancy_pct": 1.03,
                "humidity_pct": 12.1,
                "water_activity": 0.61,
                "stage": "received",
                "recv_qc": "Passed",
                "recv_qc_date": "2026-05-05",
                "post_qc": "Pending",
                "post_qc_date": "",
                "days_in_stage": 1,
            },
        ],
        "pending_delivery_labels": ["Expected Jun 8, 2026"],
        "fixation_records": [],
        "fixation_summary": {
            "contract_volume_ice_lots": 24.0,
            "volume_in_active_orders": 0.0,
            "volume_executed": 0.0,
            "avg_fixed_price_per_lb": None,
            "unfixed_balance_ice_lots": 24.0,
        },
        "gate_checklists": [
            {
                "invoice_id": "ACM000155",
                "classification": "Certified",
                "conditions": [
                    {"label": "Contract uploaded", "ok": True, "completed_at": "2026-05-02"},
                    {"label": "Receiving QC + Post-Milling QC passed", "ok": False, "completed_at": ""},
                ],
            },
        ],
        "activity_log": [
            {
                "at": "2026-05-04T07:41:00",
                "actor": "System",
                "message": "Truck vs mill discrepancy exceeded threshold — flagged to SM & Warehouse.",
            },
        ],
    },
    {
        "id": "PO-2026-0199",
        "po_date": "2025-12-03",
        "origin_kind": "offer",
        "origin_id": "OFF-2025-0891",
        "supplier_name": "Finca El Paraíso SA",
        "supplier_key": "finca-paraiso",
        "coffee_display": "Natural Field Lot",
        "certification": "Fairtrade",
        "contracted_display": "950 QQ",
        "contracted_qq": 950,
        "buying_differential": "ICE + 9¢/lb",
        "expected_delivery_iso": "2026-02-02",
        "expected_delivery_label": "Feb 2, 2026",
        "planned_deliveries": 1,
        "received_deliveries": 0,
        "delivery_status": "cancelled",
        "fixation_status": "gate_blocked",
        "payments_released": False,
        "days_open": 0,
        "cancel_permitted": False,
        "cancel_reason": "Supplier failed to execute contract timelines.",
        "contract": {
            "status": "pending_signature",
            "uploaded_at": "",
            "upload_actor": "",
            "file_label": "",
        },
        "invoices": [],
        "lots": [],
        "pending_delivery_labels": [],
        "fixation_records": [],
        "fixation_summary": {
            "contract_volume_ice_lots": 0.0,
            "volume_in_active_orders": 0.0,
            "volume_executed": 0.0,
            "avg_fixed_price_per_lb": None,
            "unfixed_balance_ice_lots": 0.0,
        },
        "gate_checklists": [],
        "activity_log": [
            {"at": "2026-02-03T09:09:00", "actor": "A. Méndez", "message": "PO cancelled — supplier failed contract timelines."},
        ],
    },
    {
        "id": "PO-2026-0319",
        "po_date": "2026-05-04",
        "origin_kind": "requirement",
        "origin_id": "REQ-2026-0210",
        "supplier_name": "Agroexport Los Andes",
        "supplier_key": "los-andes",
        "coffee_display": "Arabica HG",
        "certification": "None",
        "contracted_display": "1,100 QQ",
        "contracted_qq": 1100,
        "buying_differential": "ICE + 5¢/lb",
        "expected_delivery_iso": "2026-06-20",
        "expected_delivery_label": "Jun 20, 2026",
        "planned_deliveries": 1,
        "received_deliveries": 0,
        "delivery_status": "open",
        "fixation_status": "gate_cleared_not_submitted",
        "payments_released": False,
        "days_open": 2,
        "cancel_permitted": True,
        "contract": {
            "status": "signed_uploaded",
            "uploaded_at": "2026-05-05",
            "upload_actor": "A. Méndez (SM)",
            "file_label": "contract.pdf",
        },
        "invoices": [
            {
                "invoice_id": "ACM000160",
                "classification": "CCC",
                "allocated_volume": "1,100 QQ",
                "invoice_status": "Active",
                "gate_status": "cleared",
            },
        ],
        "lots": [],
        "pending_delivery_labels": ["Expected Jun 20, 2026"],
        "fixation_records": [],
        "fixation_summary": {
            "contract_volume_ice_lots": 44.0,
            "volume_in_active_orders": 0.0,
            "volume_executed": 0.0,
            "avg_fixed_price_per_lb": None,
            "unfixed_balance_ice_lots": 44.0,
        },
        "gate_checklists": [
            {
                "invoice_id": "ACM000160",
                "classification": "CCC",
                "conditions": [
                    {"label": "Buying differential confirmed", "ok": True, "completed_at": "2026-05-04"},
                    {"label": "Signed contract uploaded", "ok": True, "completed_at": "2026-05-05"},
                    {
                        "label": "Standard quality attestation",
                        "ok": True,
                        "completed_at": "2026-05-05",
                    },
                ],
            },
        ],
        "activity_log": [
            {"at": "2026-05-05T09:51:00", "actor": "A. Méndez", "message": "Attestation filed for CCC invoice ACM000160."},
        ],
    },
]


def _normalize_po(row: dict) -> dict:
    d = dict(row)
    d["overall_status"] = _overall_status(
        d["delivery_status"],
        d["fixation_status"],
        d["payments_released"],
    )
    recv_pass_post_pending = False
    for lot in d.get("lots", []):
        if (
            lot.get("recv_qc") == "Passed"
            and lot.get("post_qc") == "Pending"
            and d.get("certification")
            and d["certification"] != "None"
        ):
            recv_pass_post_pending = True
            break
    d["approaching_gate"] = bool(recv_pass_post_pending)
    d["lots_pending_delivery"] = (
        d["delivery_status"] != "cancelled"
        and d["planned_deliveries"] > d["received_deliveries"]
    )
    d["allocated_qq_total"] = _allocated_qq_total(d.get("invoices") or [])
    return d


PURCHASE_ORDERS_DETAIL: list[dict] = [_normalize_po(r) for r in PURCHASE_ORDERS_RAW]
