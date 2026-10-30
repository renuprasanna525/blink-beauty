
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminServices from "./AdminServices";
import "./App.css";


const serviceItems = [
  {
    id: "hair",
    label: "HAIR SERVICES",
    number: "01",
    title: "Hair Services",
    image: "/images/hairimg.png",
    description:
      "Transform your hair with professional styling and treatments tailored to your hair type and desired look.",
    services: [
      "Haircut & Styling",
      "Kids Haircut",
      "Hair Wash & Blow Dry",
      "Hair Spa",
      "Hair Smoothening",
      "Hair Straightening",
      "Hair Coloring",
      "Root Touch-Up",
      "Global Hair Colour",
      "Highlights",
      "Layer Cuts",
      "Special Occasion Hair Styling",
      "Hair Treatments for Dry & Damaged Hair",
    ],
  },
  {
    id: "beauty",
    label: "BEAUTY SERVICES",
    number: "02",
    title: "Beauty Services",
    image: "/images/aboutimg.png",
    description:
      "Relax, refresh and bring out your natural glow.",
    services: [
      "Facials",
      "03 Facial",
      "Cleanup",
      "Skin care Treatment",
      "Waxing",
      "Eyebrow Threading",
      "Manicure",
      "Pedicure",
      "Hand Massage",
      "Beauty Maintenance Service",
    ],
  },
  {
    id: "makeup",
    label: "MAKEUP SERVICES",
    number: "03",
    title: "Makeup Services",
    image: "/images/servicemakeup.png",
    description:
      "Look your best for every special moment",
    services: [
      "Party Makeup",
      "Event Makeup",
      "HD Makeup",
      "Engagement Makeup",
      "Bridal Makeup",
      "Natural Makeup",
      "Manicure",
      "Hairstyling",
      "Saree / Dupatta Draping",
      "False Eyelashes",
      "Hair Extensions & Styling"
    ],
  },
  {
    id: "mens",
    label: "MEN'S GROOMING",
    number: "04",
    title: "Men's Grooming",
    image: "/images/mensalon.png",
    description:
      "Sharp. Stylish. Confident",
    services: [
      "Men's Haircut",
      "Hair Styling",
      "Beard Trim",
      "Beard Styling",
      "Hair Coloring",
      "Hair Wash",
      "Head Massage",
      "Hair Spa",
      "Facial",
      "Men's Grooming Package",
    ],
  },
  {
    id: "kids",
    label: "KIDS SERVICES",
    number: "05",
    title: "Kids Services",
    image: "/images/mensalon.png",
    description:
      "Our team provides comfortable and stylish haircut experiences for children.",
    services: [
      "Kids Haircut",
      "Kids Hair Styling",
      "Special Occasion Styling",
    ],
  },
];

function BeforeAfterCard({ before, after, label, featured = false }) {
  const [position, setPosition] = useState(50);

  return (
    <div
      className={`transformation-card ${featured ? "featured" : ""}`}
      style={{ "--position": `${position}%` }}
    >
      <img className="transformation-after" src={after} alt={`${label} after transformation`} />

      <div className="transformation-before-layer">
        <img src={before} alt={`${label} before transformation`} />
      </div>

      <div className="transformation-divider" aria-hidden="true">
        <span>↔</span>
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

      <span className="transformation-caption">{label}</span>
    </div>
  );
}

function SalonHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(serviceItems[0]);


  const [bookingServices, setBookingServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState({ type: "", text: "" });

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    const loadBookingServices = async () => {
      try {
        const response = await fetch(`${API_URL}/bookings/services`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load services.");
        }

        setBookingServices(data.services || []);
      } catch (error) {
        setServicesError(error.message || "Unable to load services.");
      } finally {
        setServicesLoading(false);
      }
    };

    loadBookingServices();
  }, []);

  const getLocalToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    setBookingMessage({ type: "", text: "" });
    setBookingSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const bookingData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      service_id: formData.get("service_id"),
      appointment_date: formData.get("appointment_date"),
      appointment_time: formData.get("appointment_time"),
      branch: formData.get("branch"),
    };

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to submit your appointment.");
      }

      setBookingMessage({
        type: "success",
        text: `Booking request #${data.booking.id} submitted successfully. Status: Pending confirmation.`,
      });

      form.reset();
    } catch (error) {
      setBookingMessage({
        type: "error",
        text: error.message || "Unable to submit your appointment. Please try again.",
      });
    } finally {
      setBookingSubmitting(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <section className="hero" id="home">
        <header className="navbar">
          <a className="brand" href="#home" onClick={closeMenu}>
            <span className="brand-word">
              <span className="brand-initial">B</span>
              <span className="brand-rest">LINK</span>
            </span>
            <span>
              <small>UNISEX SALON &amp; ACADEMY</small>
            </span>
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
              ["Home", "#home"],
              ["About", "#about"],
              ["Services", "#services"],
              ["Gallery", "#gallery"],
              ["Offers", "#offers"],
              ["Reviews", "#reviews"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={label} href={href} onClick={closeMenu}>
                {label}
              </a>
            ))}
            <a className="nav-book" href="#booking" onClick={closeMenu}>
              Book Appointment {"\u2197"}
            </a>
          </nav>
          {menuOpen && (
            <div
              className="mobile-menu-backdrop"
              onClick={closeMenu}
              aria-hidden="true"
            />
          )}
        </header>

        <div className="hero-content">
          <p className="eyebrow">
            <span /> PREMIUM HAIR . BEAUTY . MAKEUP . GROOMING
          </p>
          <h1>
            BLINK
            <br />
            <em> Unisex Salon </em>
            &amp; ACADEMY
          </h1>
          <p className="hero-description">Where Style Meets Confidence</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#booking">
              Book an Appointment <span>{"\u2197"}</span>
            </a>
            <a className="button button-secondary" href="#services">
              WhatsApp us <span>{"\u2192"}</span>
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

      <section className="about-experience" id="about">
        <div className="about-overlay" aria-hidden="true" />

        <div className="about-layout">
          <div className="about-copy">
            <p className="about-eyebrow">ABOUT BLINK</p>

            <h2>
              Your Beauty. Your
              <br />
              Style. Your Blink.
            </h2>

            <p className="about-specialties">
              Premium Hair &bull; Beauty &bull; Makeup &bull; Grooming
            </p>

            <p>
              At Blink Unisex Salon &amp; Academy, we believe great style
              is more than just a look — it's about confidence.
            </p>

            <p>
              We offer a wide range of professional hair, beauty, grooming
              and makeup services for women, men and children. Our goal is
              to provide quality services, personalised attention and a
              comfortable salon experience at an affordable price.
            </p>

            <p>
              Whether you need a fresh haircut, a hair transformation,
              a relaxing facial, professional makeup or complete bridal
              styling, our team is ready to help you look and feel your best.
            </p>
          </div>

          <div className="about-highlights">
            <h3>Why Choose Blink?</h3>

            <div className="about-highlight-card">
              <span>01</span>
              <h4>Beauty</h4>
            </div>

            <div className="about-highlight-card">
              <span>02</span>
              <h4>Confidence</h4>
            </div>

            <div className="about-highlight-card">
              <span>03</span>
              <h4>Style</h4>
            </div>

            <div className="about-highlight-card">
              <span>04</span>
              <h4>Premium Salon Experience</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="services-showcase" id="services">
        <div className="services-showcase-inner">
          <div className="services-sidebar">
            <p className="services-eyebrow">OUR SERVICES</p>

            <h2 className="services-main-heading">
              One salon. Every
              <br />
              expression of you.
            </h2>

            <div className="services-selector" role="group" aria-label="Choose a service">
              {serviceItems.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={`service-selector-button ${activeService.id === service.id ? "active" : ""
                    }`}
                  onClick={() => setActiveService(service)}
                  aria-pressed={activeService.id === service.id}
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

          <div className="service-detail-panel">
            <div
              key={activeService.id}
              className="service-detail-background"
              style={{
                backgroundImage: `url("${activeService.image}")`,
              }}
              aria-hidden="true"
            />

            <div className="service-detail-overlay" />

            <div key={`content-${activeService.id}`} className="service-detail-content">
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
                href="#contact"
              >
                Book this service <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="transformation-gallery" id="gallery">
        <div className="transformation-gallery-inner">
          <div className="transformation-gallery-header">
            <div>
              <p className="transformation-eyebrow">HAIR TRANSFORMATIONS</p>
              <h2>
                Ready for a <em>new look?</em>
              </h2>
            </div>

            <p className="transformation-instruction">
              Drag to reveal the transformation <span aria-hidden="true">→</span>
            </p>
          </div>

          <div className="transformation-grid">
            <BeforeAfterCard
              featured
              label="Hair Transformation"
              before="/images/gallery1.jpg"
              after="/images/gallery1.jpg"
            />

            <BeforeAfterCard
              label="Beauty Glow"
              before="/images/gallery2.jpg"
              after="/images/gallery2.jpg"
            />

            <BeforeAfterCard
              label="Makeup Transformation"
              before="/images/gallery3.jpg"
              after="/images/gallery3.jpg"
            />

            <BeforeAfterCard
              label="Hair Styling"
              before="/images/gallery4.jpg"
              after="/images/gallery4.jpg"
            />

            <BeforeAfterCard
              label="Salon Makeover"
              before="/images/gallery5.jpg"
              after="/images/gallery5.jpg"
            />
          </div>
          <div className="transformation-instagram">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="transformation-instagram-btn"
            >
              View Our Instagram
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* MAKEUP SHOWCASE */}
      <section className="makeup-showcase" id="makeup">
        <div className="makeup-showcase-overlay"></div>

        <div className="makeup-showcase-content">

          <span className="makeup-showcase-eyebrow">
            MAKEUP SHOWCASE
          </span>

          <h2>
            Make up for Every <em>Special Moment</em>
          </h2>

          <div className="makeup-service-grid">

            <div className="makeup-service-item">
              <span className="makeup-star">✦</span>
              <span>Bridal Makeup</span>
            </div>

            <div className="makeup-service-item">
              <span className="makeup-star">✦</span>
              <span>Engagement Makeup</span>
            </div>

            <div className="makeup-service-item">
              <span className="makeup-star">✦</span>
              <span>HD Makeup</span>
            </div>

            <div className="makeup-service-item">
              <span className="makeup-star">✦</span>
              <span>Party Makeup</span>
            </div>

            <div className="makeup-service-item">
              <span className="makeup-star">✦</span>
              <span>Event Makeup</span>
            </div>

            <div className="makeup-service-item">
              <span className="makeup-star">✦</span>
              <span>Saree / Dupatta Draping</span>
            </div>

          </div>

          <a href="#booking" className="makeup-enquire-btn">
            Enquire for Makeup
            <span aria-hidden="true">↗</span>
          </a>

        </div>
      </section>

      {/* BEAUTY EXPERIENCE SECTION */}
      <section className="beauty-experience" id="experience">

        <div className="beauty-experience-inner">

          <div className="beauty-experience-content">

            <span className="beauty-experience-eyebrow">
              OUR BEAUTY EXPERIENCE
            </span>

            <h2>
              At Blink, every service is about more than the final result.
            </h2>

            <p className="beauty-experience-focus">
              WE FOCUS ON:
            </p>

          </div>

          <div className="beauty-experience-grid">

            {/* COLUMN 1 */}
            <div className="beauty-experience-card">

              <span className="beauty-experience-number">1</span>

              <h4>CONSULTATION</h4>

              <p>
                UNDERSTANDING YOUR NEEDS, HAIR TYPE, SKIN TYPE AND
                PREFERRED LOOK.
              </p>
            </div>

            {/* COLUMN 2 */}
            <div className="beauty-experience-card">

              <span className="beauty-experience-number">2</span>

              <h4>PERSONALIZED SERVICE</h4>

              <p>
                CHOOSING THE RIGHT SERVICE AND TECHNIQUE FOR
                YOUR INDIVIDUAL REQUIREMENTS.
              </p>
            </div>

            {/* COLUMN 3 */}
            <div className="beauty-experience-card">

              <span className="beauty-experience-number">3</span>

              <h4>PROFESSIONAL CARE</h4>

              <p>
                USING SUITABLE PROFESSIONAL PRODUCTS AND
                TECHNIQUES.
              </p>
            </div>

            {/* COLUMN 4 */}
            <div className="beauty-experience-card">

              <span className="beauty-experience-number">4</span>

              <h4>BEAUTIFUL RESULTS</h4>

              <p>
                HELPING YOU LEAVE THE SALON FEELING CONFIDENT
                AND REFRESHED.
              </p>
            </div>

          </div>

        </div>

      </section>
      {/* ========================================
        SPECIAL OFFERS SECTION
         ======================================== */}

      <section className="special-offers" id="offers">
        <div className="special-offers-inner">

          {/* LEFT CONTENT */}

          <div className="special-offers-content">
            <span className="special-offers-eyebrow">
              SPECIAL OFFERS
            </span>

            <h2>Beauty Deals You Don't Want to Miss!</h2>

            <p>
              We regularly introduce exciting offers on selected salon services.
              Follow us on Instagram or contact our salon to know about our latest
              offers and promotions.
            </p>
          </div>

          {/* RIGHT BUTTON */}

          <div className="special-offers-action">
            <a href="#booking" className="special-offers-btn">
              Check Latest Offers
              <span aria-hidden="true">→</span>
            </a>
          </div>

        </div>
      </section>

      {/* ========================================
    CLIENT FEEDBACK SECTION
======================================== */}

      <section className="reviews-section" id="reviews">

        <div className="reviews-inner">

          {/* SECTION INTRO */}

          <div className="reviews-header">
            <span className="reviews-eyebrow">
              CLIENT FEEDBACK
            </span>

            <h2>
              Our Clients say <em>it best.</em>
            </h2>
          </div>

          {/* TESTIMONIAL CARDS */}

          <div className="reviews-grid">

            {/* REVIEW 1 */}

            <div className="review-card">
              <div className="review-stars" aria-label="5 stars">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>

              <span className="review-service">
                SIGNATURE BALAYAGE & GLOSS
              </span>

              <p className="review-quote">
                "Walking into Blink felt like stepping into a private parisian atelier.
                My colorist spent twenty unhurried minutes discussing tone,
                maintenance, and my skin's undertones before mixing a single formula.
                The hand-painted balayage blends so seamlessly that two months later
                is still grows out like silk!"
              </p>

              <div className="review-divider"></div>

              <div className="review-bottom">
                <div className="review-customer">
                  <div className="review-avatar">CV</div>

                  <div className="review-customer-info">
                    <h4>Claire Vance</h4>
                    <span>Visited 2 days ago</span>
                  </div>
                </div>

                <div className="review-likes">
                  <span aria-hidden="true">👍</span>
                  <span>14</span>
                </div>
              </div>
            </div>

            {/* REVIEW 2 */}

            <div className="review-card">
              <div className="review-stars" aria-label="5 stars">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>

              <span className="review-service">
                BRIDAL GLAM PACKAGE
              </span>

              <p className="review-quote">
                "Our entire bridal party had our hair and makeup created by Blink for my
                ceremony in Bel Air. Not only was the team calm, poised, ahead od schedule
                , but everyone looked like refined, elevated versions of themselves.
                No heavy mask effect-just radiant. breathable perfection!"
              </p>

              <div className="review-divider"></div>

              <div className="review-bottom">
                <div className="review-customer">
                  <div className="review-avatar">HR</div>

                  <div className="review-customer-info">
                    <h4>Helena Rossi</h4>
                    <span>Visited last week</span>
                  </div>
                </div>

                <div className="review-likes">
                  <span aria-hidden="true">👍</span>
                  <span>21</span>
                </div>
              </div>
            </div>

            {/* REVIEW 3 */}

            <div className="review-card">
              <div className="review-stars" aria-label="5 stars">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>

              <span className="review-service">
                RADIANCE GLOW FACIAL
              </span>

              <p className="review-quote">
                "The esthetics suite is an absolute escape. The lymphatic drianag, cool mist
                peptide infusions, and warm towel therapy completely revitalized my tired skin
                after months of nonstop travel. My complexion has never looked this plump and
                luminous without highlighter!"
              </p>

              <div className="review-divider"></div>

              <div className="review-bottom">
                <div className="review-customer">
                  <div className="review-avatar">DL</div>

                  <div className="review-customer-info">
                    <h4>Danielle Lin</h4>
                    <span>Visited 2 weeks ago</span>
                  </div>
                </div>

                <div className="review-likes">
                  <span aria-hidden="true">👍</span>
                  <span>18</span>
                </div>
              </div>
            </div>

          </div>

          {/* GOOGLE REVIEW BUTTON */}

          <div className="reviews-action">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="google-review-btn"
            >
              Write a Google Review
              <span aria-hidden="true">↗</span>
            </a>
          </div>

        </div>
      </section>

      {/*Branches Section */}
      <section className="branches-section" id="branches">
        <div className="branches-inner">
          <div className="branches-header">
            <span className="branches-eyebrow">OUR BRANCHES</span>
            <h1>Visit <em>Blink</em></h1>
          </div>

          <div className="branches-grid">
            {/* Branch 1 */}
            <div className="branch-card">
              <div className="branch-location-icon">
                <i className="bi bi-geo-alt-fill"></i>
              </div>

              <h4>Mudichur - Lakshmi Nagar</h4>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="branch-directions-btn"
              >
                Get Directions <span aria-hidden="true">↗</span>
              </a>
            </div>

            {/* Branch 2 */}
            <div className="branch-card">
              <div className="branch-location-icon">
                <i className="bi bi-geo-alt-fill"></i>
              </div>

              <h4>Old Perungalathur - Parvathy Nagar</h4>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="branch-directions-btn"
              >
                Get Directions <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="booking-section" id="booking">
        <div className="booking-inner">

          {/* LEFT SIDE */}
          <div className="booking-content">

            <span className="booking-eyebrow">
              BOOK YOUR APPOINTMENT
            </span>

            <h1>
              Your New Look Is Just One
              Appointment Away!
            </h1>

            <p className="booking-description">
              Ready for a refresh? Let us take care of your beauty needs.
              Contact Blink Unisex Salon & Academy and book your appointment
              with our team today.
            </p>

            <div className="booking-contact">
              <p>CALL US TO BOOK YOUR APPOINTMENT</p>

              <a href="tel:8110009693" className="booking-phone">
                <i className="bi bi-telephone-fill"></i>
                8110009693
              </a>

              <a href="tel:9345201606" className="booking-phone">
                <i className="bi bi-telephone-fill"></i>
                9345201606
              </a>
            </div>

          </div>

          {/* RIGHT SIDE - BOOKING FORM */}
          <div className="booking-form-card">

            <h3>Contact Blink Unisex Salon & Academy Today</h3>

            <form className="appointment-form" onSubmit={handleBookingSubmit}>

              <div className="booking-input-group">
                <label htmlFor="booking-name">Your Name</label>
                <div className="booking-input">
                  <i className="bi bi-person"></i>
                  <input
                    type="text"
                    id="booking-name"
                    name="name"
                    placeholder="Enter your name"
                    minLength={2}
                    maxLength={150}
                    required
                  />
                </div>
              </div>

              <div className="booking-input-group">
                <label htmlFor="booking-phone">Phone Number</label>
                <div className="booking-input">
                  <i className="bi bi-telephone"></i>
                  <input
                    type="tel"
                    id="booking-phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div className="booking-input-group">
                <label htmlFor="booking-service">Service Required</label>
                <div className="booking-input">
                  <i className="bi bi-scissors"></i>
                  <select
                    id="booking-service"
                    name="service_id"
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
                    {bookingServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title} - {"?"}{Number(service.price || 0).toFixed(2)}
                      </option>
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
                <label htmlFor="booking-date">Preferred Date</label>
                <div className="booking-input">
                  <i className="bi bi-calendar-event"></i>
                  <input
                    type="date"
                    id="booking-date"
                    name="appointment_date"
                    min={getLocalToday()}
                    required
                  />
                </div>
              </div>

              <div className="booking-input-group">
                <label htmlFor="booking-time">Preferred Time</label>
                <div className="booking-input">
                  <i className="bi bi-clock"></i>
                  <input
                    type="time"
                    id="booking-time"
                    name="appointment_time"
                    required
                  />
                </div>
              </div>

              <div className="booking-input-group booking-full-width">
                <label htmlFor="booking-branch">Select Branch</label>
                <div className="booking-input">
                  <i className="bi bi-geo-alt"></i>
                  <select id="booking-branch" name="branch" required defaultValue="">
                    <option value="" disabled>Select your preferred branch</option>
                    <option value="Mudichur - Lakshmi Nagar">
                      Mudichur - Lakshmi Nagar
                    </option>
                    <option value="Old Perungalathur - Parvathy Nagar">
                      Old Perungalathur - Parvathy Nagar
                    </option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="booking-whatsapp-btn"
                disabled={bookingSubmitting || servicesLoading || bookingServices.length === 0}
              >
                <i className="bi bi-calendar-check"></i>
                {bookingSubmitting ? "Submitting..." : "Book Appointment"}
                <i className="bi bi-arrow-up-right"></i>
              </button>

              {bookingMessage.text && (
                <p
                  className={`booking-feedback ${bookingMessage.type}`}
                  role={bookingMessage.type === "error" ? "alert" : "status"}
                >
                  {bookingMessage.text}
                </p>
              )}

              <small className="booking-note">
                Your appointment request will be saved and our team will confirm availability.
              </small>

            </form>

          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="instagram-section" id="instagram">
        <div className="instagram-inner">

          {/* HEADER */}
          <div className="instagram-header">

            {/* LEFT SIDE */}
            <div className="instagram-heading">
              <span className="instagram-eyebrow">INSTAGRAM</span>
              <h2>The Latest From <em>Blink</em></h2>
            </div>

            {/* RIGHT SIDE */}
            <div className="instagram-actions">

              <p className="instagram-contact-text">
                <span>@Blink_unisexsalon</span>
              </p>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-follow-btn"
              >
                <i className="bi bi-instagram"></i>
                <span>Follow Us on Instagram</span>
              </a>

            </div>
          </div>

          {/* SINGLE CONTINUOUS IMAGE ROW */}
          <div className="instagram-marquee">
            <div className="instagram-track instagram-track-left">

              {[1, 2].map((copy) => (
                <div className="instagram-image-group" key={copy}>
                  <img src="/images/hairimg.png" alt="Blink hair styling" />
                  <img src="/images/instaimg.png" alt="Blink salon beauty" />
                  <img src="/images/makeup.png" alt="Blink makeup styling" />
                  <img src="/images/mensalon.png" alt="Blink men's salon" />
                  <img src="/images/herobanner.png" alt="Blink salon experience" />
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<SalonHome />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/services" element={<AdminServices />} />
      <Route
        path="*"
        element={
          <main style={{ padding: "48px 24px", textAlign: "center" }}>
            <h1>Page not found</h1>
            <a href="/">Return to BLINK Salon</a>
          </main>
        }
      />
    </Routes>
  );
}

export default App;

