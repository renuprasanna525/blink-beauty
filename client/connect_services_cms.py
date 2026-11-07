from pathlib import Path

path = Path("src/App.jsx")
source = path.read_text(encoding="utf-8-sig")

# 1. Replace the selected service object state with an ID.
old_state = '  const [activeService, setActiveService] = useState(serviceItems[0]);'
new_state = '''  const [activeServiceId, setActiveServiceId] = useState(serviceItems[0].id);
  const [servicesContent, setServicesContent] = useState(null);'''

if source.count(old_state) != 1:
    raise SystemExit("STOP: Expected activeService state was not found exactly once.")

# 2. Add derived category and selected-service values.
anchor = '  const [bookingMessage, setBookingMessage] = useState({ type: "", text: "" });'

derived = '''

  const displayedServiceItems =
    servicesContent?.categories?.length
      ? servicesContent.categories
      : serviceItems;

  const activeService =
    displayedServiceItems.find((service) => service.id === activeServiceId) ||
    displayedServiceItems[0];
'''

if source.count(anchor) != 1:
    raise SystemExit("STOP: Expected bookingMessage state was not found exactly once.")

# 3. Add the Django Services fetch effect after the About fetch effect.
about_effect_end = '''    loadAboutContent();
  }, []);'''

services_effect = '''

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
  }, []);'''

if source.count(about_effect_end) != 1:
    raise SystemExit("STOP: Expected About fetch effect ending was not found exactly once.")

# 4. Replace only the Services Showcase section.
start_marker = '      <section className="services-showcase" id="services">'
end_marker = '      </section>'

start = source.find(start_marker)
if start == -1:
    raise SystemExit("STOP: Services Showcase opening tag was not found.")

end = source.find(end_marker, start)
if end == -1:
    raise SystemExit("STOP: Services Showcase closing tag was not found.")

end += len(end_marker)

old_section = source[start:end]

new_section = '''      <section className="services-showcase" id="services">
        <div className="services-showcase-inner">
          <div className="services-sidebar">
            <p className="services-eyebrow">
              {servicesContent?.eyebrow_text || "OUR SERVICES"}
            </p>

            <h2 className="services-main-heading">
              {servicesContent?.heading_line_1 || "One salon. Every"}
              <br />
              {servicesContent?.heading_line_2 || "expression of you."}
            </h2>

            <div className="services-selector" role="group" aria-label="Choose a service">
              {displayedServiceItems.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={`service-selector-button ${
                    activeService?.id === service.id ? "active" : ""
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

          {activeService && (
            <div className="service-detail-panel">
              <div
                key={activeService.id}
                className="service-detail-background"
                style={{
                  backgroundImage: `url("${activeService.image || ""}")`,
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
                  href={
                    servicesContent?.booking_button_link || "#contact"
                  }
                >
                  {servicesContent?.booking_button_text || "Book this service"}{" "}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>'''

# Perform all replacements in memory, then save once.
updated = source.replace(old_state, new_state, 1)
updated = updated.replace(anchor, anchor + derived, 1)
updated = updated.replace(about_effect_end, about_effect_end + services_effect, 1)
updated = updated.replace(old_section, new_section, 1)

path.write_text(updated, encoding="utf-8")

print("App.jsx updated successfully.")
print("Added Django Services fetch.")
print("Connected dynamic heading, categories, images, lists and booking button.")
print("Original fallback data and booking API code preserved.")
