from django.apps import apps
from django.conf import settings
from pathlib import Path

print("\n========== LOCAL MEDIA CONFIGURATION ==========")
print("MEDIA_ROOT:", settings.MEDIA_ROOT)
print("MEDIA_ROOT EXISTS:", Path(settings.MEDIA_ROOT).exists())

print("\n========== CMS IMAGE FIELD INVENTORY ==========")

for model in apps.get_app_config("parlour").get_models():
    if not model._meta.managed or model.__name__ == "AppointmentBooking":
        continue

    file_fields = [
        field for field in model._meta.concrete_fields
        if field.get_internal_type() in ("ImageField", "FileField")
    ]

    for record in model.objects.all():
        for field in file_fields:
            file_value = getattr(record, field.name)
            name = file_value.name if file_value else ""

            if name:
                try:
                    exists = file_value.storage.exists(name)
                except Exception as error:
                    exists = f"CHECK ERROR: {error}"

                print(
                    f"{model.__name__} | ID={record.pk} | "
                    f"{field.name} | {name} | EXISTS={exists}"
                )
            else:
                print(
                    f"{model.__name__} | ID={record.pk} | "
                    f"{field.name} | EMPTY"
                )
