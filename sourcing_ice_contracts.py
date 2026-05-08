"""
ICE Coffee C — valid delivery months (MAR, MAY, JUL, SEP, DEC) and last trading day.

Last trading day = 7 business days before the last business day of the delivery month.
Business days = Monday–Friday (US exchange holidays not modeled in v1).
"""

from __future__ import annotations

import calendar
from dataclasses import dataclass
from datetime import date, timedelta
from typing import List

# ICE Coffee C delivery months only
_VALID_MONTHS = (3, 5, 7, 9, 12)
_MONTH_ABBREV = {3: "MAR", 5: "MAY", 7: "JUL", 9: "SEP", 12: "DEC"}


def _is_weekday(d: date) -> bool:
    return d.weekday() < 5


def last_business_day_of_month(year: int, month: int) -> date:
    last_cal = date(year, month, calendar.monthrange(year, month)[1])
    d = last_cal
    while not _is_weekday(d):
        d -= timedelta(days=1)
    return d


def subtract_business_days(d: date, n: int) -> date:
    """Return the date that is *n* business days strictly before the anchor pattern:
    step backward from `d` without counting `d`; after n weekday steps, return that date.
    For "7 business days before LBD", call with d=LBD and n=7.
    """
    c = d
    remaining = n
    while remaining > 0:
        c -= timedelta(days=1)
        if _is_weekday(c):
            remaining -= 1
    return c


def ice_last_trading_day(year: int, month: int) -> date:
    lbd = last_business_day_of_month(year, month)
    return subtract_business_days(lbd, 7)


def contract_label(year: int, month: int) -> str:
    return f"{_MONTH_ABBREV[month]} {year}"


@dataclass(frozen=True)
class IceContract:
    year: int
    month: int
    label: str
    last_trading_day: date

    @property
    def id(self) -> str:
        return f"{self.year}-{self.month}"


def upcoming_ice_c_contracts(today: date, limit: int = 8) -> List[IceContract]:
    """
    Next `limit` active ICE Coffee C contracts.

    Excludes a contract if:
    - Its last trading day is before today, OR
    - The calendar delivery month has already started (today >= first day of that month),
      so e.g. on May 4, 2026 the May contract is omitted and the list begins at JUL 2026.
    """
    out: List[IceContract] = []
    for y in range(today.year - 1, today.year + 6):
        for m in _VALID_MONTHS:
            delivery_start = date(y, m, 1)
            if today >= delivery_start:
                continue
            ltd = ice_last_trading_day(y, m)
            if ltd < today:
                continue
            out.append(
                IceContract(
                    year=y,
                    month=m,
                    label=contract_label(y, m),
                    last_trading_day=ltd,
                )
            )
    out.sort(key=lambda c: (c.year, c.month))
    return out[:limit]


def mock_futures_row(contract: IceContract, index: int) -> dict:
    """Deterministic mock last / 1D / 1W / 1M deltas (¢/lb) for demo UI."""
    base = 360.0 + (index * 4.2) + (contract.month * 0.35)
    last = round(base + (index % 3) * 0.8, 2)
    d1 = round((index % 5) * 0.31 - 0.6, 2)
    w1 = round((index % 7) * 0.45 - 1.0, 2)
    m1 = round((index % 11) * 0.52 - 1.8, 2)
    return {
        "contract_id": contract.id,
        "label": contract.label,
        "last": last,
        "d1": d1,
        "d1w": w1,
        "d1m": m1,
    }
