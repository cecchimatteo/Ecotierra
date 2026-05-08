"""
Canonical copy for Settings → Terminology and Classification.

Intended PostgreSQL mapping (examples for Azure Postgres):

- `terminology_reference` — `(section_slug, entry_key, label, body_text, sort_order)`
- `cupping_attribute` — optional normalized rows for SCA attributes (code, title, definition, max_points_hint)
- `score_bracket` — `(score_min, score_max, classification, meaning_text, sort_order)`
- `terminology_table` / `terminology_table_row` — captions and tabular rows if you prefer relational tables over JSON

Until wired, TERMINOLOGY_CLASSIFICATION_BLOCKS remains the canonical seed payload.
"""

TERMINOLOGY_CLASSIFICATION_BLOCKS = (
    {
        "id": "units_of_measure",
        "slug": "units-of-measure",
        "title": "Units of Measure", 
        "summary": (
            "How weights are stored internally, converted for display, and "
            "related to ICE C pricing."
        ),
        "entries": (
            {
                "key": "base_storage_unit",
                "label": "Base storage unit",
                "body": "KG — all weights stored in KG internally.",
            },
            {
                "key": "supported_uom",
                "label": "Supported UOM",
                "body": "KG, LBS, QQ.",
            },
            {
                "key": "conversion_qq",
                "label": "Conversion — 1 QQ",
                "body": "100 LBS = 45.3592 KG.",
            },
            {
                "key": "conversion_lbs",
                "label": "Conversion — 1 LBS",
                "body": "0.453592 KG.",
            },
            {
                "key": "user_preference",
                "label": "User preference",
                "body": (
                    "Set at the profile level. Applied system-wide by default. "
                    "Users can switch UOM within any module view without "
                    "changing their profile default."
                ),
            },
            {
                "key": "price_denomination",
                "label": "Price denomination",
                "body": (
                    "ICE C contract prices stored in USD cents per lb. "
                    "System converts to any active UOM for display and document generation."
                ),
            },
        ),
        "notes": (),
        "tables": (),
        "entries_between_tables": (),
    },
    {
        "id": "coffee_terminology",
        "slug": "coffee-terminology",
        "title": "Coffee Terminology",
        "summary": "States of coffee through milling and yields.",
        "entries": (
            {
                "key": "parchment_coffee",
                "label": "Parchment Coffee",
                "body": (
                    "Coffee as received from the supplier before milling. "
                    "Raw input state."
                ),
            },
            {
                "key": "green_coffee",
                "label": "Green Coffee",
                "body": "Milled output meeting export quality standards.",
            },
            {
                "key": "second_category",
                "label": "Second Category",
                "body": (
                    "Milled output below export grade but commercially sellable "
                    "at lower value."
                ),
            },
            {
                "key": "third_category",
                "label": "Third Category",
                "body": "Lower grade milled output with limited commercial value.",
            },
            {
                "key": "residual_parchment",
                "label": "Residual Parchment",
                "body": (
                    "Byproduct remaining after milling. Tracked for yield and "
                    "waste reporting."
                ),
            },
        ),
        "notes": (
            {
                "key": "parchment_yield_note",
                "label": "Note",
                "body": (
                    "A single input lot of Parchment Coffee may yield multiple "
                    "output categories simultaneously."
                ),
            },
        ),
        "tables": (),
        "entries_between_tables": (),
    },
    {
        "id": "sca_cupping_scale",
        "slug": "sca-cupping-scale",
        "title": "SCA cupping scale (reference)",
        "summary": (
            "The Specialty Coffee Association 100-point cupping scale used "
            "globally by Q-graders, buyers, and exporters—aligned with FincaHub "
            "cup-score fields and invoice logic."
        ),
        "entries": (
            {
                "key": "sca_organization",
                "label": "Specialty Coffee Association (SCA)",
                "body": (
                    "Developed by the SCA, formed from the 2017 merger of SCAA "
                    "and SCAE. The protocol and scale are the global reference "
                    "for specialty coffee quality."
                ),
            },
            {
                "key": "cupping_protocol",
                "label": "Standard cupping protocol",
                "body": (
                    "8.25 g of coffee; 150 ml of water at ~93 °C; 4-minute "
                    "steep. Process: break the crust and slurp."
                ),
            },
            {
                "key": "attribute_scoring_rules",
                "label": "Attribute scores",
                "body": (
                    "Ten sensory attributes, each scored 0–10 (typically "
                    "6.00–10.00 in 0.25 increments). Each row is spelled out "
                    "in the same three-column grid style as the final score "
                    "brackets table."
                ),
            },
        ),
        "notes": (),
        "entries_between_tables": (
            {
                "key": "final_score_calculation",
                "label": "Final score calculation",
                "body": (
                    "The ten attribute scores are summed; defects are "
                    "subtracted to produce a final score out of 100."
                ),
            },
        ),
        "tables": (
            {
                "key": "sca_cupping_attributes",
                "caption": "The 10 scoring attributes (each criterion 0–10 points)",
                "columns": ("#", "Attribute", "What it means"),
                "rows": (
                    (
                        "1",
                        "Fragrance / Aroma",
                        (
                            "Dry grounds and wet aroma observed after pouring "
                            "water."
                        ),
                    ),
                    (
                        "2",
                        "Flavor",
                        "Combined taste and aroma in the mouth.",
                    ),
                    (
                        "3",
                        "Aftertaste",
                        "Length and quality of the sensory finish.",
                    ),
                    (
                        "4",
                        "Acidity",
                        (
                            "Brightness or liveliness; positive acidity is not "
                            "the same as unpleasant sourness."
                        ),
                    ),
                    ("5", "Body", "Mouthfeel: perceived weight and texture."),
                    (
                        "6",
                        "Balance",
                        (
                            "How well the sensory attributes complement one "
                            "another in the cup."
                        ),
                    ),
                    (
                        "7",
                        "Uniformity",
                        (
                            "Consistency across the five cups of the same "
                            "evaluated lot."
                        ),
                    ),
                    (
                        "8",
                        "Clean Cup",
                        (
                            "Absence of undesirable flavors or taints "
                            "(off-flavors)."
                        ),
                    ),
                    ("9", "Sweetness", "Perceived sweetness in the cup."),
                    (
                        "10",
                        "Overall",
                        (
                            "The cupper's holistic judgement of quality for "
                            "that sample."
                        ),
                    ),
                ),
            },
            {
                "key": "sca_score_brackets",
                "caption": "Score brackets (final score)",
                "columns": ("Score", "Classification", "What it means"),
                "rows": (
                    (
                        "90–100",
                        "Outstanding / Presidential",
                        (
                            "Extremely rare. Examples: Cup of Excellence top "
                            "lots, Geisha varieties, prized single-farm micro-lots."
                        ),
                    ),
                    (
                        "85–89.99",
                        "Excellent",
                        (
                            "High-end specialty: premium segment, direct-trade "
                            "and similar positioning."
                        ),
                    ),
                    (
                        "80–84.99",
                        "Specialty",
                        (
                            "The specialty threshold — anything ≥ 80 counts as "
                            "specialty-grade coffee under this framework."
                        ),
                    ),
                    (
                        "< 80",
                        "Below specialty",
                        (
                            "Commercial / commodity grade; typically priced and "
                            "sold on conventional wholesale or futures-linked markets."
                        ),
                    ),
                ),
            },
        ),
    },
    {
        "id": "invoice_classification",
        "slug": "invoice-classification",
        "title": "Invoice Classification",
        "summary": "Rules that drive how lots are categorized for invoicing.",
        "entries": (
            {
                "key": "specialty_certified_non_ccc",
                "label": "Specialty / Certified (Non CCC)",
                "body": "Any certification present OR SCA cupping score ≥ 83.",
            },
            {
                "key": "conventional_clean_cup",
                "label": "Conventional Clean Cup (CCC)",
                "body": "No certification AND SCA cupping score < 83.",
            },
            {
                "key": "classification_trigger",
                "label": "Classification trigger",
                "body": (
                    "System suggests classification based on lot data. "
                    "User confirms."
                ),
            },
        ),
        "notes": (),
        "tables": (),
        "entries_between_tables": (),
    },
)
