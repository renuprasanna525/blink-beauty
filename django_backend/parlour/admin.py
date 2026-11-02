from django.contrib import admin
from .models import (
    HeroSection,
    AboutSection,
    AboutHighlight,
    ServicesSection,
    ServiceCategory,
    ServiceItem,
    GallerySection,
    GalleryItem,
    GalleryTypography,
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
    AppointmentBooking,
)


@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = (
        "heading_line",
        "heading_emphasis",
        "is_active",
        "updated_at",
    )

    list_filter = ("is_active",)

    search_fields = (
        "heading_line",
        "heading_emphasis",
        "eyebrow_text",
        "description",
    )

    fieldsets = (
        (
            "Hero Banner",
            {
                "fields": ("banner_image", "is_active"),
            },
        ),
        (
            "Eyebrow Text",
            {
                "fields": ("eyebrow_text",),
            },
        ),
        (
            "Main Heading",
            {
                "fields": (
                    "heading_line",
                    "heading_emphasis",
                    "heading_suffix",
                    "description",
                ),
            },
        ),
        (
            "Primary Button",
            {
                "fields": (
                    "primary_button_text",
                    "primary_button_link",
                    "primary_button_icon",
                ),
            },
        ),
        (
            "Secondary Button",
            {
                "fields": (
                    "secondary_button_text",
                    "secondary_button_link",
                    "secondary_button_icon",
                ),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
            },
        ),
    )

    readonly_fields = ("created_at", "updated_at")


class AboutHighlightInline(admin.TabularInline):
    model = AboutHighlight
    extra = 0
    fields = ("number", "title", "sort_order")
    ordering = ("sort_order", "id")


@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    list_display = (
        "eyebrow_text",
        "highlights_heading",
        "is_active",
        "updated_at",
    )

    list_filter = ("is_active",)

    search_fields = (
        "eyebrow_text",
        "heading_line_1",
        "heading_line_2",
        "specialties_text",
    )

    inlines = (AboutHighlightInline,)

    fieldsets = (
        (
            "About Background",
            {
                "fields": ("background_image", "is_active"),
            },
        ),
        (
            "Eyebrow and Main Heading",
            {
                "fields": (
                    "eyebrow_text",
                    "heading_line_1",
                    "heading_line_2",
                ),
            },
        ),
        (
            "Specialties",
            {
                "fields": ("specialties_text",),
            },
        ),
        (
            "About Paragraphs",
            {
                "fields": (
                    "paragraph_1",
                    "paragraph_2",
                    "paragraph_3",
                ),
            },
        ),
        (
            "Highlights Heading",
            {
                "fields": ("highlights_heading",),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
            },
        ),
    )

    readonly_fields = ("created_at", "updated_at")


class ServiceItemInline(admin.TabularInline):
    model = ServiceItem
    extra = 0
    fields = ("name", "sort_order")
    ordering = ("sort_order", "id")


@admin.register(ServicesSection)
class ServicesSectionAdmin(admin.ModelAdmin):
    list_display = (
        "eyebrow_text",
        "heading_line_1",
        "is_active",
        "updated_at",
    )
    list_filter = ("is_active",)
    search_fields = ("eyebrow_text", "heading_line_1", "heading_line_2")

    fieldsets = (
        (
            "Section Heading",
            {
                "fields": (
                    "eyebrow_text",
                    "heading_line_1",
                    "heading_line_2",
                ),
            },
        ),
        (
            "Booking Button",
            {
                "fields": (
                    "booking_button_text",
                    "booking_button_link",
                ),
            },
        ),
        (
            "Status",
            {
                "fields": ("is_active",),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
            },
        ),
    )
    readonly_fields = ("created_at", "updated_at")


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "label",
        "number",
        "icon_class",
        "sort_order",
        "is_active",
        "updated_at",
    )
    list_filter = ("is_active", "section")
    search_fields = ("title", "label", "description", "slug")
    inlines = (ServiceItemInline,)

    fieldsets = (
        (
            "Category Details",
            {
                "fields": (
                    "section",
                    "slug",
                    "label",
                    "number",
                    "icon_class",
                    "title",
                    "description",
                ),
            },
        ),
        (
            "Category Image",
            {
                "fields": ("image",),
            },
        ),
        (
            "Display Settings",
            {
                "fields": ("sort_order", "is_active"),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
            },
        ),
    )
    readonly_fields = ("created_at", "updated_at")


class GalleryItemInline(admin.TabularInline):
    model = GalleryItem
    extra = 0
    fields = (
        "title",
        "image",
        "icon_class",
        "featured",
        "sort_order",
        "is_active",
    )
    ordering = ("sort_order", "id")


class GalleryTypographyInline(admin.TabularInline):
    model = GalleryTypography
    extra = 0
    fields = (
        "element",
        "font_family",
        "desktop_font_size",
        "mobile_font_size",
        "font_weight",
        "text_color",
        "letter_spacing",
        "line_height",
    )


@admin.register(GallerySection)
class GallerySectionAdmin(admin.ModelAdmin):
    list_display = (
        "eyebrow_text",
        "heading_line",
        "is_active",
        "updated_at",
    )

    list_filter = ("is_active",)

    search_fields = (
        "eyebrow_text",
        "heading_line",
        "instruction_text",
    )

    inlines = (
        GalleryItemInline,
        GalleryTypographyInline,
    )

    fieldsets = (
        (
            "Gallery Section Heading",
            {
                "fields": (
                    "eyebrow_text",
                    "heading_line",
                ),
            },
        ),
        (
            "Drag Instruction and Icon",
            {
                "fields": (
                    "instruction_text",
                    "instruction_icon_class",
                ),
            },
        ),
        (
            "Instagram Button",
            {
                "fields": (
                    "instagram_button_text",
                    "instagram_button_link",
                    "instagram_button_icon_class",
                ),
            },
        ),
        (
            "Section Appearance",
            {
                "fields": (
                    "background_color",
                    "text_color",
                    "is_active",
                ),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
            },
        ),
    )

    readonly_fields = ("created_at", "updated_at")


class MakeupShowcaseItemInline(admin.TabularInline):
    model = MakeupShowcaseItem
    extra = 0
    fields = (
        "title",
        "icon_class",
        "sort_order",
        "is_active",
    )
    ordering = ("sort_order", "id")


class MakeupShowcaseTypographyInline(admin.TabularInline):
    model = MakeupShowcaseTypography
    extra = 0
    fields = (
        "element",
        "font_family",
        "desktop_font_size",
        "mobile_font_size",
        "font_weight",
        "text_color",
        "letter_spacing",
        "line_height",
    )


@admin.register(MakeupShowcaseSection)
class MakeupShowcaseSectionAdmin(admin.ModelAdmin):
    list_display = (
        "eyebrow_text",
        "heading_line",
        "heading_emphasis",
        "is_active",
        "updated_at",
    )

    list_filter = ("is_active",)

    search_fields = (
        "eyebrow_text",
        "heading_line",
        "heading_emphasis",
    )

    inlines = (
        MakeupShowcaseItemInline,
        MakeupShowcaseTypographyInline,
    )

    fieldsets = (
        (
            "Section Heading",
            {
                "fields": (
                    "eyebrow_text",
                    "heading_line",
                    "heading_emphasis",
                ),
            },
        ),
        (
            "Enquiry Button",
            {
                "fields": (
                    "enquiry_button_text",
                    "enquiry_button_link",
                    "enquiry_button_icon_class",
                ),
            },
        ),
        (
            "Status",
            {
                "fields": ("is_active",),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
            },
        ),
    )

    readonly_fields = ("created_at", "updated_at")


class BeautyExperienceItemInline(admin.TabularInline):
    model = BeautyExperienceItem
    extra = 0
    fields = (
        "number",
        "icon_class",
        "title",
        "description",
        "sort_order",
        "is_active",
    )
    ordering = ("sort_order", "id")


class BeautyExperienceTypographyInline(admin.TabularInline):
    model = BeautyExperienceTypography
    extra = 0
    fields = (
        "element",
        "font_family",
        "desktop_font_size",
        "mobile_font_size",
        "font_weight",
        "text_color",
        "letter_spacing",
        "line_height",
    )


@admin.register(BeautyExperienceSection)
class BeautyExperienceSectionAdmin(admin.ModelAdmin):
    list_display = (
        "eyebrow_text",
        "heading_text",
        "focus_text",
        "is_active",
        "updated_at",
    )

    list_filter = ("is_active",)

    search_fields = (
        "eyebrow_text",
        "heading_text",
        "focus_text",
    )

    inlines = (
        BeautyExperienceItemInline,
        BeautyExperienceTypographyInline,
    )

    fieldsets = (
        (
            "Section Content",
            {
                "fields": (
                    "eyebrow_text",
                    "heading_text",
                    "focus_text",
                ),
            },
        ),
        (
            "Status",
            {
                "fields": ("is_active",),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
            },
        ),
    )

    readonly_fields = ("created_at", "updated_at")


class SpecialOffersTypographyInline(admin.TabularInline):
    model = SpecialOffersTypography
    extra = 0
    fields = (
        "element",
        "font_family",
        "desktop_font_size",
        "mobile_font_size",
        "font_weight",
        "text_color",
        "letter_spacing",
        "line_height",
    )


@admin.register(SpecialOffersSection)
class SpecialOffersSectionAdmin(admin.ModelAdmin):
    list_display = (
        "eyebrow_text",
        "heading_text",
        "button_text",
        "is_active",
        "updated_at",
    )

    list_filter = ("is_active",)

    search_fields = (
        "eyebrow_text",
        "heading_text",
        "paragraph_text",
    )

    inlines = (SpecialOffersTypographyInline,)

    fieldsets = (
        (
            "Special Offers Content",
            {
                "fields": (
                    "eyebrow_text",
                    "heading_text",
                    "paragraph_text",
                    "button_text",
                    "button_link",
                ),
            },
        ),
        (
            "Status",
            {
                "fields": ("is_active",),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
            },
        ),
    )

    readonly_fields = ("created_at", "updated_at")

    # ============================================================


# CLIENT FEEDBACK / REVIEWS ADMIN
# ============================================================


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1
    fields = (
        "service_label",
        "quote",
        "customer_name",
        "customer_initials",
        "visited_text",
        "likes_count",
        "likes_icon_class",
        "is_active",
        "sort_order",
    )
    ordering = ("sort_order", "id")


class ReviewTypographyInline(admin.TabularInline):
    model = ReviewTypography
    extra = 0
    fields = (
        "element",
        "font_family",
        "desktop_font_size",
        "mobile_font_size",
        "font_weight",
        "text_color",
        "letter_spacing",
        "line_height",
    )


@admin.register(ReviewsSection)
class ReviewsSectionAdmin(admin.ModelAdmin):
    list_display = (
        "eyebrow_text",
        "heading_text",
        "is_active",
        "updated_at",
    )

    list_filter = ("is_active",)

    search_fields = (
        "eyebrow_text",
        "heading_text",
    )

    inlines = (
        ReviewInline,
        ReviewTypographyInline,
    )

    fieldsets = (
        (
            "Section Content",
            {
                "fields": (
                    "eyebrow_text",
                    "heading_text",
                    "is_active",
                ),
            },
        ),
        (
            "Google Reviews Button",
            {
                "fields": (
                    "google_button_text",
                    "google_button_link",
                    "google_button_icon_class",
                ),
            },
        ),
        (
            "Section Appearance",
            {
                "fields": (
                    "background_color",
                    "card_background_color",
                    "text_color",
                    "accent_color",
                ),
            },
        ),
        (
            "Timestamps",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        "customer_name",
        "service_label",
        "likes_count",
        "is_active",
        "sort_order",
    )

    list_filter = (
        "is_active",
        "section",
    )

    search_fields = (
        "customer_name",
        "service_label",
        "quote",
    )

    ordering = (
        "sort_order",
        "id",
    )


@admin.register(ReviewTypography)
class ReviewTypographyAdmin(admin.ModelAdmin):
    list_display = (
        "section",
        "element",
        "font_family",
        "desktop_font_size",
        "mobile_font_size",
        "font_weight",
    )

    list_filter = (
        "element",
        "font_family",
    )

    search_fields = (
        "section__eyebrow_text",
        "element",
        "font_family",
    )


# ============================================================
# OUR BRANCHES ADMIN
# ============================================================


class BranchInline(admin.TabularInline):
    model = Branch
    extra = 1
    fields = (
        "name",
        "icon_class",
        "directions_text",
        "is_active",
        "sort_order",
    )
    ordering = ("sort_order", "id")


class BranchesTypographyInline(admin.TabularInline):
    model = BranchesTypography
    extra = 0
    fields = (
        "element",
        "font_family",
        "desktop_font_size",
        "mobile_font_size",
        "font_weight",
        "text_color",
        "letter_spacing",
        "line_height",
    )


@admin.register(BranchesSection)
class BranchesSectionAdmin(admin.ModelAdmin):
    list_display = (
        "eyebrow_text",
        "heading_text",
        "is_active",
        "updated_at",
    )

    list_filter = ("is_active",)

    search_fields = (
        "eyebrow_text",
        "heading_text",
    )

    inlines = (
        BranchInline,
        BranchesTypographyInline,
    )

    fieldsets = (
        (
            "Section Heading",
            {
                "fields": (
                    "eyebrow_text",
                    "heading_text",
                ),
            },
        ),
        (
            "Background Image",
            {
                "fields": ("background_image",),
            },
        ),
        (
            "Section and Card Colors",
            {
                "fields": (
                    "eyebrow_color",
                    "heading_color",
                    "icon_color",
                    "card_background_color",
                    "card_border_color",
                    "button_background_color",
                    "button_text_color",
                ),
            },
        ),
        (
            "Status",
            {
                "fields": ("is_active",),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
            },
        ),
    )

    readonly_fields = ("created_at", "updated_at")


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "section",
        "directions_text",
        "is_active",
        "sort_order",
    )

    list_filter = ("is_active", "section")

    search_fields = ("name",)

    ordering = ("sort_order", "id")


@admin.register(BranchesTypography)
class BranchesTypographyAdmin(admin.ModelAdmin):
    list_display = (
        "section",
        "element",
        "font_family",
        "desktop_font_size",
        "mobile_font_size",
        "font_weight",
    )

    list_filter = ("element", "font_family")

    # ============================================================


# BOOKING SECTION ADMIN
# ============================================================


@admin.register(BookingSection)
class BookingSectionAdmin(admin.ModelAdmin):
    list_display = (
        "eyebrow_text",
        "heading_text",
        "phone_1",
        "phone_2",
        "is_active",
        "updated_at",
    )

    list_filter = ("is_active",)

    search_fields = (
        "eyebrow_text",
        "heading_text",
        "description_text",
        "phone_1",
        "phone_2",
    )

    fieldsets = (
        (
            "Booking Section Content",
            {
                "fields": (
                    "eyebrow_text",
                    "heading_text",
                    "description_text",
                )
            },
        ),
        (
            "Contact Phone Numbers",
            {
                "fields": (
                    "phone_1",
                    "phone_2",
                )
            },
        ),
        (
            "Publishing",
            {"fields": ("is_active",)},
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at")},
        ),
    )

    readonly_fields = ("created_at", "updated_at")

    ordering = ("-updated_at",)

    # ============================================================


# INSTAGRAM SECTION ADMIN
# ============================================================


class InstagramImageInline(admin.TabularInline):
    model = InstagramImage
    extra = 1
    fields = ("image", "alt_text", "is_active", "sort_order")
    ordering = ("sort_order", "id")


@admin.register(InstagramSection)
class InstagramSectionAdmin(admin.ModelAdmin):
    list_display = (
        "eyebrow_text",
        "heading_text",
        "instagram_handle",
        "is_active",
        "updated_at",
    )

    list_filter = ("is_active",)

    search_fields = (
        "eyebrow_text",
        "heading_text",
        "instagram_handle",
        "follow_button_text",
    )

    inlines = [InstagramImageInline]

    fieldsets = (
        (
            "Instagram Section Content",
            {
                "fields": (
                    "eyebrow_text",
                    "heading_text",
                    "instagram_handle",
                )
            },
        ),
        (
            "Follow Button",
            {"fields": ("follow_button_text",)},
        ),
        (
            "Publishing",
            {"fields": ("is_active",)},
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at")},
        ),
    )

    readonly_fields = ("created_at", "updated_at")
    ordering = ("-updated_at",)

    from .models import AppointmentBooking


@admin.register(AppointmentBooking)
class AppointmentBookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_id",
        "service_item",
        "branch",
        "appointment_date",
        "appointment_time",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "branch",
        "appointment_date",
    )

    search_fields = (
        "customer_id",
        "service_item__name",
        "branch__name",
    )

    list_editable = ("status",)

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = ("-created_at",)
