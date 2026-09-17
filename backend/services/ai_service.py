import re
from typing import Dict, Any, List, Optional

CATEGORY_DEPARTMENTS = {
    "Road Damage": "AP Roads & Buildings (R&B)",
    "Drainage": "Panchayat Raj & Rural Sanitation",
    "Water Supply": "Rural Water Supply (RWS)",
    "Street Light": "APSPDCL / APEPDCL Electricity Dept",
    "Garbage": "Swachha Andhra Corporation / Sanitation",
    "Electricity": "AP State Electricity Board",
    "Sanitation": "Public Health & Sanitation Dept",
    "Others": "General Panchayati Raj Administration"
}

def predict_category(title: str, description: str) -> Dict[str, Any]:
    combined = (title + " " + description).lower()

    if re.search(r'pothole|road|asphalt|highway|street|bridge|culvert|cave-in|tar|pathway|muddy road|dirt road|trench', combined):
        return {
            "suggestedCategory": "Road Damage",
            "confidence": 94,
            "reasoning": "Detected road infrastructure terms (pothole, asphalt, street, pathway, trench)."
        }

    if re.search(r'drain|drainage|sewage|choked|overflow|gutter|flooding|wastewater|stagnant water|mud drain|clog', combined):
        return {
            "suggestedCategory": "Drainage",
            "confidence": 92,
            "reasoning": "Detected drainage and wastewater keywords (drain, sewage, choked, gutter, flooding)."
        }

    if re.search(r'water|pipeline|leak|leakage|handpump|borewell|water tank|drinking water|tap|pressure|contamination|water supply', combined):
        return {
            "suggestedCategory": "Water Supply",
            "confidence": 96,
            "reasoning": "Detected water resource terms (water, pipeline, handpump, leakage, tap, borewell)."
        }

    if re.search(r'light|streetlight|lamp|solar light|led|bulb|dark|strobe|flicker|night', combined):
        return {
            "suggestedCategory": "Street Light",
            "confidence": 91,
            "reasoning": "Detected illumination keywords (streetlight, lamp, bulb, solar light, dark road)."
        }

    if re.search(r'garbage|trash|waste|dustbin|dump|dumping|polythene|plastic|carcass|haat waste|litter', combined):
        return {
            "suggestedCategory": "Garbage",
            "confidence": 93,
            "reasoning": "Detected municipal solid waste keywords (garbage, trash, waste, dumping, dustbin)."
        }

    if re.search(r'electric|wire|cable|transformer|voltage|sparking|shock|electrocution|current|power|substation|pole|fluctuation', combined):
        return {
            "suggestedCategory": "Electricity",
            "confidence": 95,
            "reasoning": "Detected electrical grid & safety keywords (electric, transformer, wire, voltage, power)."
        }

    if re.search(r'toilet|sanitation|clean|cleaning|mosquito|larvae|bleaching|fogging|disinfection|odor|smell', combined):
        return {
            "suggestedCategory": "Sanitation",
            "confidence": 90,
            "reasoning": "Detected public hygiene & sanitation terms (toilet, mosquito, cleaning, disinfection)."
        }

    return {
        "suggestedCategory": "Others",
        "confidence": 70,
        "reasoning": "General civic request requiring municipal review."
    }

def predict_priority(title: str, description: str) -> Dict[str, Any]:
    combined = (title + " " + description).lower()
    high_keywords = [
        'accident', 'death', 'injury', 'danger', 'shock', 'sparking', 'live wire',
        'electrocution', 'burst', 'flood', 'flooding', 'school', 'hospital',
        'child', 'children', 'poison', 'contamination', 'emergency', 'fallen pole',
        'collapsed', 'cave-in', 'unconscious', 'urgent', 'fire', 'hazard'
    ]
    medium_keywords = [
        'overflow', 'choked', 'stagnant', 'odour', 'smell', 'mosquito', 'leakage',
        'dark', 'darkness', 'inconvenience', 'blockage', 'pothole', 'broken', 'low voltage'
    ]

    matched_high = [k for k in high_keywords if k in combined]
    matched_medium = [k for k in medium_keywords if k in combined]

    if matched_high:
        return {
            "suggestedPriority": "High",
            "reasons": [f'Critical safety trigger keyword: "{k}"' for k in matched_high]
        }
    if matched_medium:
        return {
            "suggestedPriority": "Medium",
            "reasons": [f'Moderate impact keyword: "{k}"' for k in matched_medium]
        }
    return {
        "suggestedPriority": "Low",
        "reasons": ["Standard routine maintenance issue"]
    }

def check_smart_duplicate(title: str, description: str, village: str, existing_complaints: List[dict]) -> Optional[dict]:
    if not village or (not title and not description):
        return None

    current_words = [
        w for w in re.sub(r'[^\w\s]', '', (title + ' ' + description).lower()).split()
        if len(w) > 3
    ]
    if len(current_words) < 2:
        return None

    for c in existing_complaints:
        if c.get('village', '').lower() == village.lower() and c.get('status') not in ['Resolved', 'Rejected']:
            existing_words = [
                w for w in re.sub(r'[^\w\s]', '', (c.get('title', '') + ' ' + c.get('description', '')).lower()).split()
                if len(w) > 3
            ]
            intersection = [w for w in current_words if w in existing_words]
            if not existing_words or not current_words:
                continue
            overlap_score = len(intersection) / min(len(current_words), len(existing_words))
            if overlap_score >= 0.4:
                return c

    return None

def analyze_complaint(title: str, description: str, village: Optional[str] = None, existing_complaints: Optional[List[dict]] = None) -> Dict[str, Any]:
    cat_res = predict_category(title, description)
    prio_res = predict_priority(title, description)
    dept = CATEGORY_DEPARTMENTS.get(cat_res["suggestedCategory"], "General Administration")

    duplicate_match = check_smart_duplicate(title, description, village or "", existing_complaints or []) if existing_complaints else None

    return {
        "suggestedCategory": cat_res["suggestedCategory"],
        "categoryConfidence": cat_res["confidence"],
        "categoryReasoning": cat_res["reasoning"],
        "suggestedPriority": prio_res["suggestedPriority"],
        "priorityReasons": prio_res["reasons"],
        "suggestedDepartment": dept,
        "isPossibleDuplicate": bool(duplicate_match),
        "duplicateComplaintId": duplicate_match.get("id") if duplicate_match else None
    }
