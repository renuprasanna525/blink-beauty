import json
from pathlib import Path
from django.apps import apps
from django.core import serializers

models = [
    model
    for model in apps.get_app_config("parlour").get_models()
    if model._meta.managed and model.__name__ != "AppointmentBooking"
]

records = []

print("\n========== CMS EXPORT INVENTORY ==========")

for model in models:
    queryset = model.objects.all().order_by("pk")
    count = queryset.count()

    print(f"{model.__name__}: {count}")

    if count:
        records.extend(
            json.loads(serializers.serialize("json", queryset))
        )

output = Path("cms_production_seed.json")

with output.open("w", encoding="utf-8") as file:
    json.dump(records, file, ensure_ascii=False, indent=2)

print("\n========== EXPORT RESULT ==========")
print("Output:", output.resolve())
print("Total records:", len(records))
print("File size:", output.stat().st_size, "bytes")
print("AppointmentBooking excluded.")
