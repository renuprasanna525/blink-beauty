from django.urls import path
from . import views

urlpatterns = [
    path(
        "website/beauty-experience/",
        views.public_beauty_experience,
        name="public-beauty-experience",
    ),
    path("website/hero/", views.public_hero, name="public-hero"),
    path("website/about/", views.public_about, name="public-about"),
    path("website/services/", views.public_services, name="public-services"),
    path("website/gallery/", views.public_gallery, name="public-gallery"),
    path(
        "website/makeup-showcase/",
        views.public_makeup_showcase,
        name="public-makeup-showcase",
    ),
    path(
        "website/special-offers/",
        views.public_special_offers,
        name="public-special-offers",
    ),
    path(
        "website/reviews/",
        views.public_reviews,
        name="public-reviews",
    ),
    path(
        "website/branches/",
        views.public_branches,
        name="public-branches",
    ),
    path(
        "website/booking/",
        views.public_booking,
        name="public-booking",
    ),
    path(
        "website/instagram/",
        views.public_instagram,
        name="public-instagram",
    ),
    path(
        "booking/services/",
        views.public_booking_services,
        name="public-booking-services",
    ),
    path(
        "booking/create/",
        views.create_public_booking,
        name="create-public-booking",
    ),
]
