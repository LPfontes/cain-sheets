import json
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "data" / "en" / "blasphemies.json"

TERMS = {
    "tensao": ("Tension", "Iron Soul", ["Aegis", "Stasis", "Severance", "Malleate", "Fortress"]),
    "ardencia": ("Ardence", "Inner Furnace", ["Fury", "Void", "Hell", "Sabre", "Storm"]),
    "fluxo": ("Flux", "Steal Time", ["Reversal", "Stop", "Quickening", "Schism", "Stutter"]),
    "vetor": ("Vector", "Brake", ["Fling", "Lift", "Current", "Bullet", "Finesse"]),
    "portao": ("Gate", "Pocket", ["Tear", "Pinch", "Bloom", "Maze", "Transmission"]),
    "sufoco": ("Smother", "Absentia", ["Hollow", "Abstract", "Smooth", "Dark Age", "Blind"]),
    "sussurro": ("Whisper", "Shadow", ["Omen", "Shiver", "Dissect", "Precognition", "Omnipresence"]),
    "editar": ("Edit", "Mimic", ["Uniform", "Absurd", "Utility", "Copy", "Filter"]),
    "vinculo": ("Bind", "Sin Binding", ["Forbidden Spirit", "Surrender", "Horde Spirit", "Hunter Spirit", "Penumbra"]),
    "assombracao": ("Jaunt", "Ghostwire", ["Possession", "Geist", "Threads", "Desecrate", "Passenger"]),
    "palacio": ("Palace", "Sanctum", ["Library", "Cellar", "Foyer", "Parlor", "Bar"]),
    "simpatia": ("Sympathy", "Resonance", ["Amplify", "Bond", "Psychometry", "Diplomacy", "Alliance"]),
}

with PATH.open(encoding="utf-8") as file:
    entries = json.load(file)

for entry in entries:
    name, passive, powers = TERMS[entry["id"]]
    entry["name"] = name
    entry["passive"] = entry["passive"].replace(entry["passive"].split("</strong>", 1)[0], f"<strong>{passive}:")
    for power, power_name in zip(entry["powers"], powers):
        power["name"] = power_name

with PATH.open("w", encoding="utf-8", newline="\n") as file:
    json.dump(entries, file, ensure_ascii=False, indent=2)
    file.write("\n")
