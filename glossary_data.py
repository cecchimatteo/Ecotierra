"""
Settings → Glossary: canonical term / definition rows.

Future Azure PostgreSQL (example): `glossary_entry`
`(id, group_slug, term, definition, sort_order, highlight, updated_at)`.
"""

GLOSSARY_GROUPS = (
    {
        "id": "units_of_measure",
        "title": "Units of measure",
        "summary": "Weight and quantity abbreviations used in documents and UI.",
        "rows": (
            {
                "key": "qq",
                "term": "QQ",
                "definition": "Quintal — 1 QQ = 100 LBS = 45.3592 KG.",
                "highlight": False,
            },
        ),
    },
    {
        "id": "sales_order_invoicing",
        "title": "Sales order & invoicing",
        "summary": "Contract structure, invoice tracking, and classification flags.",
        "rows": (
            {
                "key": "so",
                "term": "SO",
                "definition": (
                    "Sales Order — one client contract, containing one or more "
                    "Invoices."
                ),
                "highlight": False,
            },
            {
                "key": "invoice",
                "term": "Invoice",
                "definition": (
                    "One container within a Sales Order — the primary tracking "
                    "entity for milestones, fixation, and PSS."
                ),
                "highlight": False,
            },
            {
                "key": "ccc",
                "term": "CCC",
                "definition": (
                    "Conventional Clean Cup — invoice classification: no "
                    "certification AND SCA score < 83."
                ),
                "highlight": False,
            },
            {
                "key": "specialty_certified",
                "term": "Specialty / Certified",
                "definition": (
                    "Invoice classification: any certification present OR "
                    "SCA score ≥ 83."
                ),
                "highlight": False,
            },
            {
                "key": "at_risk_fixation",
                "term": "At Risk (Fixation)",
                "definition": (
                    "Flag applied when the 24-hour window between buying-side "
                    "and selling-side fixation is breached. Permanent even "
                    "after eventual resolution."
                ),
                "highlight": False,
            },
            {
                "key": "overdue_watermark",
                "term": "Overdue Watermark",
                "definition": (
                    "Permanent flag on an Invoice where at least one milestone "
                    "passed its deadline. Cannot be removed."
                ),
                "highlight": False,
            },
            {
                "key": "blind_id",
                "term": "Blind ID",
                "definition": (
                    "System-generated identifier with no embedded reference to "
                    "origin, client, or contract."
                ),
                "highlight": False,
            },
        ),
    },
    {
        "id": "coffee_milling",
        "title": "Coffee & milling",
        "summary": "Origin, quality states, sourcing paths, and milling vocabulary.",
        "rows": (
            {
                "key": "mill",
                "term": "Mill",
                "definition": (
                    "One of the joint-venture mill-level operating entities "
                    "feeding ElevaFinca."
                ),
                "highlight": False,
            },
            {
                "key": "flo",
                "term": "FLO",
                "definition": (
                    "Fairtrade Labelling Organizations — fairtrade certification."
                ),
                "highlight": False,
            },
            {
                "key": "fto",
                "term": "FTO",
                "definition": "Fair Trade Organization certification.",
                "highlight": False,
            },
            {
                "key": "parchment_coffee",
                "term": "Parchment Coffee",
                "definition": (
                    "Coffee as received from supplier before milling. Raw input state."
                ),
                "highlight": False,
            },
            {
                "key": "green_coffee",
                "term": "Green Coffee",
                "definition": (
                    "Milled output meeting export quality standards."
                ),
                "highlight": False,
            },
            {
                "key": "second_category",
                "term": "Second Category",
                "definition": (
                    "Below export grade but commercially sellable."
                ),
                "highlight": False,
            },
            {
                "key": "third_category",
                "term": "Third Category",
                "definition": (
                    "Lower grade output with limited commercial value."
                ),
                "highlight": False,
            },
            {
                "key": "residual_parchment",
                "term": "Residual Parchment",
                "definition": "Byproduct remaining after milling.",
                "highlight": False,
            },
            {
                "key": "yield_pct",
                "term": "Yield %",
                "definition": (
                    "Green Coffee output weight ÷ Parchment Coffee input weight × "
                    "100."
                ),
                "highlight": False,
            },
            {
                "key": "water_activity",
                "term": "Water Activity",
                "definition": (
                    "Moisture measurement recorded at receiving and post-milling."
                ),
                "highlight": False,
            },
            {
                "key": "daily_offer",
                "term": "Daily Offer",
                "definition": (
                    "Field-identified coffee available for purchase, logged before "
                    "a formal PO exists."
                ),
                "highlight": False,
            },
            {
                "key": "client_requirement",
                "term": "Client Requirement",
                "definition": (
                    "Sourcing request posted by Sales, open for mill bids "
                    "(Path 2)."
                ),
                "highlight": False,
            },
            {
                "key": "mill_bid",
                "term": "Mill Bid",
                "definition": (
                    "A mill's offer in response to a Client Requirement, "
                    "subject to negotiation."
                ),
                "highlight": False,
            },
            {
                "key": "reverse_cupping",
                "term": "Reverse Cupping",
                "definition": (
                    "Bias where a cupper selects an overall score first and "
                    "assigns sub-scores retroactively. Eliminated by withholding "
                    "the total score from the Q-grader."
                ),
                "highlight": False,
            },
            {
                "key": "trilla",
                "term": "Trilla",
                "definition": (
                    "Spanish term for the dry milling process. Maps to Milling "
                    "Complete and Post-Milling QC events in the system."
                ),
                "highlight": False,
            },
        ),
    },
    {
        "id": "sca_assessment_samples",
        "title": "SCA, assessment & samples",
        "summary": "Cupping standards, descriptive tools, and pre-shipment sampling.",
        "rows": (
            {
                "key": "sca",
                "term": "SCA",
                "definition": (
                    "Specialty Coffee Association — cupping protocol and scoring "
                    "standard."
                ),
                "highlight": True,
            },
            {
                "key": "cva",
                "term": "CVA",
                "definition": (
                    "Coffee Value Assessment — the SCA cupping standard adopted "
                    "in 2024, superseding the 2004 form."
                ),
                "highlight": False,
            },
            {
                "key": "cata",
                "term": "CATA",
                "definition": (
                    "Check-All-That-Apply — descriptor selection method in the "
                    "SCA CVA Descriptive Assessment."
                ),
                "highlight": False,
            },
            {
                "key": "pss",
                "term": "PSS",
                "definition": (
                    "Pre-Shipment Sample — physical coffee sample sent to client "
                    "before shipment for approval."
                ),
                "highlight": False,
            },
            {
                "key": "awb",
                "term": "AWB",
                "definition": (
                    "Air Waybill — courier tracking number for sample shipments."
                ),
                "highlight": False,
            },
        ),
    },
    {
        "id": "market_fixation_logistics",
        "title": "Market, fixation & logistics",
        "summary": "ICE-linked pricing, order types, and fixation artefacts.",
        "rows": (
            {
                "key": "t_date",
                "term": "T",
                "definition": (
                    "Contractual shipment date (loading date on the Invoice). "
                    "Reference point for all milestone deadlines."
                ),
                "highlight": False,
            },
            {
                "key": "ice",
                "term": "ICE",
                "definition": (
                    "Intercontinental Exchange — futures market for arabica coffee "
                    "(Contract C)."
                ),
                "highlight": False,
            },
            {
                "key": "ice_lot",
                "term": "ICE Lot",
                "definition": (
                    "One futures contract on the ICE C market = 37,500 lbs. "
                    "May vary slightly by container."
                ),
                "highlight": False,
            },
            {
                "key": "differential",
                "term": "Differential",
                "definition": (
                    "The fixed premium or discount in USD cents per lb agreed at "
                    "contract creation, applied over the ICE futures price to arrive "
                    "at the final all-in price."
                ),
                "highlight": False,
            },
            {
                "key": "stop_order",
                "term": "Stop Order",
                "definition": (
                    "Fixation order triggered automatically if ICE drops to a "
                    "specified floor level."
                ),
                "highlight": False,
            },
            {
                "key": "gtc_order",
                "term": "GTC Order",
                "definition": (
                    "Good Till Cancelled — fixation order triggered if ICE rises "
                    "to a specified ceiling level."
                ),
                "highlight": False,
            },
            {
                "key": "market_order",
                "term": "Market Order",
                "definition": (
                    "Immediate fixation at the current ICE price at the moment "
                    "the order is received."
                ),
                "highlight": False,
            },
            {
                "key": "fixation_record",
                "term": "Fixation Record",
                "definition": (
                    "A single fixation event record — FIX-YYYY-NNNN. Contains "
                    "order details, ICE price, timestamps, and status for both "
                    "buying and selling sides."
                ),
                "highlight": False,
            },
            {
                "key": "fixation_letter",
                "term": "Fixation Letter",
                "definition": (
                    "Protected PDF confirmation of a completed fixation event, "
                    "auto-generated and sent by ElevaFinca to the mill."
                ),
                "highlight": False,
            },
        ),
    },
)
