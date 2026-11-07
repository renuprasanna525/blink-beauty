import os
import sys
import json
from pathlib import Path
from getpass import getpass
from collections import Counter

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

HOST = "mysql-92dfd6e-blink-beauty-parlour.e.aivencloud.com"
DATABASE = "defaultdb"
CA_FILE = BASE_DIR / "ca.pem"
FIXTURE = BASE_DIR / "cms_production_seed.json"

if not CA_FILE.is_file():
    raise SystemExit(f"SSL certificate not found: {CA_FILE}")

if not FIXTURE.is_file():
    raise SystemExit(f"CMS fixture not found: {FIXTURE}")

password = getpass("Enter Aiven production database password: ")

os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings"
os.environ["DJANGO_DB_HOST"] = HOST
os.environ["DJANGO_DB_PORT"] = "18490"
os.environ["DJANGO_DB_NAME"] = DATABASE
os.environ["DJANGO_DB_USER"] = "avnadmin"
os.environ["DJANGO_DB_PASSWORD"] = password
os.environ["DB_SSL_CA"] = str(CA_FILE)

import django
django.setup()

from django.apps import apps
from django.conf import settings
from django.core.management import call_command
from django.db import connections, transaction

fixture_data = json.loads(FIXTURE.read_text(encoding="utf-8"))
expected_counts = Counter(item["model"] for item in fixture_data)

if len(fixture_data) != 110:
    raise SystemExit("ABORTED: Expected exactly 110 fixture records.")

if any(item["model"] == "parlour.appointmentbooking" for item in fixture_data):
    raise SystemExit("ABORTED: AppointmentBooking found in fixture.")

db_config = settings.DATABASES["default"]

if db_config["HOST"] != HOST or db_config["NAME"] != DATABASE:
    raise SystemExit(
        "ABORTED: Django database settings do not match Aiven production."
    )

cms_models = [
    model
    for model in apps.get_app_config("parlour").get_models()
    if model._meta.managed and model.__name__ != "AppointmentBooking"
]

connection = connections["default"]
connection.ensure_connection()

print("\n========== VERIFIED PRODUCTION CONNECTION ==========")
print("Host:", connection.settings_dict["HOST"])
print("Database:", connection.settings_dict["NAME"])

express_tables = ["admins", "bookings", "customers", "services"]

with connection.cursor() as cursor:
    express_before = {}

    for table in express_tables:
        cursor.execute(f"SELECT COUNT(*) FROM `{table}`")
        express_before[table] = cursor.fetchone()[0]

print("\n========== EXPRESS TABLE BASELINE ==========")
for table, count in express_before.items():
    print(f"{table}: {count}")

print("\n========== FINAL CMS EMPTY CHECK ==========")

for model in cms_models:
    count = model.objects.using("default").count()

    print(f"{model.__name__}: {count}")

    if count != 0:
        raise SystemExit(
            f"ABORTED: {model.__name__} is not empty. No import performed."
        )

print("\n========== IMPORTING CMS FIXTURE ==========")

try:
    with transaction.atomic(using="default"):

        call_command(
            "loaddata",
            str(FIXTURE),
            database="default",
            verbosity=2,
        )

        print("\n========== VERIFYING IMPORTED RECORDS ==========")

        total = 0

        for model in cms_models:
            label = model._meta.label_lower
            expected = expected_counts.get(label, 0)
            actual = model.objects.using("default").count()

            print(
                f"{model.__name__}: "
                f"expected={expected}, actual={actual}"
            )

            if actual != expected:
                raise RuntimeError(
                    f"Record count mismatch for {model.__name__}"
                )

            total += actual

        if total != 110:
            raise RuntimeError(
                f"Expected 110 imported records, found {total}"
            )

        with connection.cursor() as cursor:
            for table, previous_count in express_before.items():
                cursor.execute(f"SELECT COUNT(*) FROM `{table}`")
                current_count = cursor.fetchone()[0]

                if current_count != previous_count:
                    raise RuntimeError(
                        f"Express table {table} changed: "
                        f"{previous_count} -> {current_count}"
                    )

        print("\nAll verification checks passed inside transaction.")

except Exception as error:
    print("\nIMPORT FAILED — TRANSACTION ROLLED BACK")
    raise

print("\n========== PRODUCTION CMS IMPORT SUCCESS ==========")
print("Imported records:", total)
print("Express table row counts unchanged.")
print("AppointmentBooking excluded.")
print("No existing CMS records were overwritten.")
