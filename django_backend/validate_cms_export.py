import json
from pathlib import Path
from collections import Counter
from django.apps import apps
from django.core import serializers

fixture = Path("cms_production_seed.json")

if not fixture.exists():
    raise SystemExit("ERROR: CMS export file not found.")

data = json.loads(fixture.read_text(encoding="utf-8"))

print("\n========== FIXTURE VALIDATION ==========")
print("Total records:", len(data))

model_counts = Counter(item["model"] for item in data)
primary_keys = {}

for item in data:
    model = apps.get_model(item["model"])
    primary_keys.setdefault(item["model"], set())

    pk = item["pk"]

    if pk in primary_keys[item["model"]]:
        raise SystemExit(
            f"ERROR: Duplicate primary key {pk} in {item['model']}"
        )

    primary_keys[item["model"]].add(pk)

print("\n========== MODEL COUNTS ==========")

for model_name, count in sorted(model_counts.items()):
    print(f"{model_name}: {count}")

print("\n========== FOREIGN KEY VALIDATION ==========")

errors = []

for item in data:
    model = apps.get_model(item["model"])

    for field in model._meta.concrete_fields:
        if not field.is_relation or not field.many_to_one:
            continue

        target = field.related_model
        value = item["fields"].get(field.name)

        if value is None or not target._meta.managed:
            continue

        target_label = target._meta.label_lower

        if target_label not in primary_keys:
            errors.append(
                f"{item['model']} ID={item['pk']}: "
                f"missing related model {target_label}"
            )
        elif value not in primary_keys[target_label]:
            errors.append(
                f"{item['model']} ID={item['pk']}: "
                f"{field.name} references missing ID {value}"
            )

if errors:
    print("\n".join(errors))
    raise SystemExit("ERROR: Foreign-key validation failed.")

print("All exported foreign-key references are valid.")

print("\n========== DJANGO FIXTURE DESERIALIZATION ==========")

objects = list(serializers.deserialize("json", json.dumps(data)))
print("Successfully deserialized:", len(objects))

if len(objects) != 110:
    raise SystemExit("ERROR: Unexpected record count.")

if any(item["model"].lower() == "parlour.appointmentbooking" for item in data):
    raise SystemExit("ERROR: AppointmentBooking must be excluded.")

print("\nSUCCESS: Fixture validation passed.")
print("No database records were modified.")
