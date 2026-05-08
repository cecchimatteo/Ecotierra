"""FincaHub — local dev server (http://127.0.0.1:5002/)"""
from datetime import date

from flask import Flask, abort, redirect, render_template, url_for

from entities_data import KEY_ENTITIES
from glossary_data import GLOSSARY_GROUPS
from terminology_classification_data import TERMINOLOGY_CLASSIFICATION_BLOCKS
from sourcing_dashboard_data import MILL_NAME, SOURCING_KPIS_MAIN
from sourcing_ice_contracts import mock_futures_row, upcoming_ice_c_contracts
from sourcing_overview_data import OVERVIEW_TAB_BUTTONS, overview_sections
from sourcing_purchase_orders_data import MILL_CONTEXT, PURCHASE_ORDERS_DETAIL

app = Flask(__name__)

# Sidebar: section headers + child pages (collapsible nav, same shell as localhost:5000 / OCI)
NAV_GROUPS = (
    {
        "id": "sourcing",
        "label": "Sourcing",
        "icon": "bi-globe",
        "pages": (
            {
                "id": "sourcing-home",
                "label": "Home",
                "icon": "bi-house",
                "endpoint": "sourcing_dashboard",
            },
            {
                "id": "sourcing-supplier-management",
                "label": "Supplier Management",
                "icon": "bi-people",
                "endpoint": "sourcing_supplier_management",
            },
            {
                "id": "sourcing-commercial-management",
                "label": "Commercial Management",
                "icon": "bi-briefcase",
                "endpoint": "sourcing_commercial_management",
            },
            {
                "id": "sourcing-purchase-orders",
                "label": "Purchase Orders",
                "icon": "bi-file-earmark-text",
                "endpoint": "sourcing_purchase_orders",
            },
            {
                "id": "sourcing-lot-intake",
                "label": "Lot Intake",
                "icon": "bi-box-arrow-in-down",
                "endpoint": "sourcing_lot_intake",
            },
            {
                "id": "sourcing-fixation",
                "label": "Fixation",
                "icon": "bi-lightning-fill",
                "endpoint": "sourcing_fixation",
            },
        ),
    },
    {"id": "milling", "label": "Milling", "icon": "bi-gear", "pages": ()},
    {"id": "warehouse", "label": "Warehouse", "icon": "bi-box-seam", "pages": ()},
    {
        "id": "quality-control",
        "label": "Quality Control",
        "icon": "bi-clipboard-check",
        "pages": (),
    },
    {
        "id": "sales-price-fixation",
        "label": "Sales & Price Fixation",
        "icon": "bi-graph-up",
        "pages": (),
    },
    {"id": "logistics", "label": "Logistics", "icon": "bi-truck", "pages": ()},
    {
        "id": "administration",
        "label": "Administration",
        "icon": "bi-tools",
        "pages": (
            {
                "id": "counterparties",
                "label": "Counterparties",
                "icon": "bi-people",
                "endpoint": "counterparties",
            },
        ),
    },
)

LOGO_URL = (
    "https://static.wixstatic.com/media/b15ce0_755fe35beafa4b0f948f44462c5676ac~mv2.png/"
    "v1/fill/w_102,h_57,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/"
    "Eleva%20%2B%20sphere%20black%20Hr.png"
)

SETTINGS_SECTIONS = [
    {
        "slug": "terminology-and-classification",
        "label": "Terminology and Classification",
        "icon": "bi-tags",
    },
    {
        "slug": "entities",
        "label": "Entities",
        "icon": "bi-building",
    },
    {
        "slug": "identifier-formats",
        "label": "Identifier Formats",
        "icon": "bi-hash",
    },
    {
        "slug": "user-roles-access",
        "label": "User Roles & Access definitions",
        "icon": "bi-shield-lock",
    },
    {
        "slug": "glossary",
        "label": "Glossary",
        "icon": "bi-journal-text",
    },
]

_SETTINGS_SLUGS = {s["slug"] for s in SETTINGS_SECTIONS}

# Header: info icon → reference copy; gear → first configuration-style section
INFORMATION_SETTINGS_SLUG = "terminology-and-classification"
DEFAULT_SETTINGS_SLUG = "entities"


@app.route("/")
def index():
    return redirect(url_for("sourcing_dashboard"))


@app.route("/sourcing/")
def sourcing_dashboard():
    d = date.today()
    dashboard_date = f"{d.strftime('%b')} {d.day}, {d.year}"
    contracts = upcoming_ice_c_contracts(d, 8)
    ice_contracts = [{"id": c.id, "label": c.label} for c in contracts]
    ice_contracts_default = contracts[0].id if contracts else ""
    ice_feature_label = contracts[0].label if contracts else "ICE C"
    futures_quotes = [mock_futures_row(c, i) for i, c in enumerate(contracts)]
    kpis_main = []
    for row in SOURCING_KPIS_MAIN:
        k = dict(row)
        if not k.get("href"):
            k["clickable"] = False
            k["href"] = ""
        else:
            k["clickable"] = True
        kpis_main.append(k)
    return render_template(
        "sourcing_dashboard.html",
        mill_name=MILL_NAME,
        dashboard_date=dashboard_date,
        kpis_main=kpis_main,
        ice_contracts=ice_contracts,
        ice_contracts_default=ice_contracts_default,
        ice_feature_label=ice_feature_label,
        futures_quotes=futures_quotes,
        overview_buttons=OVERVIEW_TAB_BUTTONS,
        overview_sections=overview_sections(),
    )


def _sourcing_workspace_page(page_title: str, page_lead: str, page_icon: str):
    return render_template(
        "sourcing_workspace.html",
        page_title=page_title,
        page_lead=page_lead,
        page_icon=page_icon,
    )


@app.route("/sourcing/supplier-management/")
def sourcing_supplier_management():
    return _sourcing_workspace_page(
        "Supplier Management",
        "Onboard suppliers, maintain contact and compliance data, and resolve incomplete records.",
        "bi-people",
    )


@app.route("/sourcing/commercial-management/")
def sourcing_commercial_management():
    return _sourcing_workspace_page(
        "Commercial Management",
        "Terms, pricing structures, and commercial relationships tied to sourcing.",
        "bi-briefcase",
    )


@app.route("/sourcing/purchase-orders/")
def sourcing_purchase_orders():
    return render_template(
        "sourcing_purchase_orders.html",
        mill_name=MILL_CONTEXT["mill_name"],
        purchase_orders=PURCHASE_ORDERS_DETAIL,
    )


@app.route("/sourcing/lot-intake/")
def sourcing_lot_intake():
    return _sourcing_workspace_page(
        "Lot Intake",
        "Register incoming lots, link them to POs, and prepare for QC and warehouse handoff.",
        "bi-box-arrow-in-down",
    )


@app.route("/sourcing/fixation/")
def sourcing_fixation():
    return _sourcing_workspace_page(
        "Fixation",
        "Monitor unfixed volume, triggers, and hedge execution against futures.",
        "bi-lightning-fill",
    )


@app.route("/administration/counterparties")
def counterparties():
    return render_template("counterparties.html")


@app.route("/settings/")
def settings_redirect():
    return redirect(url_for("settings_section", slug=DEFAULT_SETTINGS_SLUG))


@app.route("/settings/<slug>")
def settings_section(slug):
    if slug not in _SETTINGS_SLUGS:
        abort(404)
    current = next(s for s in SETTINGS_SECTIONS if s["slug"] == slug)
    terminology_blocks = (
        TERMINOLOGY_CLASSIFICATION_BLOCKS
        if slug == "terminology-and-classification"
        else None
    )
    glossary_groups = GLOSSARY_GROUPS if slug == "glossary" else None
    key_entities = KEY_ENTITIES if slug == "entities" else None
    return render_template(
        "settings.html",
        settings_sections=SETTINGS_SECTIONS,
        active_settings_slug=slug,
        current_settings_section=current,
        terminology_blocks=terminology_blocks,
        glossary_groups=glossary_groups,
        key_entities=key_entities,
    )


@app.context_processor
def inject_layout():
    return {
        "platform_name": "FincaHub",
        "nav_groups": NAV_GROUPS,
        "logo_url": LOGO_URL,
        "information_url": url_for(
            "settings_section", slug=INFORMATION_SETTINGS_SLUG
        ),
        "settings_url": url_for("settings_section", slug=DEFAULT_SETTINGS_SLUG),
    }


if __name__ == "__main__":
    app.run(debug=True, port=5002)
