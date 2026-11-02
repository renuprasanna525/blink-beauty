from django.db import migrations, models


def preserve_gallery_heading(apps, schema_editor):
    GallerySection = apps.get_model("parlour", "GallerySection")
    database = schema_editor.connection.alias

    for section in GallerySection.objects.using(database).all():
        heading = (section.heading_line or "").strip()
        emphasis = (section.heading_emphasis or "").strip()

        if emphasis and not heading.endswith(emphasis):
            section.heading_line = f"{heading} {emphasis}".strip()
            section.save(using=database, update_fields=["heading_line"])


class Migration(migrations.Migration):

    dependencies = [
        ("parlour", "0016_beautyexperienceitem_icon_class_and_more"),
    ]

    operations = [
        migrations.RunPython(
            preserve_gallery_heading,
            migrations.RunPython.noop,
        ),
        migrations.RemoveField(
            model_name="gallerysection",
            name="heading_emphasis",
        ),
        migrations.AlterField(
            model_name="gallerysection",
            name="heading_line",
            field=models.CharField(default="Ready for a new look?", max_length=255),
        ),
        migrations.AlterField(
            model_name="gallerysection",
            name="instruction_icon_class",
            field=models.CharField(
                default="bi bi-arrows-move",
                help_text="Bootstrap Icon class, e.g. bi bi-arrows-move",
                max_length=100,
            ),
        ),
        migrations.AlterField(
            model_name="gallerytypography",
            name="element",
            field=models.CharField(
                choices=[
                    ("eyebrow", "Eyebrow Text"),
                    ("heading", "Main Heading"),
                    ("instruction", "Drag Instruction"),
                    ("card_label", "Gallery Card Labels"),
                    ("instagram_button", "Instagram Button"),
                ],
                max_length=30,
            ),
        ),
    ]