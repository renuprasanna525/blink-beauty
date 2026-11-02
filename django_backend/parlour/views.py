import json
import re
from datetime import datetime

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import transaction
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from .models import (
    Customer,
    ServiceItem,
    AppointmentBooking,
)
from .models import GallerySection, GalleryItem, GalleryTypography
from .models import (
    HeroSection,
    AboutSection,
    ServicesSection,
    ServiceCategory,
    MakeupShowcaseSection,
    MakeupShowcaseItem,
    MakeupShowcaseTypography,
    BeautyExperienceSection,
    BeautyExperienceItem,
    BeautyExperienceTypography,
    SpecialOffersSection,
    SpecialOffersTypography,
    ReviewsSection,
    Review,
    ReviewTypography,
    BranchesSection,
    Branch,
    BranchesTypography,
    BookingSection,
    InstagramSection,
    InstagramImage,
)


def public_hero(request):
    hero = HeroSection.objects.filter(is_active=True).order_by("-updated_at").first()

    if not hero:
        return JsonResponse(
            {
                "success": False,
                "message": "No active Hero section is available.",
            },
            status=404,
        )

    banner_image = ""

    if hero.banner_image:
        banner_image = request.build_absolute_uri(hero.banner_image.url)

    return JsonResponse(
        {
            "success": True,
            "hero": {
                "eyebrow_text": hero.eyebrow_text,
                "heading_line": hero.heading_line,
                "heading_emphasis": hero.heading_emphasis,
                "heading_suffix": hero.heading_suffix,
                "description": hero.description,
                "primary_button_text": hero.primary_button_text,
                "primary_button_link": hero.primary_button_link,
                "primary_button_icon": hero.primary_button_icon,
                "secondary_button_text": hero.secondary_button_text,
                "secondary_button_link": hero.secondary_button_link,
                "secondary_button_icon": hero.secondary_button_icon,
                "banner_image": banner_image,
            },
        }
    )


def public_about(request):
    about = (
        AboutSection.objects.filter(is_active=True)
        .prefetch_related("highlights")
        .order_by("-updated_at")
        .first()
    )

    if not about:
        return JsonResponse(
            {
                "success": False,
                "message": "No active About section is available.",
            },
            status=404,
        )

    background_image = ""

    if about.background_image:
        background_image = request.build_absolute_uri(about.background_image.url)

    highlights = [
        {
            "number": highlight.number,
            "title": highlight.title,
        }
        for highlight in about.highlights.all()
    ]

    return JsonResponse(
        {
            "success": True,
            "about": {
                "eyebrow_text": about.eyebrow_text,
                "heading_line_1": about.heading_line_1,
                "heading_line_2": about.heading_line_2,
                "specialties_text": about.specialties_text,
                "paragraph_1": about.paragraph_1,
                "paragraph_2": about.paragraph_2,
                "paragraph_3": about.paragraph_3,
                "highlights_heading": about.highlights_heading,
                "background_image": background_image,
                "highlights": highlights,
            },
        }
    )


def public_services(request):
    section = (
        ServicesSection.objects.filter(is_active=True).order_by("-updated_at").first()
    )

    if not section:
        return JsonResponse(
            {
                "success": False,
                "message": "No active Services section is available.",
            },
            status=404,
        )

    categories = []

    category_queryset = (
        ServiceCategory.objects.filter(section=section, is_active=True)
        .prefetch_related("items")
        .order_by("sort_order", "id")
    )

    for category in category_queryset:
        image_url = ""

        if category.image:
            image_url = request.build_absolute_uri(category.image.url)

        categories.append(
            {
                "id": category.slug,
                "label": category.label,
                "number": category.number,
                "icon_class": category.icon_class,
                "title": category.title,
                "description": category.description,
                "image": image_url,
                "services": [item.name for item in category.items.all()],
            }
        )

    return JsonResponse(
        {
            "success": True,
            "services": {
                "eyebrow_text": section.eyebrow_text,
                "heading_line_1": section.heading_line_1,
                "heading_line_2": section.heading_line_2,
                "booking_button_text": section.booking_button_text,
                "booking_button_link": section.booking_button_link,
                "categories": categories,
            },
        }
    )


def public_gallery(request):
    section = (
        GallerySection.objects.filter(is_active=True)
        .prefetch_related("items", "typography")
        .order_by("-updated_at")
        .first()
    )

    if not section:
        return JsonResponse(
            {
                "success": False,
                "message": "No active Gallery section is available.",
            },
            status=404,
        )

    items = []

    for item in section.items.filter(is_active=True):
        image_url = ""

        if item.image:
            image_url = request.build_absolute_uri(item.image.url)

        items.append(
            {
                "id": item.id,
                "title": item.title,
                "image": image_url,
                "icon_class": item.icon_class,
                "featured": item.featured,
                "sort_order": item.sort_order,
            }
        )

    typography = {}

    for setting in section.typography.all():
        typography[setting.element] = {
            "font_family": setting.font_family,
            "desktop_font_size": setting.desktop_font_size,
            "mobile_font_size": setting.mobile_font_size,
            "font_weight": setting.font_weight,
            "text_color": setting.text_color,
            "letter_spacing": float(setting.letter_spacing),
            "line_height": float(setting.line_height),
        }

    return JsonResponse(
        {
            "success": True,
            "gallery": {
                "eyebrow_text": section.eyebrow_text,
                "heading_line": section.heading_line,
                "instruction_text": section.instruction_text,
                "instruction_icon_class": section.instruction_icon_class,
                "instagram_button_text": section.instagram_button_text,
                "instagram_button_link": section.instagram_button_link,
                "instagram_button_icon_class": section.instagram_button_icon_class,
                "background_color": section.background_color,
                "text_color": section.text_color,
                "items": items,
                "typography": typography,
            },
        }
    )


def public_makeup_showcase(request):
    section = (
        MakeupShowcaseSection.objects.filter(is_active=True)
        .prefetch_related("items", "typography")
        .order_by("-updated_at")
        .first()
    )
    if not section:
        return JsonResponse(
            {
                "success": False,
                "message": "Makeup Showcase content not found",
            },
            status=404,
        )

    items = [
        {
            "id": item.id,
            "title": item.title,
            "icon_class": item.icon_class,
            "sort_order": item.sort_order,
        }
        for item in section.items.filter(is_active=True).order_by("sort_order", "id")
    ]

    typography = {
        setting.element: {
            "font_family": setting.font_family,
            "desktop_font_size": setting.desktop_font_size,
            "mobile_font_size": setting.mobile_font_size,
            "font_weight": setting.font_weight,
            "text_color": setting.text_color,
            "letter_spacing": float(setting.letter_spacing),
            "line_height": float(setting.line_height),
        }
        for setting in section.typography.all()
    }

    return JsonResponse(
        {
            "success": True,
            "makeup_showcase": {
                "eyebrow_text": section.eyebrow_text,
                "heading_line": section.heading_line,
                "heading_emphasis": section.heading_emphasis,
                "enquiry_button_text": section.enquiry_button_text,
                "enquiry_button_link": section.enquiry_button_link,
                "enquiry_button_icon_class": section.enquiry_button_icon_class,
                "items": items,
                "typography": typography,
            },
        }
    )


def public_beauty_experience(request):
    section = (
        BeautyExperienceSection.objects.filter(is_active=True)
        .prefetch_related("items", "typography")
        .order_by("-updated_at")
        .first()
    )

    if not section:
        return JsonResponse(
            {
                "success": False,
                "message": "Beauty Experience content is not available.",
            },
            status=404,
        )

    items = [
        {
            "id": item.id,
            "number": item.number,
            "icon_class": item.icon_class,
            "title": item.title,
            "description": item.description,
            "sort_order": item.sort_order,
        }
        for item in section.items.filter(is_active=True).order_by("sort_order", "id")
    ]

    typography = {
        setting.element: {
            "font_family": setting.font_family,
            "desktop_font_size": setting.desktop_font_size,
            "mobile_font_size": setting.mobile_font_size,
            "font_weight": setting.font_weight,
            "text_color": setting.text_color,
            "letter_spacing": float(setting.letter_spacing),
            "line_height": float(setting.line_height),
        }
        for setting in section.typography.all()
    }

    return JsonResponse(
        {
            "success": True,
            "beauty_experience": {
                "eyebrow_text": section.eyebrow_text,
                "heading_text": section.heading_text,
                "focus_text": section.focus_text,
                "items": items,
                "typography": typography,
            },
        }
    )


def public_special_offers(request):
    section = (
        SpecialOffersSection.objects.filter(is_active=True)
        .prefetch_related("typography")
        .order_by("-updated_at")
        .first()
    )

    if not section:
        return JsonResponse(
            {
                "success": False,
                "message": "Special Offers content is not available.",
            },
            status=404,
        )

    typography = {
        setting.element: {
            "font_family": setting.font_family,
            "desktop_font_size": setting.desktop_font_size,
            "mobile_font_size": setting.mobile_font_size,
            "font_weight": setting.font_weight,
            "text_color": setting.text_color,
            "letter_spacing": float(setting.letter_spacing),
            "line_height": float(setting.line_height),
        }
        for setting in section.typography.all()
    }

    return JsonResponse(
        {
            "success": True,
            "special_offers": {
                "eyebrow_text": section.eyebrow_text,
                "heading_text": section.heading_text,
                "paragraph_text": section.paragraph_text,
                "button_text": section.button_text,
                "button_link": section.button_link,
                "typography": typography,
            },
        }
    )


# ============================================================
# PUBLIC CLIENT FEEDBACK / REVIEWS API
# ============================================================


def public_reviews(request):
    section = (
        ReviewsSection.objects.filter(is_active=True)
        .prefetch_related("reviews", "typography")
        .order_by("-updated_at")
        .first()
    )

    if not section:
        return JsonResponse(
            {
                "success": False,
                "message": "Client Feedback content is not available.",
            },
            status=404,
        )

    reviews = [
        {
            "id": review.id,
            "service_label": review.service_label,
            "quote": review.quote,
            "customer_name": review.customer_name,
            "customer_initials": review.customer_initials,
            "visited_text": review.visited_text,
            "likes_count": review.likes_count,
            "likes_icon_class": review.likes_icon_class,
            "sort_order": review.sort_order,
        }
        for review in section.reviews.filter(is_active=True).order_by(
            "sort_order", "id"
        )
    ]

    typography = {
        setting.element: {
            "font_family": setting.font_family,
            "desktop_font_size": setting.desktop_font_size,
            "mobile_font_size": setting.mobile_font_size,
            "font_weight": setting.font_weight,
            "text_color": setting.text_color,
            "letter_spacing": float(setting.letter_spacing),
            "line_height": float(setting.line_height),
        }
        for setting in section.typography.all()
    }

    return JsonResponse(
        {
            "success": True,
            "reviews": {
                "eyebrow_text": section.eyebrow_text,
                "heading_text": section.heading_text,
                "google_button_text": section.google_button_text,
                "google_button_link": section.google_button_link,
                "google_button_icon_class": (section.google_button_icon_class),
                "background_color": section.background_color,
                "card_background_color": section.card_background_color,
                "text_color": section.text_color,
                "accent_color": section.accent_color,
                "items": reviews,
                "typography": typography,
            },
        }
    )


# ============================================================
# PUBLIC OUR BRANCHES API
# ============================================================


def public_branches(request):
    section = (
        BranchesSection.objects.filter(is_active=True)
        .prefetch_related("branches", "typography")
        .order_by("-updated_at")
        .first()
    )

    if not section:
        return JsonResponse(
            {
                "success": False,
                "message": "Our Branches content is not available.",
            },
            status=404,
        )

    background_image = ""

    if section.background_image:
        background_image = request.build_absolute_uri(section.background_image.url)

    items = [
        {
            "id": branch.id,
            "name": branch.name,
            "icon_class": branch.icon_class,
            "directions_text": branch.directions_text,
            "is_active": branch.is_active,
            "sort_order": branch.sort_order,
        }
        for branch in section.branches.filter(is_active=True).order_by(
            "sort_order", "id"
        )
    ]

    typography = {
        setting.element: {
            "font_family": setting.font_family,
            "desktop_font_size": setting.desktop_font_size,
            "mobile_font_size": setting.mobile_font_size,
            "font_weight": setting.font_weight,
            "text_color": setting.text_color,
            "letter_spacing": float(setting.letter_spacing),
            "line_height": float(setting.line_height),
        }
        for setting in section.typography.all()
    }

    return JsonResponse(
        {
            "success": True,
            "branches": {
                "is_active": section.is_active,
                "eyebrow_text": section.eyebrow_text,
                "heading_text": section.heading_text,
                "background_image": background_image,
                "eyebrow_color": section.eyebrow_color,
                "heading_color": section.heading_color,
                "icon_color": section.icon_color,
                "card_background_color": section.card_background_color,
                "card_border_color": section.card_border_color,
                "button_background_color": section.button_background_color,
                "button_text_color": section.button_text_color,
                "items": items,
                "typography": typography,
            },
        }
    )


# ============================================================
# PUBLIC BOOKING SECTION API
# ============================================================


def public_booking(request):
    section = (
        BookingSection.objects.filter(is_active=True).order_by("-updated_at").first()
    )

    if not section:
        return JsonResponse(
            {
                "success": False,
                "message": "Booking Section content is not available.",
            },
            status=404,
        )

    return JsonResponse(
        {
            "success": True,
            "booking": {
                "eyebrow_text": section.eyebrow_text,
                "heading_text": section.heading_text,
                "description_text": section.description_text,
                "phone_1": section.phone_1,
                "phone_2": section.phone_2,
            },
        }
    )


# ============================================================
# PUBLIC INSTAGRAM SECTION API
# ============================================================


def public_instagram(request):
    section = (
        InstagramSection.objects.filter(is_active=True)
        .prefetch_related("images")
        .order_by("-updated_at")
        .first()
    )

    if not section:
        return JsonResponse(
            {
                "success": False,
                "message": "Instagram Section content is not available.",
            },
            status=404,
        )

    images = []

    for item in section.images.filter(is_active=True).order_by("sort_order", "id"):
        if item.image:
            images.append(
                {
                    "id": item.id,
                    "image": request.build_absolute_uri(item.image.url),
                    "alt_text": item.alt_text,
                    "sort_order": item.sort_order,
                }
            )

    return JsonResponse(
        {
            "success": True,
            "instagram": {
                "eyebrow_text": section.eyebrow_text,
                "heading_text": section.heading_text,
                "instagram_handle": section.instagram_handle,
                "follow_button_text": section.follow_button_text,
                "images": images,
            },
        }
    )


# ============================================================
# PUBLIC APPOINTMENT BOOKING APIs
# ============================================================


@require_GET
def public_booking_services(request):
    section = (
        ServicesSection.objects.filter(is_active=True).order_by("-updated_at").first()
    )

    if not section:
        return JsonResponse(
            {"success": False, "message": "No active services are available."},
            status=404,
        )

    categories = []

    queryset = (
        ServiceCategory.objects.filter(section=section, is_active=True)
        .prefetch_related("items")
        .order_by("sort_order", "id")
    )

    for category in queryset:
        items = [
            {
                "id": item.id,
                "name": item.name,
            }
            for item in category.items.all()
        ]

        if items:
            categories.append(
                {
                    "id": category.id,
                    "label": category.label,
                    "title": category.title,
                    "items": items,
                }
            )

    return JsonResponse(
        {
            "success": True,
            "categories": categories,
        }
    )


@csrf_exempt
@require_POST
def create_public_booking(request):
    try:
        data = json.loads(request.body or "{}")

        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        phone = str(data.get("phone", "")).strip()
        service_id = data.get("service_id")
        branch_id = data.get("branch_id")
        appointment_date = str(data.get("appointment_date", "")).strip()
        appointment_time = str(data.get("appointment_time", "")).strip()

        if len(name) < 2 or len(name) > 150:
            return JsonResponse(
                {"success": False, "message": "Enter a valid name."},
                status=400,
            )

        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse(
                {"success": False, "message": "Enter a valid email address."},
                status=400,
            )

        phone_digits = re.sub(r"\D", "", phone)

        if not 7 <= len(phone_digits) <= 15:
            return JsonResponse(
                {"success": False, "message": "Enter a valid phone number."},
                status=400,
            )

        try:
            service_id = int(service_id)
            branch_id = int(branch_id)

            selected_date = datetime.strptime(appointment_date, "%Y-%m-%d").date()

            selected_time = datetime.strptime(appointment_time, "%H:%M").time()

        except (TypeError, ValueError):
            return JsonResponse(
                {
                    "success": False,
                    "message": "Select a valid service, branch, date and time.",
                },
                status=400,
            )

        appointment_datetime = timezone.make_aware(
            datetime.combine(selected_date, selected_time),
            timezone.get_current_timezone(),
        )

        if appointment_datetime < timezone.localtime():
            return JsonResponse(
                {
                    "success": False,
                    "message": "Please select a future appointment time.",
                },
                status=400,
            )

        service = (
            ServiceItem.objects.select_related("category__section")
            .filter(
                id=service_id,
                category__is_active=True,
                category__section__is_active=True,
            )
            .first()
        )

        if not service:
            return JsonResponse(
                {"success": False, "message": "The selected service is unavailable."},
                status=400,
            )

        branch = (
            Branch.objects.select_related("section")
            .filter(
                id=branch_id,
                is_active=True,
                section__is_active=True,
            )
            .first()
        )

        if not branch:
            return JsonResponse(
                {"success": False, "message": "The selected branch is unavailable."},
                status=400,
            )

        now = timezone.now()

        with transaction.atomic():
            customer = Customer.objects.filter(phone=phone_digits).first()

            if customer:
                customer.full_name = name
                customer.email = email
                customer.phone = phone_digits
                customer.updated_at = now
                customer.save(
                    update_fields=[
                        "full_name",
                        "email",
                        "phone",
                        "updated_at",
                    ]
                )
            else:
                customer = Customer.objects.create(
                    full_name=name,
                    email=email,
                    phone=phone_digits,
                    created_at=now,
                    updated_at=now,
                )

            booking = AppointmentBooking.objects.create(
                customer_id=customer.id,
                service_item=service,
                branch=branch,
                appointment_date=selected_date,
                appointment_time=selected_time,
                status="pending",
            )

        return JsonResponse(
            {
                "success": True,
                "message": "Your appointment request has been submitted successfully.",
                "booking": {
                    "id": booking.id,
                    "status": booking.status,
                    "service": service.name,
                    "branch": branch.name,
                    "appointment_date": str(selected_date),
                    "appointment_time": selected_time.strftime("%H:%M"),
                },
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {"success": False, "message": "Invalid request data."},
            status=400,
        )

    except Exception:
        return JsonResponse(
            {
                "success": False,
                "message": "Unable to submit your appointment. Please try again.",
            },
            status=500,
        )
