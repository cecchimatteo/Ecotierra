"""
Key domain entities for Settings → Entities (reference until PostgreSQL).

Mirrors product documentation §1.4 Key Entities: name, description, owning role.
"""

KEY_ENTITIES = {
    "title": "Key entities",
    "columns": ("Entity", "Description", "Owned by"),
    "rows": (
        (
            "Supplier",
            (
                "Any external party: coffee producer, cooperative, packaging "
                "supplier, or other."
            ),
            "Sourcing Manager",
        ),
        (
            "Daily Offer",
            (
                "Field-identified sourcing opportunity. Supplier optional. "
                "Pre-PO layer."
            ),
            "Sourcing Manager",
        ),
        (
            "Purchase Order (PO)",
            (
                "Commitment to buy at ICE + buying differential. Contains "
                "fixation records."
            ),
            "Sourcing Manager",
        ),
        (
            "Lot",
            (
                "Discrete batch of Parchment Coffee. Has Lot ID, two weigh-ins, "
                "variety, type, water activity, humidity, processing state."
            ),
            "Warehouse / Milling",
        ),
        (
            "Lot Output",
            (
                "Weight records produced from a Lot after milling, tagged with "
                "coffee category."
            ),
            "Milling Manager",
        ),
        (
            "Sales Order (SO)",
            (
                "One client contract = one SO. Priced at ICE + selling "
                "differential. Locked at creation. Contains one or more "
                "Invoices. Format: SO#####."
            ),
            "Sales",
        ),
        (
            "Client Requirement",
            "Open sourcing request posted by Sales for mill bidding.",
            "Sales",
        ),
        (
            "Mill Bid",
            (
                "Mill response to a Client Requirement. Subject to negotiation."
            ),
            "Sourcing Manager",
        ),
        (
            "Invoice",
            (
                "One container within an SO. Format: AAA######. Contains "
                "milestone tracker, PSS tracker, and fixation tracker."
            ),
            "Sales / Logistics",
        ),
        (
            "Fixation Record",
            (
                "A single fixation event against an Invoice or PO. Records "
                "order type, level, ICE price at fix, futures position, volume "
                "fixed, timestamp, and status."
            ),
            "Sales / ElevaFinca",
        ),
        (
            "Milestone",
            (
                "A tracked checkpoint in an Invoice's shipment lifecycle. "
                "Permanently watermarked if overdue."
            ),
            "Logistics",
        ),
        (
            "Container",
            (
                "Physical export container. Assembled at mill level. Linked to "
                "one Invoice."
            ),
            "Warehouse Manager",
        ),
        (
            "Container Manifest",
            "Versioned log of Lot assignments. Immutable history.",
            "System",
        ),
        (
            "PSS",
            (
                "Pre-Shipment Sample. Blind quality test. Unique blind ID: "
                "PSS-YYYY-NNNN."
            ),
            "System",
        ),
        (
            "QC Record",
            (
                "Result of a QC checkpoint. Contains physical, descriptive, "
                "and affective assessments."
            ),
            "Q-Grader",
        ),
        (
            "Shipment",
            (
                "Physical export event. Tracks carrier, booking, ETD, ETA, "
                "container number, BL."
            ),
            "Logistics",
        ),
    ),
}
