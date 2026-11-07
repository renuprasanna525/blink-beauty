import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { DJANGO_API_URL } from "./api";
import "./App.css";

function BeforeAfterCard({
  before,
  after,
  label,
  iconClass = "bi bi-stars",
  featured = false,
  typographyStyle = {},
}) {
  const [position, setPosition] = useState(50);

  return (
    <div
      className={`transformation-card ${featured ? "featured" : ""}`}
      style={{ "--position": `${position}%` }}
    >
      <img
        className="transformation-after"
        src={after}
        alt={`${label} after transformation`}
      />

      <div className="transformation-before-layer">
        <img src={before} alt={`${label} before transformation`} />
      </div>

      <div className="transformation-divider" aria-hidden="true">
        <span>{"\u2194"}</span>
      </div>

      <label className="transformation-slider-label">
        <span className="sr-only">Reveal before and after for {label}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={`Drag to compare before and after: ${label}`}
        />
      </label>

      <span className="transformation-caption" style={typographyStyle}>
        <i
          className={
            iconClass.startsWith("bi ")
              ? iconClass
              : `bi ${iconClass}`
          }
          aria-hidden="true"
        />
        {label}
      </span>
    </div>
  );
}

function SalonHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [servicesContent, setServicesContent] = useState(null);
  const [heroContent, setHeroContent] = useState(null);
  const [aboutContent, setAboutContent] = useState(null);
  const [galleryContent, setGalleryContent] = useState(null);
  const [makeupContent, setMakeupContent] = useState(null);
  const [beautyExperienceContent, setBeautyExperienceContent] = useState(null);
  const [specialOffersContent, setSpecialOffersContent] = useState(null);
  const [reviewsContent, setReviewsContent] = useState(null);
  const [branchesContent, setBranchesContent] = useState(null);
  const [bookingContent, setBookingContent] = useState(null);
  const [instagramContent, setInstagramContent] = useState(null);

  const getBranchesTypographyStyle = (element) => {
    const setting = branchesContent?.typography?.[element];

    if (!setting) return {};

    return {
      "--branches-desktop-font-size": `${setting.desktop_font_size}px`,
      "--branches-mobile-font-size": `${setting.mobile_font_size}px`,
      fontFamily: setting.font_family,
      fontWeight: setting.font_weight,
      color: setting.text_color,
      letterSpacing: `${setting.letter_spacing}px`,
      lineHeight: setting.line_height,
    };
  };

  const getReviewsTypographyStyle = (element) => {
    const setting = reviewsContent?.typography?.[element];

    if (!setting) return {};

    return {
      fontFamily: setting.font_family,
      fontWeight: setting.font_weight,
      color: setting.text_color,
      letterSpacing: `${setting.letter_spacing}px`,
      lineHeight: setting.line_height,
    };
  };
  const getSpecialOffersTypographyStyle = (element) => {
    const setting = specialOffersContent?.typography?.[element];

    if (!setting) return {};

    const fallbackFont =
      element === "heading" ? "serif" : "sans-serif";

    return {
      fontFamily: `"${setting.font_family}", ${fallbackFont}`,
      fontWeight: setting.font_weight,
      color: setting.text_color,
      letterSpacing: `${setting.letter_spacing}px`,
      lineHeight: setting.line_height,
    };
  };

  const getBeautyExperienceTypographyStyle = (element) => {
    const setting = beautyExperienceContent?.typography?.[element];

    if (!setting) return {};

    return {
      fontFamily: setting.font_family,
      fontWeight: setting.font_weight,
      color: setting.text_color,
      letterSpacing: `${setting.letter_spacing}px`,
      lineHeight: setting.line_height,
    };
  };

  const getMakeupTypographyStyle = (element) => {
    const setting = makeupContent?.typography?.[element];

    if (!setting) return {};

    return {
      "--makeup-desktop-font-size": `${setting.desktop_font_size}px`,
      "--makeup-mobile-font-size": `${setting.mobile_font_size}px`,
      fontFamily: setting.font_family,
      fontWeight: setting.font_weight,
      color: setting.text_color,
      letterSpacing: `${setting.letter_spacing}px`,
      lineHeight: setting.line_height,
    };
  };

  const getGalleryTypographyStyle = (element) => {
    const setting = galleryContent?.typography?.[element];

    if (!setting) return {};

    return {
      "--gallery-desktop-font-size": `${setting.desktop_font_size}px`,
      "--gallery-mobile-font-size": `${setting.mobile_font_size}px`,
      fontFamily: setting.font_family,
      fontWeight: setting.font_weight,
      color: setting.text_color,
      letterSpacing: `${setting.letter_spacing}px`,
      lineHeight: setting.line_height,
    };
  };

  const fallbackGalleryItems = [
    {
      title: "Hair Transformation",
      image: "/images/gallery1.jpg",
      icon_class: "bi bi-stars",
      featured: true,
    },
    {
      title: "Beauty Glow",
      image: "/images/gallery2.jpg",
      icon_class: "bi bi-sparkles",
    },
    {
      title: "Makeup Transformation",
      image: "/images/gallery3.jpg",
      icon_class: "bi bi-brush",
    },
    {
      title: "Hair Styling",
      image: "/images/gallery4.jpg",
      icon_class: "bi bi-scissors",
    },
    {
      title: "Salon Makeover",
      image: "/images/gallery5.jpg",
      icon_class: "bi bi-heart",
    },
  ];
  const fallbackInstagramImages = [
    {
      id: "hair",
      image: "/images/hairimg.png",
      alt_text: "Blink hair styling",
    },
    {
      id: "beauty",
      image: "/images/instaimg.png",
      alt_text: "Blink salon beauty",
    },
    {
      id: "makeup",
      image: "/images/makeup.png",
      alt_text: "Blink makeup styling",
    },
    {
      id: "men",
      image: "/images/mensalon.png",
      alt_text: "Blink men's salon",
    },
    {
      id: "salon",
      image: "/images/herobanner.png",
      alt_text: "Blink salon experience",
    },
  ];

  const instagramImages =
    instagramContent?.images?.length > 0
      ? instagramContent.images
      : fallbackInstagramImages;

  const [bookingServices, setBookingServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState({ type: "", text: "" });

  const displayedServiceItems = servicesContent?.categories ?? [];

  const activeService =
    displayedServiceItems.find((service) => service.id === activeServiceId) ||
    displayedServiceItems[0] ||
    null;

  useEffect(() => {
    const loadBookingServices = async () => {
      try {
        const response = await fetch(
          `${DJANGO_API_URL}/booking/services/`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load services.");
        }

        setBookingServices(data.categories || []);
      } catch (error) {
        setServicesError(error.message || "Unable to load services.");
      } finally {
        setServicesLoading(false);
      }
    };

    loadBookingServices();
  }, []);
  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        const response = await fetch(`${DJANGO_API_URL}/website/hero/`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load Hero content.");
        }

        setHeroContent(data.hero);
      } catch (error) {
        console.error("Hero content loading failed:", error);
      }
    };

    loadHeroContent();
  }, []);

  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const response = await fetch(`${DJANGO_API_URL}/website/about/`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load About content.");
        }

        setAboutContent(data.about);
      } catch (error) {
        console.error("About content loading failed:", error);
      }
    };

    loadAboutContent();
  }, []);

  useEffect(() => {
    const loadGalleryContent = async () => {
      try {
        const response = await fetch(`${DJANGO_API_URL}/website/gallery/`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load Gallery content.");
        }

        setGalleryContent(data.gallery);
      } catch (error) {
        console.error("Gallery content loading failed:", error);
      }
    };

    loadGalleryContent();
  }, []);

  useEffect(() => {
    const loadMakeupContent = async () => {
      try {
        const response = await fetch(
          `${DJANGO_API_URL}/website/makeup-showcase/`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load Makeup Showcase content."
          );
        }

        setMakeupContent(data.makeup_showcase);
      } catch (error) {
        console.error("Makeup Showcase content loading failed:", error);
      }
    };

    loadMakeupContent();
  }, []);

  useEffect(() => {
    const loadServicesContent = async () => {
      try {
        const response = await fetch(`${DJANGO_API_URL}/website/services/`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load Services content.");
        }

        setServicesContent(data.services);

        if (data.services?.categories?.length) {
          setActiveServiceId((currentId) =>
            data.services.categories.some((category) => category.id === currentId)
              ? currentId
              : data.services.categories[0].id
          );
        }
      } catch (error) {
        console.error("Services content loading failed:", error);
      }
    };

    loadServicesContent();
  }, []);

  useEffect(() => {
    const fetchBeautyExperience = async () => {
      try {
        const response = await fetch(
          `${DJANGO_API_URL}/website/beauty-experience/`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Beauty Experience content");
        }

        const data = await response.json();

        if (data.success) {
          setBeautyExperienceContent(data.beauty_experience);
        }
      } catch (error) {
        console.error("Beauty Experience API error:", error);
      }
    };

    fetchBeautyExperience();
  }, []);
  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        const response = await fetch(
          `${DJANGO_API_URL}/website/special-offers/`
        );

        if (!response.ok) {
          throw new Error("Failed to load Special Offers content");
        }

        const data = await response.json();

        if (data.success) {
          setSpecialOffersContent(data.special_offers);
        }
      } catch (error) {
        console.error("Special Offers API error:", error);
      }
    };

    fetchSpecialOffers();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${DJANGO_API_URL}/website/reviews/`
        );

        if (!response.ok) {
          throw new Error("Failed to load Client Feedback content.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Unable to load Client Feedback content."
          );
        }

        setReviewsContent(data.reviews);
      } catch (error) {
        console.error("Client Feedback API error:", error);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          `${DJANGO_API_URL}/website/branches/`
        );

        if (!response.ok) {
          throw new Error("Failed to load Branches content.");
        }

        const data = await response.json();

        if (!data.success || !data.branches) {
          throw new Error(
            data.message || "Invalid Branches response."
          );
        }

        setBranchesContent(data.branches);
      } catch (error) {
        console.error("Branches content error:", error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(
          `${DJANGO_API_URL}/website/booking/`
        );

        if (!response.ok) {
          throw new Error("Failed to load Booking content.");
        }

        const data = await response.json();

        if (!data.success || !data.booking) {
          throw new Error(
            data.message || "Invalid Booking response."
          );
        }

        setBookingContent(data.booking);
      } catch (error) {
        console.error("Booking content error:", error);
      }
    };

    fetchBooking();
  }, []);
  useEffect(() => {
    const fetchInstagram = async () => {
      try {
        const response = await fetch(
          `${DJANGO_API_URL}/website/instagram/`
        );

        if (!response.ok) {
          throw new Error("Failed to load Instagram content.");
        }

        const data = await response.json();

        if (!data.success || !data.instagram) {
          throw new Error(
            data.message || "Invalid Instagram response."
          );
        }

        setInstagramContent(data.instagram);
      } catch (error) {
        console.error("Instagram content error:", error);
      }
    };

    fetchInstagram();
  }, []);

  const getLocalToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const getLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    setBookingMessage({ type: "", text: "" });
    setBookingSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const appointmentDateTime = formData.get("appointment_datetime");
    const [appointmentDate, appointmentTime] =
      String(appointmentDateTime || "").split("T");

    const bookingData = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      service_id: formData.get("service_id"),
      branch_id: formData.get("branch_id"),
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
    };

    try {
      // 1. Save the booking through Django.
      const response = await fetch(`${DJANGO_API_URL}/booking/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit your appointment."
        );
      }

      const booking = data.booking;

      // 2. Send the confirmation email through EmailJS.
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: bookingData.email,
            to_name: bookingData.name,
            booking_id: booking.id,
            service_name: booking.service,
            branch_name: booking.branch,
            appointment_date: booking.appointment_date,
            appointment_time: booking.appointment_time,
          },
          {
            publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
          }
        );

        setBookingMessage({
          type: "success",
          text: `Booking #${booking.id} submitted successfully. Your confirmation email has been sent. Status: Pending confirmation.`,
        });
      } catch (emailError) {
        console.error("EmailJS delivery error:", emailError);

        setBookingMessage({
          type: "warning",
          text: `Booking #${booking.id} was saved successfully, but the confirmation email could not be sent. Please contact the salon if you need assistance.`,
        });
      }

      // The booking is saved, so reset the form even if email delivery fails.
      form.reset();
    } catch (error) {
      setBookingMessage({
        type: "error",
        text:
          error.message ||
          "Unable to submit your appointment. Please try again.",
      });
    } finally {
      setBookingSubmitting(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className="navbar">
        <a className="brand" href="#home" onClick={closeMenu}>
          <span className="brand-word">
            <span className="brand-initial">B</span>
            <span className="brand-rest">LINK</span>
          </span>
          <small>UNISEX SALON &amp; ACADEMY</small>
        </a>

        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "\u00D7" : "\u2630"}
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {[
            ["HOME", "#home"],
            ["ABOUT", "#about"],
            ["SERVICES", "#services"],
            ["GALLERY", "#gallery"],
            ["OFFERS", "#offers"],
            ["REVIEWS", "#reviews"],
            ["CONTACT", "#contact"],
          ].map(([label, href]) => (
            <a key={label} href={href} onClick={closeMenu}>
              {label}
            </a>
          ))}

          <a className="mobile-nav-book" href="#booking" onClick={closeMenu}>
            BOOK APPOINTMENT
          </a>
        </nav>

        <a className="nav-book" href="#booking" onClick={closeMenu}>
          BOOK APPOINTMENT
        </a>

        {menuOpen && (
          <div
            className="mobile-menu-backdrop"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </header>
      <section
        className="hero"
        id="home"
        style={{
          "--hero-banner-image": heroContent?.banner_image
            ? `url("${heroContent.banner_image}")`
            : 'url("/images/herobanner.png")',
        }}
      >

        <div className="hero-content">
          <p className="eyebrow">
            {heroContent?.eyebrow_text ??
              "PREMIUM HAIR . BEAUTY . MAKEUP . GROOMING"}
          </p>

          <h1 className="hero-heading">
            <span className="hero-heading-main">
              {heroContent?.heading_line ?? "BLINK"}
            </span>
            <br />

            <em className="hero-heading-emphasis">
              {heroContent?.heading_emphasis ?? "Unisex Salon"}
            </em>
          </h1>

          <h3 className="hero-heading-suffix">
            {heroContent?.heading_suffix ?? "& ACADEMY"}
          </h3>

          <p className="hero-description">
            {heroContent?.description ?? "Where Style Meets Confidence"}
          </p>

          <div className="hero-actions">
            <a
              className="button button-primary"
              href={heroContent?.primary_button_link ?? "#booking"}
            >
              {heroContent?.primary_button_text ?? "Book an Appointment"}
              <span>{heroContent?.primary_button_icon ?? "\u2197"}</span>
            </a>

            <a
              className="button button-secondary"
              href={heroContent?.secondary_button_link ?? "#services"}
            >
              {heroContent?.secondary_button_text ?? "WhatsApp us"}
            </a>
          </div>
        </div>
        <div className="hero-bottom">
          <a
            href="#services"
            className="scroll-down"
            aria-label="Scroll to services"
          >
            {"\u2193"}
          </a>
        </div>
      </section>

      <section
        className="about-experience"
        id="about"
        style={{
          "--about-background-image": aboutContent?.background_image
            ? `url("${aboutContent.background_image}")`
            : 'url("/images/aboutimg.png")',
        }}
      >
        <div className="about-overlay" aria-hidden="true" />

        <div className="about-layout">
          <div className="about-copy">
            <p className="about-eyebrow">
              {aboutContent?.eyebrow_text ?? "ABOUT BLINK"}
            </p>

            <h2>
              {aboutContent?.heading_line_1 ?? "Your Beauty. Your"}
              <br />
              {aboutContent?.heading_line_2 ?? "Style. Your Blink."}
            </h2>

            <p className="about-specialties">
              {aboutContent?.specialties_text ??
                "Premium Hair . Beauty . Makeup . Grooming"}
            </p>

            <p>
              {aboutContent?.paragraph_1 ??
                "At Blink Unisex Salon & Academy, we believe great style is more than just a look â€” it is about confidence."}
            </p>

            <p>
              {aboutContent?.paragraph_2 ??
                "We offer a wide range of professional hair, beauty, grooming and makeup services for women, men and children. Our goal is to provide quality services, personalised attention and a comfortable salon experience at an affordable price."}
            </p>

            <p>
              {aboutContent?.paragraph_3 ??
                "Whether you need a fresh haircut, a hair transformation, a relaxing facial, professional makeup or complete bridal styling, our team is ready to help you look and feel your best."}
            </p>
          </div>

          <div className="about-highlights">
            <h3>
              {aboutContent?.highlights_heading ?? "Why Choose Blink?"}
            </h3>

            {(aboutContent?.highlights ?? [
              { number: "01", title: "Beauty" },
              { number: "02", title: "Confidence" },
              { number: "03", title: "Style" },
              { number: "04", title: "Premium Salon Experience" },
            ]).map((highlight) => (
              <div
                className="about-highlight-card"
                key={`${highlight.number}-${highlight.title}`}
              >
                <span>{highlight.number}</span>
                <h4>{highlight.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* SERVICES SHOWCASE */}
      <section className="services-showcase" id="services">
        {activeService && (
          <>
            <div
              key={activeService.id}
              className="services-full-background"
              style={{
                backgroundImage: `url("${activeService.image || ""}")`,
              }}
              aria-hidden="true"
            />
            <div className="services-full-overlay" aria-hidden="true" />
          </>
        )}


        <div className="services-showcase-inner">

          {/* TOP HEADING */}
          <div className="services-header">
            <p className="services-eyebrow">
              {servicesContent?.eyebrow_text || "OUR SERVICES"}
            </p>

            <h2 className="services-main-heading">
              {servicesContent?.heading_line_1 || "One salon. Every"}
              <br />
              {servicesContent?.heading_line_2 || "expression of you."}
            </h2>
          </div>

          {/* TWO COLUMN CONTENT */}
          <div className="services-content-grid">

            {/* LEFT: SERVICE SELECTOR */}
            <div className="services-sidebar">
              <div
                className="services-selector"
                role="group"
                aria-label="Choose a service"
              >
                {displayedServiceItems.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    className={`service-selector-button ${activeService?.id === service.id ? "active" : ""
                      }`}
                    onClick={() => setActiveServiceId(service.id)}
                    aria-pressed={activeService?.id === service.id}
                  >
                    <span className="service-selector-number">
                      {service.number}
                    </span>

                    <span className="service-selector-label">
                      {service.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: ACTIVE SERVICE DETAILS */}
            {activeService && (
              <div
                key={`content-${activeService.id}`}
                className="service-detail-panel"
              >
                <div className="service-detail-content">
                  <h3>{activeService.title}</h3>

                  <p className="service-detail-description">
                    {activeService.description}
                  </p>

                  <ul className="service-detail-list">
                    {activeService.services.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <a
                    className="service-book-button"
                    href={servicesContent?.booking_button_link || "#contact"}
                  >
                    {servicesContent?.booking_button_text || "Book this service"}{" "}
                    <span aria-hidden="true">{"\u2192"}</span>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>

      </section>

      {/* TRANSFORMATION GALLERY */}
      <section
        className="transformation-gallery"
        id="gallery"
        style={{
          backgroundColor: galleryContent?.background_color || "#f3d7ff",
          color: galleryContent?.text_color || "#180d24",
        }}
      >
        <div className="transformation-gallery-inner">
          <div className="transformation-gallery-header">
            <div>
              <p
                className="transformation-eyebrow"
                style={getGalleryTypographyStyle("eyebrow")}
              >
                {galleryContent?.eyebrow_text || "HAIR TRANSFORMATIONS"}
              </p>

              <h2 style={getGalleryTypographyStyle("heading")}>
                {galleryContent?.heading_line || "Ready for a new look?"}
              </h2>
            </div>

            <p
              className="transformation-instruction"
              style={getGalleryTypographyStyle("instruction")}
            >
              {galleryContent?.instruction_text ||
                "Drag to reveal the transformation"}
              <i
                className={
                  galleryContent?.instruction_icon_class
                    ? galleryContent.instruction_icon_class.startsWith("bi ")
                      ? galleryContent.instruction_icon_class
                      : `bi ${galleryContent.instruction_icon_class}`
                    : "bi bi-arrows-move"
                }
                aria-hidden="true"
              />
            </p>
          </div>

          <div className="transformation-grid">
            {(galleryContent?.items?.length
              ? galleryContent.items
              : fallbackGalleryItems
            ).map((item, index) => (
              <BeforeAfterCard
                key={item.id || item.title}
                featured={item.featured ?? index === 0}
                label={item.title}
                before={item.image}
                after={item.image}
                iconClass={item.icon_class || "bi bi-stars"}
                typographyStyle={getGalleryTypographyStyle("card_label")}
              />
            ))}
          </div>

          <div className="transformation-instagram">
            <a
              href={galleryContent?.instagram_button_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="transformation-instagram-btn"
              style={getGalleryTypographyStyle("instagram_button")}
            >
              <i
                className={
                  galleryContent?.instagram_button_icon_class
                    ? galleryContent.instagram_button_icon_class.startsWith("bi ")
                      ? galleryContent.instagram_button_icon_class
                      : `bi ${galleryContent.instagram_button_icon_class}`
                    : "bi bi-instagram"
                }
                aria-hidden="true"
              />
              {galleryContent?.instagram_button_text || "View Our Instagram"}
            </a>
          </div>
        </div>
      </section>

      {/* MAKEUP SHOWCASE */}
      <section className="makeup-showcase" id="makeup">
        <div className="makeup-showcase-overlay"></div>

        <div className="makeup-showcase-content">
          <span
            className="makeup-showcase-eyebrow"
            style={getMakeupTypographyStyle("eyebrow")}
          >
            {makeupContent?.eyebrow_text || "MAKEUP SHOWCASE"}
          </span>

          <h2 style={getMakeupTypographyStyle("heading")}>
            {makeupContent?.heading_line || "Make up for Every"}{" "}
            <em style={getMakeupTypographyStyle("heading_emphasis")}>
              {makeupContent?.heading_emphasis || "Special Moment"}
            </em>
          </h2>

          <div className="makeup-service-grid">
            {(makeupContent?.items?.length
              ? makeupContent.items
              : [
                { id: 1, title: "Bridal Makeup", icon_class: "bi bi-stars" },
                { id: 2, title: "Engagement Makeup", icon_class: "bi bi-stars" },
                { id: 3, title: "HD Makeup", icon_class: "bi bi-stars" },
                { id: 4, title: "Party Makeup", icon_class: "bi bi-stars" },
                { id: 5, title: "Event Makeup", icon_class: "bi bi-stars" },
                {
                  id: 6,
                  title: "Saree / Dupatta Draping",
                  icon_class: "bi bi-stars",
                },
              ]
            ).map((item) => (
              <div
                className="makeup-service-item"
                key={item.id}
                style={getMakeupTypographyStyle("service_item")}
              >
                <span className="makeup-star" aria-hidden="true">
                  <i className={item.icon_class || "bi bi-stars"}></i>
                </span>

                <span>{item.title}</span>
              </div>
            ))}
          </div>

          <a
            href={makeupContent?.enquiry_button_link || "#booking"}
            className="makeup-enquire-btn"
            style={getMakeupTypographyStyle("enquiry_button")}
          >
            {makeupContent?.enquiry_button_text || "Enquire for Makeup"}
          </a>
        </div>
      </section>

      {/* BEAUTY EXPERIENCE SECTION */}
      <section className="beauty-experience" id="experience">

        {beautyExperienceContent && (
          <style>
            {`
        .beauty-experience-eyebrow {
          font-size: ${beautyExperienceContent.typography?.eyebrow?.desktop_font_size ?? 12}px;
        }

        .beauty-experience-content h2 {
          font-size: ${beautyExperienceContent.typography?.heading?.desktop_font_size ?? 58}px;
        }

        .beauty-experience-focus {
          font-size: ${beautyExperienceContent.typography?.focus?.desktop_font_size ?? 25}px;
        }

        .beauty-experience-number {
          font-size: ${beautyExperienceContent.typography?.number?.desktop_font_size ?? 16}px;
        }

        .beauty-experience-card h4 {
          font-size: ${beautyExperienceContent.typography?.card_heading?.desktop_font_size ?? 15}px;
        }

        .beauty-experience-card p {
          font-size: ${beautyExperienceContent.typography?.card_description?.desktop_font_size ?? 12}px;
        }

        @media (max-width: 1000px) {
          .beauty-experience-eyebrow {
            font-size: ${beautyExperienceContent.typography?.eyebrow?.mobile_font_size ?? 10}px;
          }

          .beauty-experience-content h2 {
            font-size: ${beautyExperienceContent.typography?.heading?.mobile_font_size ?? 35}px;
          }

          .beauty-experience-focus {
            font-size: ${beautyExperienceContent.typography?.focus?.mobile_font_size ?? 14}px;
          }

          .beauty-experience-number {
            font-size: ${beautyExperienceContent.typography?.number?.mobile_font_size ?? 16}px;
          }

          .beauty-experience-card h4 {
            font-size: ${beautyExperienceContent.typography?.card_heading?.mobile_font_size ?? 12}px;
          }

          .beauty-experience-card p {
            font-size: ${beautyExperienceContent.typography?.card_description?.mobile_font_size ?? 10}px;
          }
        }
      `}
          </style>
        )}

        <div className="beauty-experience-inner">

          <div className="beauty-experience-content">

            <span
              className="beauty-experience-eyebrow"
              style={getBeautyExperienceTypographyStyle("eyebrow")}
            >
              {beautyExperienceContent?.eyebrow_text ?? "OUR BEAUTY EXPERIENCE"}
            </span>

            <h2 style={getBeautyExperienceTypographyStyle("heading")}>
              {beautyExperienceContent?.heading_text ??
                "At Blink, every service is about more than the final result."}
            </h2>

            <p
              className="beauty-experience-focus"
              style={getBeautyExperienceTypographyStyle("focus")}
            >
              {beautyExperienceContent?.focus_text ?? "WE FOCUS ON:"}
            </p>

          </div>

          <div className="beauty-experience-grid">

            {(beautyExperienceContent?.items ?? []).map((item) => (

              <div className="beauty-experience-card" key={item.id}>

                <span
                  className="beauty-experience-number"
                  style={getBeautyExperienceTypographyStyle("number")}
                >
                  {item.number}
                </span>

                <h4 style={getBeautyExperienceTypographyStyle("card_heading")}>
                  {item.title}
                </h4>

                <p style={getBeautyExperienceTypographyStyle("card_description")}>
                  {item.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>
      {/* ========================================
    SPECIAL OFFERS SECTION
======================================== */}

      <section className="special-offers" id="offers">


        {specialOffersContent && (
          <style>
            {`
      .special-offers-eyebrow {
        font-size: ${specialOffersContent.typography?.eyebrow?.desktop_font_size ?? 12}px;
      }

      .special-offers-content h2 {
        font-size: ${specialOffersContent.typography?.heading?.desktop_font_size ?? 56}px;
      }

      .special-offers-content p {
        font-size: ${specialOffersContent.typography?.paragraph?.desktop_font_size ?? 18}px;
      }

      .special-offers-btn {
        font-size: ${specialOffersContent.typography?.button?.desktop_font_size ?? 13}px;
      }

      @media (max-width: 900px) {
        .special-offers-eyebrow {
          font-size: ${specialOffersContent.typography?.eyebrow?.mobile_font_size ?? 12}px;
        }

        .special-offers-content h2 {
          font-size: ${specialOffersContent.typography?.heading?.mobile_font_size ?? 36}px;
        }

        .special-offers-content p {
          font-size: ${specialOffersContent.typography?.paragraph?.mobile_font_size ?? 12}px;
        }

        .special-offers-btn {
          font-size: ${specialOffersContent.typography?.button?.mobile_font_size ?? 11}px;
        }
      }
    `}
          </style>
        )}

        <div className="special-offers-inner">

          {/* LEFT CONTENT */}

          <div className="special-offers-content">

            <span
              className="special-offers-eyebrow"
              style={getSpecialOffersTypographyStyle("eyebrow")}
            >
              {specialOffersContent?.eyebrow_text ?? "SPECIAL OFFERS"}
            </span>

            <h2 style={getSpecialOffersTypographyStyle("heading")}>
              {specialOffersContent?.heading_text ??
                "Beauty Deals You Don't Want to Miss!"}
            </h2>

            <p style={getSpecialOffersTypographyStyle("paragraph")}>
              {specialOffersContent?.paragraph_text ??
                "We regularly introduce exciting offers on selected salon services. Follow us on Instagram or contact our salon to know about our latest offers and promotions."}
            </p>

          </div>

          {/* RIGHT BUTTON */}

          <div className="special-offers-action">
            <a
              href={specialOffersContent?.button_link ?? "#booking"}
              className="special-offers-btn"
              style={getSpecialOffersTypographyStyle("button")}
            >
              {specialOffersContent?.button_text ?? "Check Latest Offers"}
              <span aria-hidden="true">{"\u2192"}</span>
            </a>
          </div>

        </div>

      </section>

      <section
        className="reviews-section"
        id="reviews"
        style={{
          backgroundColor: reviewsContent?.background_color || "#e6ccf2",
          color: reviewsContent?.text_color || "#302333",
        }}
      >
        {reviewsContent && (
          <style>
            {`
        .reviews-eyebrow {
          font-size: ${reviewsContent.typography?.eyebrow?.desktop_font_size ?? 12}px;
        }

        .reviews-header h2 {
          font-size: ${reviewsContent.typography?.heading?.desktop_font_size ?? 68}px;
          font-weight: ${reviewsContent.typography?.heading?.font_weight ?? 500};
        }

        .review-service {
          font-size: ${reviewsContent.typography?.service_label?.desktop_font_size ?? 11}px;
        }

        .review-quote {
          font-size: ${reviewsContent.typography?.quote?.desktop_font_size ?? 14}px;
        }

        .review-customer-info h4 {
          font-size: ${reviewsContent.typography?.customer_name?.desktop_font_size ?? 14}px;
        }

        .review-customer-info span {
          font-size: ${reviewsContent.typography?.visited_text?.desktop_font_size ?? 11}px;
        }

        .review-likes {
          font-size: ${reviewsContent.typography?.likes?.desktop_font_size ?? 13}px;
        }

        .google-review-btn {
          font-size: ${reviewsContent.typography?.google_button?.desktop_font_size ?? 13}px;
        }

        @media (max-width: 768px) {
          .reviews-eyebrow {
            font-size: ${reviewsContent.typography?.eyebrow?.mobile_font_size ?? 10}px;
          }

          .reviews-header h2 {
            font-size: ${reviewsContent.typography?.heading?.mobile_font_size ?? 42}px;
            font-weight: ${reviewsContent.typography?.heading?.font_weight ?? 500};
        }
          .review-service {
            font-size: ${reviewsContent.typography?.service_label?.mobile_font_size ?? 10}px;
          }

          .review-quote {
            font-size: ${reviewsContent.typography?.quote?.mobile_font_size ?? 12}px;
          }

          .review-customer-info h4 {
            font-size: ${reviewsContent.typography?.customer_name?.mobile_font_size ?? 12}px;
          }

          .review-customer-info span {
            font-size: ${reviewsContent.typography?.visited_text?.mobile_font_size ?? 10}px;
          }

          .review-likes {
            font-size: ${reviewsContent.typography?.likes?.mobile_font_size ?? 11}px;
          }

          .google-review-btn {
            font-size: ${reviewsContent.typography?.google_button?.mobile_font_size ?? 11}px;
          }
        }
      `}
          </style>
        )}

        <div className="reviews-inner">

          {/* SECTION INTRO */}

          <div className="reviews-header">
            <span
              className="reviews-eyebrow"
              style={getReviewsTypographyStyle("eyebrow")}
            >
              {reviewsContent?.eyebrow_text || "CLIENT FEEDBACK"}
            </span>

            <h2 style={getReviewsTypographyStyle("heading")}>
              {reviewsContent?.heading_text || "Our Clients"}
            </h2>
          </div>

          {/* TESTIMONIAL CARDS */}

          <div className="reviews-grid">

            {(reviewsContent?.items || []).map((review) => (
              <div
                className="review-card"
                key={review.id}
                style={{
                  backgroundColor:
                    reviewsContent?.card_background_color || "#ffffff",
                }}
              >
                {review.id !== 1 && (
                  <div className="review-stars" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={index} aria-hidden="true">
                        <i className="bi bi-star-fill" />
                      </span>
                    ))}
                  </div>
                )}

                <span
                  className="review-service"
                  style={getReviewsTypographyStyle("service_label")}
                >
                  {review.service_label}
                </span>

                <p
                  className="review-quote"
                  style={getReviewsTypographyStyle("quote")}
                >
                  "{review.quote}"
                </p>

                <div className="review-divider"></div>

                <div className="review-bottom">

                  <div className="review-customer">

                    <div className="review-avatar">
                      {review.customer_initials}
                    </div>

                    <div className="review-customer-info">

                      <h4 style={getReviewsTypographyStyle("customer_name")}>
                        {review.customer_name}
                      </h4>

                      <span style={getReviewsTypographyStyle("visited_text")}>
                        {review.visited_text}
                      </span>

                    </div>
                  </div>

                  <div
                    className="review-likes"
                    style={getReviewsTypographyStyle("likes")}
                  >
                    {review.likes_icon_class && (
                      <i
                        className={review.likes_icon_class}
                        aria-hidden="true"
                      />
                    )}

                    <span>{review.likes_count}</span>
                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* GOOGLE REVIEW BUTTON */}

          <div className="reviews-action">

            <a
              href={reviewsContent?.google_button_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="google-review-btn"
              style={getReviewsTypographyStyle("google_button")}
            >

              {reviewsContent?.google_button_icon_class && (
                <i
                  className={reviewsContent.google_button_icon_class}
                  aria-hidden="true"
                />
              )}

              {reviewsContent?.google_button_text || "Write a Google Review"}

            </a>

          </div>

        </div>
      </section>

      {/* OUR BRANCHES SECTION */}
      {branchesContent?.is_active !== false && (
        <section
          className="branches-section"
          id="branches"
          style={{
            backgroundImage: branchesContent?.background_image
              ? `linear-gradient(90deg, rgba(14, 2, 24, 0.93) 0%, rgba(73, 30, 79, 0.7) 55%, rgba(50, 25, 53, 0.197) 100%), url("${branchesContent.background_image}")`
              : undefined,
            "--branches-eyebrow-color":
              branchesContent?.eyebrow_color || "#DD33F2",
            "--branches-heading-color":
              branchesContent?.heading_color || "#ffffff",
            "--branches-icon-color":
              branchesContent?.icon_color || "#DD33F2",
            "--branches-card-background":
              branchesContent?.card_background_color ||
              "rgba(48, 5, 63, 0.171)",
            "--branches-card-border":
              branchesContent?.card_border_color ||
              "rgba(255, 255, 255, 0.3)",
            "--branches-button-background":
              branchesContent?.button_background_color || "#DD33F2",
            "--branches-button-text":
              branchesContent?.button_text_color || "#ffffff",
          }}
        >
          <div className="branches-inner">
            <div className="branches-header">
              <span
                className="branches-eyebrow"
                style={getBranchesTypographyStyle("eyebrow")}
              >
                {branchesContent?.eyebrow_text || "OUR BRANCHES"}
              </span>

              <h1 style={getBranchesTypographyStyle("heading")}>
                {branchesContent?.heading_text || "Visit Blink"}
              </h1>
            </div>

            <div className="branches-grid">
              {(branchesContent?.items || [])
                .filter((branch) => branch.is_active)
                .map((branch) => (
                  <div className="branch-card" key={branch.id}>
                    <div className="branch-location-icon">
                      <i
                        className={branch.icon_class || "bi bi-geo-alt-fill"}
                        aria-hidden="true"
                      />
                    </div>

                    <h4 style={getBranchesTypographyStyle("branch_name")}>
                      {branch.name}
                    </h4>

                    <button
                      type="button"
                      className="branch-directions-btn"
                      style={getBranchesTypographyStyle("directions_button")}
                    >
                      {branch.directions_text || "Get Directions"}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Section */}
      <section className="booking-section" id="booking">
        <div className="booking-inner">

          {/* LEFT SIDE - ADMIN MANAGED CONTENT */}
          <div className="booking-content">

            <span className="booking-eyebrow">
              {bookingContent?.eyebrow_text || "BOOK YOUR APPOINTMENT"}
            </span>

            <h1>
              {bookingContent?.heading_text ||
                "Your New Look Is Just One Appointment Away!"}
            </h1>

            <p className="booking-description">
              {bookingContent?.description_text ||
                "Ready for a refresh? Let us take care of your beauty needs. Contact Blink Unisex Salon & Academy and book your appointment with our team today."}
            </p>

            <div className="booking-contact">
              {(bookingContent?.phone_1 ?? "8110009693") && (
                <a
                  href={`tel:${bookingContent?.phone_1 ?? "8110009693"}`}
                  className="booking-phone"
                >
                  <i className="bi bi-telephone-fill"></i>
                  {bookingContent?.phone_1 ?? "8110009693"}
                </a>
              )}

              {(bookingContent?.phone_2 ?? "9345201606") && (
                <a
                  href={`tel:${bookingContent?.phone_2 ?? "9345201606"}`}
                  className="booking-phone"
                >
                  <i className="bi bi-telephone-fill"></i>
                  {bookingContent?.phone_2 ?? "9345201606"}
                </a>
              )}
            </div>

          </div>

          {/* RIGHT SIDE - BOOKING FORM */}
          <div className="booking-form-card">

            <h3>
              Contact Blink Unisex Salon & Academy Today
            </h3>

            <form
              className="appointment-form"
              onSubmit={handleBookingSubmit}
            >
              {/* ROW 1 - NAME | EMAIL */}
              <div className="booking-input-group">
                <div className="booking-input">
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    aria-label="Your name"
                    minLength={2}
                    maxLength={150}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div className="booking-input-group">
                <div className="booking-input">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* ROW 2 - SERVICE | APPOINTMENT DATE AND TIME */}
              <div className="booking-input-group">
                <div className="booking-input">
                  <select
                    name="service_id"
                    aria-label="Service required"
                    required
                    defaultValue=""
                    disabled={servicesLoading || bookingServices.length === 0}
                  >
                    <option value="" disabled>
                      {servicesLoading
                        ? "Loading services..."
                        : bookingServices.length === 0
                          ? "No services available"
                          : "Select a service"}
                    </option>

                    {bookingServices.map((category) => (
                      <optgroup
                        key={category.id}
                        label={category.title || category.label}
                      >
                        {category.items.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {servicesError && (
                  <small className="booking-error" role="alert">
                    {servicesError}
                  </small>
                )}
              </div>

              <div className="booking-input-group">
                <div className="booking-input">
                  <input
                    type="datetime-local"
                    name="appointment_datetime"
                    aria-label="Appointment date and time"
                    min={getLocalDateTime()}
                    required
                  />
                </div>
              </div>

              {/* ROW 3 - PHONE | BRANCH */}
              <div className="booking-input-group">
                <div className="booking-input">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    aria-label="Phone number"
                    autoComplete="tel"
                    pattern="[0-9+\\s\\(\\)\\-]{7,20}"
                    title="Enter a valid phone number."
                    required
                  />
                </div>
              </div>

              <div className="booking-input-group">
                <div className="booking-input">
                  <select
                    name="branch_id"
                    aria-label="Select branch"
                    required
                    defaultValue=""
                    disabled={
                      !(branchesContent?.items || []).some(
                        (branch) => branch.is_active
                      )
                    }
                  >
                    <option value="" disabled>
                      Select your preferred branch
                    </option>

                    {(branchesContent?.items || [])
                      .filter((branch) => branch.is_active)
                      .map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="booking-whatsapp-btn"
                disabled={
                  bookingSubmitting ||
                  servicesLoading ||
                  bookingServices.length === 0 ||
                  !(branchesContent?.items || []).some(
                    (branch) => branch.is_active
                  )
                }
              >
                {bookingSubmitting ? "Submitting..." : "Book Appointment"}
                <i className="bi bi-arrow-right"></i>
              </button>

              {/* BOOKING FEEDBACK */}
              {bookingMessage.text && (
                <p
                  className={`booking-feedback ${bookingMessage.type}`}
                  role={bookingMessage.type === "error" ? "alert" : "status"}
                >
                  {bookingMessage.text}
                </p>
              )}

              <small className="booking-note">
                Your appointment request will be saved and our team will
                confirm availability.
              </small>
            </form>

          </div>
        </div>
      </section>

      {/* INSTAGRAM SECTION */}
      <section className="instagram-section" id="instagram">
        <div className="instagram-inner">

          {/* HEADER */}
          <div className="instagram-header">

            <div className="instagram-heading">
              <span className="instagram-eyebrow">
                {instagramContent?.eyebrow_text || "INSTAGRAM"}
              </span>

              <h2>
                {instagramContent?.heading_text || "The Latest From Blink"}
              </h2>
            </div>

            <div className="instagram-actions">

              <p className="instagram-contact-text">
                <span>
                  {instagramContent?.instagram_handle || "@Blink_unisexsalon"}
                </span>
              </p>

              <a
                href="#"
                className="instagram-follow-btn"
                onClick={(event) => event.preventDefault()}
              >
                <i className="bi bi-instagram" aria-hidden="true"></i>

                <span>
                  {instagramContent?.follow_button_text ||
                    "Follow Us on Instagram"}
                </span>
              </a>

            </div>
          </div>

          {/* CONTINUOUS IMAGE MARQUEE */}
          <div className="instagram-marquee">

            <div className="instagram-track instagram-track-left">

              {[1, 2].map((copy) => (
                <div className="instagram-image-group" key={copy}>

                  {instagramImages.map((item) => (
                    <img
                      key={`${copy}-${item.id}`}
                      src={item.image}
                      alt={item.alt_text}
                      loading="lazy"
                      draggable="false"
                    />
                  ))}

                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-brand-column">
          <a className="brand footer-brand" href="#home">
            <span className="brand-word">
              <span className="brand-initial">B</span>
              <span className="brand-rest">LINK</span>
            </span>
            <span>
              <small>UNISEX SALON &amp; ACADEMY</small>
            </span>
          </a>

          <p className="footer-tagline">
            PREMIUM HAIR. BEAUTY. MAKEUP. GROOMING.
          </p>
        </div>

        <div className="footer-links-column">
          <h3>Quick Links</h3>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#gallery">Gallery</a>
          <a href="#offers">Offers</a>
        </div>

        <div className="footer-contact-column">
          <h3>Contact</h3>
          <a href="tel:8110009693">8110009693</a>
          <a href="tel:9345201606">9345201606</a>
          <a
            href="https://www.instagram.com/blink_unisexsalon/"
            target="_blank"
            rel="noreferrer"
          >
            @Blink_unisexsalon
          </a>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} BLINK Unisex Salon &amp; Academy.
            All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default SalonHome;





