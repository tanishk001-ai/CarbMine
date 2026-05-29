"""
CarbMine — Emission Factors & Calculation Engine
Sources: IPCC AR6, MoEF&CC India, CEA Grid Emission Factors 2023
All values in tonnes CO2e unless noted.
"""

# ─── SCOPE 1 EMISSION FACTORS ────────────────────────────────────

# Coal mining: fugitive methane per tonne of coal extracted
# Source: IPCC 2006 Guidelines, Tier 1 (underground bituminous)
METHANE_PER_TONNE_COAL = 0.0185       # tonnes CH4 / tonne coal extracted

# Global Warming Potential of methane (IPCC AR6, 100-year)
GWP_CH4 = 27.9

# Diesel combustion: CO2 per litre
# Source: IPCC 2006, Table 2.2
CO2_PER_LITRE_DIESEL = 0.002676       # tonnes CO2 / litre

# Explosives (ANFO): CO2e per kg
# Source: Australian NGER Methodology 2023
CO2E_PER_KG_EXPLOSIVES = 0.00254     # tonnes CO2e / kg ANFO

# ─── SCOPE 2 EMISSION FACTORS (India grid) ───────────────────────

# CEA Grid Emission Factors 2022-23 (kg CO2 / kWh → tonnes CO2 / kWh)
GRID_EF = {
    "national":   0.000716,   # National average
    "northern":   0.000742,
    "southern":   0.000671,
    "eastern":    0.000789,
    "western":    0.000724,
    "northeastern": 0.000312,
}

# ─── SCOPE 3 EMISSION FACTORS ────────────────────────────────────

# Rail transport (tonne-km): typical Indian freight
CO2E_PER_TONNE_KM_RAIL = 0.0000277   # tonnes CO2e / tonne-km

# Coal combustion at end-user (power plant):
# Bituminous coal — IPCC default emission factor
CO2_PER_TONNE_COAL_COMBUSTED = 2.42  # tonnes CO2 / tonne coal


# ─── CALCULATION FUNCTIONS ───────────────────────────────────────

def calculate_scope1(
    coal_extracted_tonnes: float = 0,
    methane_vented_m3: float = 0,
    diesel_litres: float = 0,
    explosives_kg: float = 0,
) -> dict:
    """
    Scope 1: Direct emissions from mining operations.
    Returns breakdown + total in tonnes CO2e.
    """
    # Fugitive methane from coal seam (implicit from extraction rate)
    fugitive_from_extraction = coal_extracted_tonnes * METHANE_PER_TONNE_COAL * GWP_CH4

    # Explicitly vented methane (if measured separately)
    # 1 m3 CH4 ≈ 0.000717 tonnes CH4 at standard conditions
    fugitive_from_venting = methane_vented_m3 * 0.000717 * GWP_CH4

    diesel_co2 = diesel_litres * CO2_PER_LITRE_DIESEL
    explosives_co2e = explosives_kg * CO2E_PER_KG_EXPLOSIVES

    total = fugitive_from_extraction + fugitive_from_venting + diesel_co2 + explosives_co2e

    return {
        "fugitive_methane_extraction": round(fugitive_from_extraction, 4),
        "fugitive_methane_venting": round(fugitive_from_venting, 4),
        "diesel_combustion": round(diesel_co2, 4),
        "explosives": round(explosives_co2e, 4),
        "total": round(total, 4),
        "unit": "tonnes CO2e",
    }


def calculate_scope2(
    electricity_kwh: float = 0,
    grid_region: str = "national",
) -> dict:
    """
    Scope 2: Indirect emissions from purchased electricity.
    Uses India CEA grid emission factors.
    """
    ef = GRID_EF.get(grid_region.lower(), GRID_EF["national"])
    electricity_co2 = electricity_kwh * ef

    return {
        "electricity_kwh": electricity_kwh,
        "grid_region": grid_region,
        "emission_factor_kg_per_kwh": ef * 1000,
        "total": round(electricity_co2, 4),
        "unit": "tonnes CO2e",
    }


def calculate_scope3(
    coal_transported_tkm: float = 0,
    coal_combustion_tonnes: float = 0,
) -> dict:
    """
    Scope 3: Value chain emissions — transport and downstream combustion.
    """
    transport_co2e = coal_transported_tkm * CO2E_PER_TONNE_KM_RAIL
    combustion_co2 = coal_combustion_tonnes * CO2_PER_TONNE_COAL_COMBUSTED

    total = transport_co2e + combustion_co2

    return {
        "transport_rail": round(transport_co2e, 4),
        "downstream_combustion": round(combustion_co2, 4),
        "total": round(total, 4),
        "unit": "tonnes CO2e",
    }


def get_all_factors() -> dict:
    """Return all emission factors — used by frontend for display."""
    return {
        "scope1": {
            "methane_per_tonne_coal_kg": METHANE_PER_TONNE_COAL * 1000,
            "gwp_ch4": GWP_CH4,
            "co2_per_litre_diesel_kg": CO2_PER_LITRE_DIESEL * 1000,
            "co2e_per_kg_explosives": CO2E_PER_KG_EXPLOSIVES,
        },
        "scope2": {"grid_factors_kg_per_kwh": {k: v * 1000 for k, v in GRID_EF.items()}},
        "scope3": {
            "co2e_per_tonne_km_rail_g": CO2E_PER_TONNE_KM_RAIL * 1e6,
            "co2_per_tonne_coal_combusted": CO2_PER_TONNE_COAL_COMBUSTED,
        },
        "sources": [
            "IPCC 2006 Guidelines for National GHG Inventories",
            "IPCC AR6 GWP values",
            "CEA Grid Emission Factors 2022-23 (India)",
            "MoEF&CC India",
        ],
    }
