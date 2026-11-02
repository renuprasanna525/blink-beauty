from django.db import models


class Admin(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    email = models.CharField(max_length=255, unique=True)
    password_hash = models.CharField(max_length=255)
    role = models.CharField(max_length=5)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = "admins"
        managed = False


class Booking(models.Model):
    id = models.AutoField(primary_key=True)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=9)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = "bookings"
        managed = False


class Customer(models.Model):
    id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=150)
    email = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = "customers"
        managed = False


class Service(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    duration_minutes = models.PositiveIntegerField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = "services"
        managed = False


class WebsiteContent(models.Model):
    id = models.AutoField(primary_key=True)
    section_key = models.CharField(max_length=100, unique=True)
    section_name = models.CharField(max_length=150)
    content_json = models.TextField()
    is_published = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = "website_content"
        ordering = ["sort_order", "id"]
        managed = False


class HeroSection(models.Model):
    eyebrow_text = models.CharField(
        max_length=255,
        default="PREMIUM HAIR . BEAUTY . MAKEUP . GROOMING",
    )
    heading_line = models.CharField(max_length=150, default="BLINK")
    heading_emphasis = models.CharField(max_length=150, default="Unisex Salon")
    heading_suffix = models.CharField(max_length=150, default="& ACADEMY")
    description = models.CharField(
        max_length=255,
        default="Where Style Meets Confidence",
    )
    primary_button_text = models.CharField(
        max_length=100,
        default="Book an Appointment",
    )
    primary_button_link = models.CharField(max_length=255, default="#booking")
    primary_button_icon = models.CharField(max_length=50, default="\u2197")
    secondary_button_text = models.CharField(
        max_length=100,
        default="WhatsApp us",
    )
    secondary_button_link = models.CharField(max_length=255, default="#services")
    secondary_button_icon = models.CharField(max_length=50, default="\u2192")
    banner_image = models.ImageField(
        upload_to="website/hero/",
        blank=True,
        null=True,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "hero_sections"
        verbose_name = "Hero Section"
        verbose_name_plural = "Hero Section"

    def __str__(self):
        return self.heading_line


class AboutSection(models.Model):
    eyebrow_text = models.CharField(
        max_length=255,
        default="ABOUT BLINK",
    )
    heading_line_1 = models.CharField(
        max_length=255,
        default="Your Beauty. Your",
    )
    heading_line_2 = models.CharField(
        max_length=255,
        default="Style. Your Blink.",
    )
    specialties_text = models.CharField(
        max_length=255,
        default="Premium Hair | Beauty | Makeup | Grooming",
    )
    paragraph_1 = models.TextField(
        default="At Blink Unisex Salon & Academy, we believe great style is more than just a look - it is about confidence.",
    )
    paragraph_2 = models.TextField(
        default="We offer a wide range of professional hair, beauty, grooming and makeup services for women, men and children. Our goal is to provide quality services, personalised attention and a comfortable salon experience at an affordable price.",
    )
    paragraph_3 = models.TextField(
        default="Whether you need a fresh haircut, a hair transformation, a relaxing facial, professional makeup or complete bridal styling, our team is ready to help you look and feel your best.",
    )
    highlights_heading = models.CharField(
        max_length=255,
        default="Why Choose Blink?",
    )
    background_image = models.ImageField(
        upload_to="website/about/",
        blank=True,
        null=True,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "about_sections"
        verbose_name = "About Section"
        verbose_name_plural = "About Section"

    def __str__(self):
        return self.eyebrow_text


class AboutHighlight(models.Model):
    about_section = models.ForeignKey(
        AboutSection,
        on_delete=models.CASCADE,
        related_name="highlights",
    )
    number = models.CharField(max_length=20, default="01")
    title = models.CharField(max_length=150)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "about_highlights"
        ordering = ["sort_order", "id"]
        verbose_name = "About Highlight"
        verbose_name_plural = "About Highlights"

    def __str__(self):
        return f"{self.number} - {self.title}"


class ServicesSection(models.Model):
    eyebrow_text = models.CharField(
        max_length=255,
        default="OUR SERVICES",
    )
    heading_line_1 = models.CharField(
        max_length=255,
        default="One salon. Every",
    )
    heading_line_2 = models.CharField(
        max_length=255,
        default="expression of you.",
    )
    booking_button_text = models.CharField(
        max_length=100,
        default="Book this service",
    )
    booking_button_link = models.CharField(
        max_length=255,
        default="#contact",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "services_sections"
        verbose_name = "Services Showcase Section"
        verbose_name_plural = "Services Showcase Section"

    def __str__(self):
        return self.eyebrow_text


class ServiceCategory(models.Model):
    section = models.ForeignKey(
        ServicesSection,
        on_delete=models.CASCADE,
        related_name="categories",
    )
    slug = models.SlugField(max_length=50)
    label = models.CharField(max_length=100)
    number = models.CharField(max_length=20, default="01")
    icon_class = models.CharField(
        max_length=100,
        default="bi bi-scissors",
        blank=True,
        help_text="Bootstrap Icon class, e.g. bi bi-scissors",
    )
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to="website/services/",
        blank=True,
        null=True,
    )
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "service_categories"
        ordering = ["sort_order", "id"]
        verbose_name = "Service Category"
        verbose_name_plural = "Service Categories"
        constraints = [
            models.UniqueConstraint(
                fields=["section", "slug"],
                name="unique_services_section_slug",
            ),
        ]

    def __str__(self):
        return self.title


class ServiceItem(models.Model):
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.CASCADE,
        related_name="items",
    )
    name = models.CharField(max_length=200)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "service_category_items"
        ordering = ["sort_order", "id"]
        verbose_name = "Service List Item"
        verbose_name_plural = "Service List Items"

    def __str__(self):
        return self.name


class GallerySection(models.Model):
    eyebrow_text = models.CharField(
        max_length=255,
        default="HAIR TRANSFORMATIONS",
    )
    heading_line = models.CharField(
        max_length=255,
        default="Ready for a new look?",
    )
    instruction_text = models.CharField(
        max_length=255,
        default="Drag to reveal the transformation",
    )
    instruction_icon_class = models.CharField(
        max_length=100,
        default="bi bi-arrows-move",
        help_text="Bootstrap Icon class, e.g. bi bi-arrows-move",
    )
    instagram_button_text = models.CharField(
        max_length=150,
        default="View Our Instagram",
    )
    instagram_button_link = models.CharField(
        max_length=500,
        default="#",
    )
    instagram_button_icon_class = models.CharField(
        max_length=100,
        default="bi bi-instagram",
        help_text="Bootstrap Icon class, e.g. bi bi-instagram",
    )
    background_color = models.CharField(
        max_length=30,
        default="#f3d7ff",
    )
    text_color = models.CharField(
        max_length=30,
        default="#180d24",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "gallery_sections"
        verbose_name = "Transformation Gallery Section"
        verbose_name_plural = "Transformation Gallery Section"

    def __str__(self):
        return self.eyebrow_text


class GalleryItem(models.Model):
    section = models.ForeignKey(
        GallerySection,
        on_delete=models.CASCADE,
        related_name="items",
    )
    title = models.CharField(max_length=150)
    image = models.ImageField(
        upload_to="website/gallery/",
        blank=True,
        null=True,
    )
    icon_class = models.CharField(
        max_length=100,
        default="bi bi-stars",
        help_text="Bootstrap Icon class, e.g. bi bi-stars",
    )
    featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "gallery_items"
        ordering = ["sort_order", "id"]
        verbose_name = "Transformation Gallery Item"
        verbose_name_plural = "Transformation Gallery Items"

    def __str__(self):
        return self.title


class GalleryTypography(models.Model):
    ELEMENT_CHOICES = [
        ("eyebrow", "Eyebrow Text"),
        ("heading", "Main Heading"),
        ("instruction", "Drag Instruction"),
        ("card_label", "Gallery Card Labels"),
        ("instagram_button", "Instagram Button"),
    ]

    FONT_WEIGHT_CHOICES = [
        ("400", "Regular (400)"),
        ("500", "Medium (500)"),
        ("600", "Semi Bold (600)"),
        ("700", "Bold (700)"),
        ("800", "Extra Bold (800)"),
    ]

    section = models.ForeignKey(
        GallerySection,
        on_delete=models.CASCADE,
        related_name="typography",
    )
    element = models.CharField(
        max_length=30,
        choices=ELEMENT_CHOICES,
    )
    font_family = models.CharField(
        max_length=100,
        default="Manrope",
        help_text="Example: Manrope or Playfair Display",
    )
    desktop_font_size = models.PositiveIntegerField(default=13)
    mobile_font_size = models.PositiveIntegerField(default=12)
    font_weight = models.CharField(
        max_length=3,
        choices=FONT_WEIGHT_CHOICES,
        default="400",
    )
    text_color = models.CharField(max_length=30, default="#180d24")
    letter_spacing = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="Value in pixels. Example: 1.50",
    )
    line_height = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=1.20,
    )

    class Meta:
        db_table = "gallery_typography"
        ordering = ["id"]
        verbose_name = "Gallery Typography Setting"
        verbose_name_plural = "Gallery Typography Settings"
        constraints = [
            models.UniqueConstraint(
                fields=["section", "element"],
                name="unique_gallery_section_typography",
            ),
        ]

    def __str__(self):
        return f"{self.section} - {self.get_element_display()}"


class MakeupShowcaseSection(models.Model):
    eyebrow_text = models.CharField(
        max_length=255,
        default="MAKEUP SHOWCASE",
    )
    heading_line = models.CharField(
        max_length=255,
        default="Make up for Every",
    )
    heading_emphasis = models.CharField(
        max_length=255,
        default="Special Moment",
    )
    enquiry_button_text = models.CharField(
        max_length=150,
        default="Enquire for Makeup",
    )
    enquiry_button_link = models.CharField(
        max_length=500,
        default="#booking",
    )
    enquiry_button_icon_class = models.CharField(
        max_length=100,
        default="bi bi-arrow-up-right",
        help_text="Bootstrap Icon class, e.g. bi bi-arrow-up-right",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "makeup_showcase_sections"
        verbose_name = "Makeup Showcase Section"
        verbose_name_plural = "Makeup Showcase Section"

    def __str__(self):
        return self.eyebrow_text


class MakeupShowcaseItem(models.Model):
    section = models.ForeignKey(
        MakeupShowcaseSection,
        on_delete=models.CASCADE,
        related_name="items",
    )
    title = models.CharField(max_length=150)
    icon_class = models.CharField(
        max_length=100,
        default="bi bi-stars",
        help_text="Bootstrap Icon class, e.g. bi bi-stars",
    )
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "makeup_showcase_items"
        ordering = ["sort_order", "id"]
        verbose_name = "Makeup Showcase Service"
        verbose_name_plural = "Makeup Showcase Services"

    def __str__(self):
        return self.title


class MakeupShowcaseTypography(models.Model):
    ELEMENT_CHOICES = [
        ("eyebrow", "Eyebrow Text"),
        ("heading", "Main Heading"),
        ("heading_emphasis", "Emphasized Heading"),
        ("service_item", "Makeup Service Names"),
        ("enquiry_button", "Enquiry Button"),
    ]

    FONT_WEIGHT_CHOICES = [
        ("400", "Regular (400)"),
        ("500", "Medium (500)"),
        ("600", "Semi Bold (600)"),
        ("700", "Bold (700)"),
        ("800", "Extra Bold (800)"),
    ]

    section = models.ForeignKey(
        MakeupShowcaseSection,
        on_delete=models.CASCADE,
        related_name="typography",
    )
    element = models.CharField(
        max_length=30,
        choices=ELEMENT_CHOICES,
    )
    font_family = models.CharField(
        max_length=100,
        default="Manrope",
        help_text="Use Manrope for body text and Playfair Display for headings.",
    )
    desktop_font_size = models.PositiveIntegerField(default=13)
    mobile_font_size = models.PositiveIntegerField(default=12)
    font_weight = models.CharField(
        max_length=3,
        choices=FONT_WEIGHT_CHOICES,
        default="400",
    )
    text_color = models.CharField(max_length=30, default="#ffffff")
    letter_spacing = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="Value in pixels. Example: 1.50",
    )
    line_height = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=1.20,
    )

    class Meta:
        db_table = "makeup_showcase_typography"
        ordering = ["id"]
        verbose_name = "Makeup Showcase Typography Setting"
        verbose_name_plural = "Makeup Showcase Typography Settings"
        constraints = [
            models.UniqueConstraint(
                fields=["section", "element"],
                name="unique_makeup_showcase_typography",
            ),
        ]

    def __str__(self):
        return f"{self.section} - {self.get_element_display()}"


class BeautyExperienceSection(models.Model):
    eyebrow_text = models.CharField(
        max_length=255,
        default="OUR BEAUTY EXPERIENCE",
    )
    heading_text = models.TextField(
        default="At Blink, every service is about more than the final result.",
    )
    focus_text = models.CharField(
        max_length=255,
        default="WE FOCUS ON:",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "beauty_experience_sections"
        verbose_name = "Beauty Experience Section"
        verbose_name_plural = "Beauty Experience Sections"

    def __str__(self):
        return self.eyebrow_text


class BeautyExperienceItem(models.Model):
    section = models.ForeignKey(
        BeautyExperienceSection,
        on_delete=models.CASCADE,
        related_name="items",
    )
    number = models.CharField(max_length=20, default="1")
    icon_class = models.CharField(
        max_length=100,
        default="bi bi-stars",
        blank=True,
        help_text="Bootstrap Icon class, e.g. bi bi-stars",
    )
    title = models.CharField(max_length=150)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "beauty_experience_items"
        ordering = ["sort_order", "id"]
        verbose_name = "Beauty Experience Card"
        verbose_name_plural = "Beauty Experience Cards"

    def __str__(self):
        return f"{self.number} - {self.title}"


class BeautyExperienceTypography(models.Model):
    ELEMENT_CHOICES = [
        ("eyebrow", "Eyebrow Text"),
        ("heading", "Main Heading"),
        ("focus", "Focus Text"),
        ("number", "Card Number"),
        ("card_heading", "Card Heading"),
        ("card_description", "Card Description"),
    ]

    FONT_WEIGHT_CHOICES = [
        ("400", "Regular (400)"),
        ("500", "Medium (500)"),
        ("600", "Semi Bold (600)"),
        ("700", "Bold (700)"),
        ("800", "Extra Bold (800)"),
    ]

    section = models.ForeignKey(
        BeautyExperienceSection,
        on_delete=models.CASCADE,
        related_name="typography",
    )
    element = models.CharField(
        max_length=30,
        choices=ELEMENT_CHOICES,
    )
    font_family = models.CharField(
        max_length=100,
        default="Manrope",
        help_text="Use Manrope for body text and Playfair Display for headings.",
    )
    desktop_font_size = models.PositiveIntegerField(default=13)
    mobile_font_size = models.PositiveIntegerField(default=12)
    font_weight = models.CharField(
        max_length=3,
        choices=FONT_WEIGHT_CHOICES,
        default="400",
    )
    text_color = models.CharField(max_length=30, default="#180d24")
    letter_spacing = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="Value in pixels. Example: 1.50",
    )
    line_height = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=1.20,
    )

    class Meta:
        db_table = "beauty_experience_typography"
        ordering = ["id"]
        verbose_name = "Beauty Experience Typography Setting"
        verbose_name_plural = "Beauty Experience Typography Settings"
        constraints = [
            models.UniqueConstraint(
                fields=["section", "element"],
                name="unique_beauty_experience_typography",
            ),
        ]

    def __str__(self):
        return f"{self.section} - {self.get_element_display()}"


class SpecialOffersSection(models.Model):
    eyebrow_text = models.CharField(
        max_length=255,
        default="SPECIAL OFFERS",
    )
    heading_text = models.CharField(
        max_length=255,
        default="Beauty Deals You Don't Want to Miss!",
    )
    paragraph_text = models.TextField(
        default=(
            "We regularly introduce exciting offers on selected salon services. "
            "Follow us on Instagram or contact our salon to know about our latest "
            "offers and promotions."
        ),
    )
    button_text = models.CharField(
        max_length=150,
        default="Check Latest Offers",
    )
    button_link = models.CharField(
        max_length=500,
        default="#booking",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "special_offers_section"
        verbose_name = "Special Offers Section"
        verbose_name_plural = "Special Offers Section"

    def __str__(self):
        return self.heading_text


class SpecialOffersTypography(models.Model):
    ELEMENT_CHOICES = [
        ("eyebrow", "Eyebrow Text"),
        ("heading", "Main Heading"),
        ("paragraph", "Paragraph"),
        ("button", "Button Text"),
    ]

    FONT_WEIGHT_CHOICES = [
        ("400", "Regular (400)"),
        ("500", "Medium (500)"),
        ("600", "Semi Bold (600)"),
        ("700", "Bold (700)"),
        ("800", "Extra Bold (800)"),
    ]

    section = models.ForeignKey(
        SpecialOffersSection,
        on_delete=models.CASCADE,
        related_name="typography",
    )
    element = models.CharField(
        max_length=30,
        choices=ELEMENT_CHOICES,
    )
    font_family = models.CharField(max_length=100, default="Manrope")
    desktop_font_size = models.PositiveIntegerField(default=13)
    mobile_font_size = models.PositiveIntegerField(default=12)
    font_weight = models.CharField(
        max_length=3,
        choices=FONT_WEIGHT_CHOICES,
        default="400",
    )
    text_color = models.CharField(max_length=30, default="#ffffff")
    letter_spacing = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
    )
    line_height = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=1.20,
    )

    class Meta:
        db_table = "special_offers_typography"
        ordering = ["id"]
        verbose_name = "Special Offers Typography Setting"
        verbose_name_plural = "Special Offers Typography Settings"
        constraints = [
            models.UniqueConstraint(
                fields=["section", "element"],
                name="unique_special_offers_typography",
            ),
        ]

    def __str__(self):
        return f"{self.section} - {self.get_element_display()}"

    # ============================================================


# CLIENT FEEDBACK / REVIEWS SECTION
# ============================================================


class ReviewsSection(models.Model):
    eyebrow_text = models.CharField(
        max_length=255,
        default="CLIENT LOVE",
    )
    heading_text = models.CharField(
        max_length=255,
        default="Real stories.",
    )

    google_button_text = models.CharField(
        max_length=150,
        default="Read More Google Reviews",
    )
    google_button_link = models.URLField(
        max_length=500,
        blank=True,
        default="",
    )
    google_button_icon_class = models.CharField(
        max_length=100,
        default="bi bi-arrow-up-right",
        help_text="Bootstrap Icon class, e.g. bi bi-arrow-up-right",
    )

    # Section and testimonial card colours
    background_color = models.CharField(
        max_length=30,
        default="#f8edf5",
        help_text="Light pink / lavender section background. Example: #f8edf5",
    )
    card_background_color = models.CharField(
        max_length=30,
        default="#ffffff",
        help_text="Testimonial card background. Default is pure white (#ffffff).",
    )
    text_color = models.CharField(
        max_length=30,
        default="#24152b",
    )
    accent_color = models.CharField(
        max_length=30,
        default="#b76e9b",
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "reviews_sections"
        verbose_name = "Client Feedback Section"
        verbose_name_plural = "Client Feedback Section"

    def __str__(self):
        return self.eyebrow_text


class Review(models.Model):
    section = models.ForeignKey(
        ReviewsSection,
        on_delete=models.CASCADE,
        related_name="reviews",
    )

    service_label = models.CharField(
        max_length=150,
        default="Hair Styling",
        help_text="Service name shown above the testimonial.",
    )

    quote = models.TextField(
        help_text="Customer testimonial text.",
    )

    customer_name = models.CharField(max_length=150)
    customer_initials = models.CharField(
        max_length=10,
        help_text="Example: AS",
    )
    visited_text = models.CharField(
        max_length=150,
        default="Visited recently",
    )

    likes_count = models.PositiveIntegerField(default=0)
    likes_icon_class = models.CharField(
        max_length=100,
        default="bi bi-hand-thumbs-up-fill",
        help_text="Bootstrap Icon class, e.g. bi bi-hand-thumbs-up-fill",
    )

    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "reviews"
        ordering = ["sort_order", "id"]
        verbose_name = "Customer Review"
        verbose_name_plural = "Customer Reviews"

    def __str__(self):
        return f"{self.customer_name} - {self.service_label}"


class ReviewTypography(models.Model):
    ELEMENT_CHOICES = [
        ("eyebrow", "Eyebrow Text"),
        ("heading", "Main Heading"),
        ("service_label", "Service Label"),
        ("quote", "Testimonial Quote"),
        ("customer_name", "Customer Name"),
        ("visited_text", "Visited Text"),
        ("likes", "Likes Count"),
        ("google_button", "Google Review Button"),
    ]

    FONT_WEIGHT_CHOICES = [
        ("400", "Regular (400)"),
        ("500", "Medium (500)"),
        ("600", "Semi Bold (600)"),
        ("700", "Bold (700)"),
        ("800", "Extra Bold (800)"),
    ]

    section = models.ForeignKey(
        ReviewsSection,
        on_delete=models.CASCADE,
        related_name="typography",
    )
    element = models.CharField(
        max_length=30,
        choices=ELEMENT_CHOICES,
    )
    font_family = models.CharField(
        max_length=100,
        default="Manrope",
        help_text="Use Playfair Display for headings and testimonial quotes; Manrope for other text.",
    )
    desktop_font_size = models.PositiveIntegerField(default=14)
    mobile_font_size = models.PositiveIntegerField(default=13)
    font_weight = models.CharField(
        max_length=3,
        choices=FONT_WEIGHT_CHOICES,
        default="400",
    )
    text_color = models.CharField(
        max_length=30,
        default="#24152b",
    )
    letter_spacing = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="Letter spacing in pixels. Example: 1.50",
    )
    line_height = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=1.20,
    )

    class Meta:
        db_table = "reviews_typography"
        ordering = ["id"]
        verbose_name = "Reviews Typography Setting"
        verbose_name_plural = "Reviews Typography Settings"
        constraints = [
            models.UniqueConstraint(
                fields=["section", "element"],
                name="unique_reviews_section_typography",
            ),
        ]

    def __str__(self):
        return f"{self.section} - {self.get_element_display()}"

    # ============================================================

    # OUR BRANCHES SECTION
    # ============================================================


class BranchesSection(models.Model):
    eyebrow_text = models.CharField(
        max_length=255,
        default="OUR BRANCHES",
    )
    heading_text = models.CharField(
        max_length=255,
        default="Visit",
    )
    background_image = models.ImageField(
        upload_to="website/branches/",
        blank=True,
        null=True,
        help_text="Optional background image. The frontend fallback image is used when empty.",
    )

    eyebrow_color = models.CharField(max_length=30, default="#DD33F2")
    heading_color = models.CharField(max_length=30, default="#ffffff")
    heading_emphasis_color = models.CharField(max_length=30, default="#DD33F2")
    icon_color = models.CharField(max_length=30, default="#DD33F2")
    card_background_color = models.CharField(
        max_length=50,
        default="rgba(48, 5, 63, 0.171)",
    )
    card_border_color = models.CharField(
        max_length=50,
        default="rgba(255, 255, 255, 0.3)",
    )
    button_background_color = models.CharField(max_length=30, default="#DD33F2")
    button_text_color = models.CharField(max_length=30, default="#ffffff")

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "branches_sections"
        verbose_name = "Our Branches Section"
        verbose_name_plural = "Our Branches Section"

    def __str__(self):
        return self.eyebrow_text


class Branch(models.Model):
    section = models.ForeignKey(
        BranchesSection,
        on_delete=models.CASCADE,
        related_name="branches",
    )
    name = models.CharField(max_length=200)

    icon_class = models.CharField(
        max_length=100,
        default="bi bi-geo-alt-fill",
        help_text="Bootstrap Icon class, e.g. bi bi-geo-alt-fill",
    )

    directions_text = models.CharField(
        max_length=100,
        default="Get Directions",
    )

    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "branches"
        ordering = ["sort_order", "id"]
        verbose_name = "Salon Branch"
        verbose_name_plural = "Salon Branches"

    def __str__(self):
        return self.name


class BranchesTypography(models.Model):
    ELEMENT_CHOICES = [
        ("eyebrow", "Eyebrow Text"),
        ("heading", "Main Heading"),
        ("branch_name", "Branch Name"),
        ("directions_button", "Directions Button"),
    ]

    FONT_WEIGHT_CHOICES = [
        ("400", "Regular (400)"),
        ("500", "Medium (500)"),
        ("600", "Semi Bold (600)"),
        ("700", "Bold (700)"),
        ("800", "Extra Bold (800)"),
    ]

    section = models.ForeignKey(
        BranchesSection,
        on_delete=models.CASCADE,
        related_name="typography",
    )
    element = models.CharField(
        max_length=30,
        choices=ELEMENT_CHOICES,
    )
    font_family = models.CharField(
        max_length=100,
        default="Manrope",
        help_text="Use Playfair Display for headings and Manrope for other text.",
    )
    desktop_font_size = models.PositiveIntegerField(default=16)
    mobile_font_size = models.PositiveIntegerField(default=14)
    font_weight = models.CharField(
        max_length=3,
        choices=FONT_WEIGHT_CHOICES,
        default="400",
    )
    text_color = models.CharField(max_length=30, default="#ffffff")
    letter_spacing = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
    )
    line_height = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=1.20,
    )

    class Meta:
        db_table = "branches_typography"
        ordering = ["id"]
        verbose_name = "Branches Typography Setting"
        verbose_name_plural = "Branches Typography Settings"
        constraints = [
            models.UniqueConstraint(
                fields=["section", "element"],
                name="unique_branches_section_typography",
            ),
        ]

    def __str__(self):
        return f"{self.section} - {self.get_element_display()}"

    # ============================================================

    # BOOK YOUR APPOINTMENT SECTION
    # ============================================================


class BookingSection(models.Model):
    eyebrow_text = models.CharField(
        max_length=150,
        default="BOOK YOUR APPOINTMENT",
    )
    heading_text = models.CharField(
        max_length=255,
        default="Your New Look Is Just One Appointment Away!",
    )
    description_text = models.TextField(
        default=(
            "Ready for a refresh? Let us take care of your beauty needs. "
            "Contact Blink Unisex Salon & Academy and book your appointment "
            "with our team today."
        ),
    )
    phone_1 = models.CharField(max_length=30, default="8110009693", blank=True)
    phone_2 = models.CharField(max_length=30, default="9345201606", blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "booking_sections"
        ordering = ["-updated_at"]
        verbose_name = "Booking Section"
        verbose_name_plural = "Booking Section"

    def __str__(self):
        return "Booking Section"


# ============================================================
# INSTAGRAM SECTION
# ============================================================


class InstagramSection(models.Model):
    eyebrow_text = models.CharField(
        max_length=150,
        default="INSTAGRAM",
    )
    heading_text = models.CharField(
        max_length=255,
        default="The Latest From Blink",
    )
    instagram_handle = models.CharField(
        max_length=150,
        default="@Blink_unisexsalon",
    )
    follow_button_text = models.CharField(
        max_length=150,
        default="Follow Us on Instagram",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "instagram_sections"
        ordering = ["-updated_at"]
        verbose_name = "Instagram Section"
        verbose_name_plural = "Instagram Section"

    def __str__(self):
        return self.heading_text


class InstagramImage(models.Model):
    section = models.ForeignKey(
        InstagramSection,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(
        upload_to="website/instagram/",
    )
    alt_text = models.CharField(
        max_length=255,
        default="Blink salon Instagram image",
    )
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "instagram_images"
        ordering = ["sort_order", "id"]
        verbose_name = "Instagram Image"
        verbose_name_plural = "Instagram Images"

    def __str__(self):
        return f"Instagram Image {self.id}"


class AppointmentBooking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    customer_id = models.PositiveIntegerField()

    service_item = models.ForeignKey(
        ServiceItem,
        on_delete=models.PROTECT,
        related_name="appointment_bookings",
    )

    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="appointment_bookings",
    )

    appointment_date = models.DateField()
    appointment_time = models.TimeField()

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "appointment_bookings"
        ordering = ["-created_at"]
        verbose_name = "Appointment Booking"
        verbose_name_plural = "Appointment Bookings"

    def __str__(self):
        return f"Booking #{self.pk} - {self.appointment_date}"
