#!/usr/bin/env python3
"""
AU Business Directory Scraper — uses ASIC Business Names dataset (data.gov.au)
This is REAL Australian government open data, completely free.

Source: https://data.gov.au/dataset/bc515135-4bb6-4d50-957a-3713709a76d3
License: Creative Commons Attribution 3.0 Australia

Usage: python3 scripts/scrape-businesses.py
"""

import csv
import io
import json
import os
import sys
import urllib.request
import re
from collections import defaultdict

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_DIR, "src", "data")

ASIC_CSV_URL = "https://data.gov.au/data/dataset/bc515135-4bb6-4d50-957a-3713709a76d3/resource/55ad4b1c-5eeb-44ea-8b29-d410da431be3/download/business_names_202603.csv"

# Category detection via keyword matching on business names
CATEGORIES = {
    "plumber": {"name": "Plumbing Services", "keywords": ["plumb", "plumbing", "plumber"]},
    "electrician": {"name": "Electrical Services", "keywords": ["electri", "electrical", "electrician", "sparky"]},
    "carpenter": {"name": "Carpentry & Joinery", "keywords": ["carpent", "joinery", "joiner", "cabinet"]},
    "painter": {"name": "Painting Services", "keywords": ["painting", "painter", "paint service"]},
    "mechanic": {"name": "Automotive Repair", "keywords": ["mechani", "auto repair", "car service", "motor mechanic"]},
    "dentist": {"name": "Dental Services", "keywords": ["dental", "dentist", "dentistry"]},
    "accountant": {"name": "Accounting & Tax", "keywords": ["account", "bookkeep", "tax agent", "taxation"]},
    "lawyer": {"name": "Legal Services", "keywords": ["legal", "lawyer", "solicitor", "law firm", "barrister"]},
    "restaurant": {"name": "Restaurants & Cafes", "keywords": ["restaurant", "cafe", "bistro", "diner", "eatery", "pizz"]},
    "gym": {"name": "Gyms & Fitness", "keywords": ["gym", "fitness", "personal train", "crossfit", "pilates", "yoga"]},
    "real-estate": {"name": "Real Estate", "keywords": ["real estate", "realty", "property manage", "estate agent"]},
    "hairdresser": {"name": "Hair & Beauty", "keywords": ["hair", "barber", "beauty", "salon", "hairdress"]},
    "cleaner": {"name": "Cleaning Services", "keywords": ["clean", "cleaning service", "carpet clean", "window clean"]},
    "locksmith": {"name": "Locksmith Services", "keywords": ["locksmith", "lock service"]},
    "photographer": {"name": "Photography", "keywords": ["photo", "photography", "photographer"]},
    "vet": {"name": "Veterinary Services", "keywords": ["veterinar", "vet clinic", "animal hospital"]},
    "gardener": {"name": "Garden & Landscaping", "keywords": ["garden", "landscap", "lawn", "mowing"]},
    "removalist": {"name": "Removalists & Moving", "keywords": ["removalist", "moving", "removals"]},
    "builder": {"name": "Builders & Construction", "keywords": ["builder", "building", "construct", "renovation"]},
    "roofing": {"name": "Roofing Services", "keywords": ["roof", "roofing", "gutter"]},
}

STATE_NAMES = {
    "NSW": "New South Wales", "VIC": "Victoria", "QLD": "Queensland",
    "WA": "Western Australia", "SA": "South Australia", "TAS": "Tasmania",
    "ACT": "Australian Capital Territory", "NT": "Northern Territory",
}

# Suburbs per state for directory pages
AU_SUBURBS = {
    "NSW": ["Sydney", "Parramatta", "Bondi", "Manly", "Chatswood", "Bankstown", "Liverpool", "Penrith", "Newcastle", "Wollongong",
            "Blacktown", "Hornsby", "Hurstville", "Burwood", "Strathfield", "Epping", "Ryde", "Dee Why", "Cronulla", "Campbelltown"],
    "VIC": ["Melbourne", "St Kilda", "Richmond", "South Yarra", "Fitzroy", "Brunswick", "Footscray", "Box Hill", "Dandenong", "Geelong",
            "Frankston", "Doncaster", "Glen Waverley", "Hawthorn", "Carlton", "Prahran", "Collingwood", "Moonee Ponds", "Essendon", "Brighton"],
    "QLD": ["Brisbane", "Gold Coast", "Sunshine Coast", "Cairns", "Townsville", "Toowoomba", "Surfers Paradise", "Southport", "Ipswich", "Rockhampton",
            "Fortitude Valley", "South Brisbane", "West End", "New Farm", "Paddington", "Bulimba", "Carindale", "Chermside", "Indooroopilly", "Mount Gravatt"],
    "WA": ["Perth", "Fremantle", "Subiaco", "Joondalup", "Rockingham", "Mandurah", "Midland", "Armadale", "Scarborough", "Cottesloe",
            "Morley", "Cannington", "Victoria Park", "Leederville", "Mount Lawley", "Claremont", "Nedlands", "Como", "Karrinyup", "Balcatta"],
    "SA": ["Adelaide", "Glenelg", "Norwood", "Unley", "Prospect", "North Adelaide", "Port Adelaide", "Modbury", "Marion", "Salisbury"],
    "TAS": ["Hobart", "Launceston", "Devonport", "Burnie", "Sandy Bay", "Battery Point", "North Hobart", "Glenorchy", "Kingston", "Moonah"],
    "ACT": ["Canberra", "Belconnen", "Woden", "Tuggeranong", "Gungahlin", "Braddon", "Kingston", "Manuka", "Dickson", "Fyshwick"],
    "NT": ["Darwin", "Alice Springs", "Palmerston", "Casuarina", "Stuart Park"],
}


def classify_business(name_lower: str):
    """Match a business name to a category."""
    for slug, cat in CATEGORIES.items():
        for kw in cat["keywords"]:
            if kw in name_lower:
                return slug
    return None


def main():
    print("Downloading ASIC Business Names dataset...")
    print(f"URL: {ASIC_CSV_URL}")

    req = urllib.request.Request(ASIC_CSV_URL, headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=60)

    # Stream and process — file is large, only keep what we need
    businesses_by_cat = defaultdict(list)
    total_scanned = 0
    max_per_category = 100  # Keep top 100 per category for MVP

    print("Scanning businesses...")
    reader = csv.reader(io.TextIOWrapper(resp, encoding="utf-8"), delimiter="\t")
    header = next(reader)
    # Columns: REGISTER_NAME, BN_NAME, BN_STATUS, BN_REG_DT, BN_CANCEL_DT, BN_STATE_NUM, BN_STATE_OF_REG, BN_ABN

    for row in reader:
        total_scanned += 1
        if total_scanned % 100000 == 0:
            print(f"  Scanned {total_scanned:,} records...")
            # Check if we have enough
            cats_full = sum(1 for v in businesses_by_cat.values() if len(v) >= max_per_category)
            if cats_full >= len(CATEGORIES):
                print("  All categories full, stopping early.")
                break

        if len(row) < 8:
            continue

        bn_name = row[1].strip()
        bn_status = row[2].strip()
        bn_state = row[6].strip()
        bn_abn = row[7].strip()

        # Only active businesses
        if bn_status != "Registered":
            continue

        name_lower = bn_name.lower()
        cat_slug = classify_business(name_lower)
        if not cat_slug:
            continue

        if len(businesses_by_cat[cat_slug]) >= max_per_category:
            continue

        businesses_by_cat[cat_slug].append({
            "name": bn_name,
            "abn": bn_abn,
            "category": cat_slug,
            "categoryName": CATEGORIES[cat_slug]["name"],
            "state": bn_state if bn_state in STATE_NAMES else "",
            "registeredDate": row[3].strip(),
        })

    print(f"\nTotal records scanned: {total_scanned:,}")

    # Flatten
    all_businesses = []
    categories_data = []
    for slug, cat in CATEGORIES.items():
        biz_list = businesses_by_cat.get(slug, [])
        all_businesses.extend(biz_list)
        categories_data.append({
            "slug": slug,
            "name": cat["name"],
            "count": len(biz_list),
        })
        print(f"  {cat['name']}: {len(biz_list)} businesses")

    # Generate suburb data
    suburbs = []
    for state_code, suburb_list in AU_SUBURBS.items():
        for suburb in suburb_list:
            suburbs.append({
                "name": suburb,
                "state": state_code,
                "stateName": STATE_NAMES[state_code],
                "slug": re.sub(r"[^a-z0-9]+", "-", suburb.lower()).strip("-"),
            })

    # Save
    os.makedirs(DATA_DIR, exist_ok=True)

    with open(os.path.join(DATA_DIR, "businesses.json"), "w") as f:
        json.dump(all_businesses, f, indent=2)

    with open(os.path.join(DATA_DIR, "categories.json"), "w") as f:
        json.dump(categories_data, f, indent=2)

    with open(os.path.join(DATA_DIR, "suburbs.json"), "w") as f:
        json.dump(suburbs, f, indent=2)

    with open(os.path.join(DATA_DIR, "states.json"), "w") as f:
        json.dump([{"code": k, "name": v, "suburbCount": len(AU_SUBURBS.get(k, []))}
                   for k, v in STATE_NAMES.items()], f, indent=2)

    print(f"\n✅ Total businesses: {len(all_businesses)}")
    print(f"✅ Categories: {len(categories_data)}")
    print(f"✅ Suburbs: {len(suburbs)}")
    print(f"✅ Data saved to {DATA_DIR}/")


if __name__ == "__main__":
    main()
