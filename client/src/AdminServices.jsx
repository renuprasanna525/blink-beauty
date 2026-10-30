import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminServices.css";

const API_URL = "http://localhost:5000/api";

const emptyForm = {
    title: "",
    description: "",
    price: "",
    duration_minutes: "",
    is_active: true,
};

function AdminServices() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const getToken = useCallback(() => {
        const token = sessionStorage.getItem("adminToken");

        if (!token) {
            navigate("/admin/login", { replace: true });
            return null;
        }

        return token;
    }, [navigate]);

    const handleUnauthorized = useCallback((status) => {
        if (status === 401 || status === 403) {
            sessionStorage.removeItem("adminToken");
            sessionStorage.removeItem("adminUser");
            navigate("/admin/login", { replace: true });
            return true;
        }

        return false;
    }, [navigate]);

    const loadServices = useCallback(async () => {
        const token = getToken();
        if (!token) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/admin/services`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            if (handleUnauthorized(response.status)) return;

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to load services.");
            }

            setServices(data.services || []);
        } catch (err) {
            setError(
                err.message === "Failed to fetch"
                    ? "Cannot connect to the backend. Check that the server is running."
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    }, [getToken, handleUnauthorized]);

    useEffect(() => {
        loadServices();
    }, [loadServices]);

    const updateField = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setError("");
        setMessage("");
    };

    const startEditing = (service) => {
        setEditingId(service.id);
        setForm({
            title: service.title || "",
            description: service.description || "",
            price: service.price ?? "",
            duration_minutes: service.duration_minutes ?? "",
            is_active:
                service.is_active === true ||
                service.is_active === 1 ||
                service.is_active === "1",
        });
        setError("");
        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = getToken();
        if (!token) return;

        setSaving(true);
        setError("");
        setMessage("");

        const payload = {
            title: form.title.trim(),
            description: form.description.trim() || null,
            price: form.price === "" ? null : Number(form.price),
            duration_minutes:
                form.duration_minutes === ""
                    ? null
                    : Number(form.duration_minutes),
            is_active: form.is_active,
        };

        try {
            const url = editingId
                ? `${API_URL}/admin/services/${editingId}`
                : `${API_URL}/admin/services`;

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (handleUnauthorized(response.status)) return;

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to save service.");
            }

            setMessage(data.message || "Service saved successfully.");
            setForm(emptyForm);
            setEditingId(null);
            await loadServices();
        } catch (err) {
            setError(
                err.message === "Failed to fetch"
                    ? "Cannot connect to the backend. Check that the server is running."
                    : err.message
            );
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (service) => {
        const token = getToken();
        if (!token) return;

        const currentlyActive =
            service.is_active === true ||
            service.is_active === 1 ||
            service.is_active === "1";

        setError("");
        setMessage("");

        try {
            const response = await fetch(
                `${API_URL}/admin/services/${service.id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ is_active: !currentlyActive }),
                }
            );

            const data = await response.json();

            if (handleUnauthorized(response.status)) return;

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to change service status.");
            }

            setMessage(data.message);
            await loadServices();
        } catch (err) {
            setError(
                err.message === "Failed to fetch"
                    ? "Cannot connect to the backend. Check that the server is running."
                    : err.message
            );
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminUser");
        navigate("/admin/login", { replace: true });
    };

    const formatPrice = (price) => {
        if (price === null || price === undefined || price === "") {
            return "Not set";
        }

        return `₹${Number(price).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const isActive = (service) =>
        service.is_active === true ||
        service.is_active === 1 ||
        service.is_active === "1";

    return (
        <main className="service-admin">
            <header className="service-admin-header">
                <a className="service-admin-brand" href="/">
                    <span className="service-brand-mark">B</span>
                    <span>BLINK <small>SALON ADMIN</small></span>
                </a>

                <div className="service-header-actions">
                    <button
                        type="button"
                        className="service-secondary-button"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        Dashboard
                    </button>
                    <button
                        type="button"
                        className="service-secondary-button"
                        onClick={handleLogout}
                    >
                        Sign out
                    </button>
                </div>
            </header>

            <section className="service-admin-content">
                <div className="service-page-heading">
                    <div>
                        <p className="service-eyebrow">SALON MANAGEMENT</p>
                        <h1>Service Management</h1>
                        <p>Create and update the services offered by your salon.</p>
                    </div>

                    <div className="service-total">
                        <strong>{services.length}</strong>
                        <span>Total services</span>
                    </div>
                </div>

                {error && (
                    <div className="service-alert service-alert-error" role="alert">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="service-alert service-alert-success" role="status">
                        {message}
                    </div>
                )}

                <section className="service-form-panel">
                    <div className="service-panel-heading">
                        <div>
                            <p className="service-eyebrow">
                                {editingId ? "UPDATE DETAILS" : "ADD TO YOUR MENU"}
                            </p>
                            <h2>{editingId ? "Edit service" : "Add a service"}</h2>
                        </div>
                        {editingId && (
                            <button
                                type="button"
                                className="service-text-button"
                                onClick={resetForm}
                            >
                                Cancel editing
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="service-form">
                        <label>
                            Service name *
                            <input
                                name="title"
                                value={form.title}
                                onChange={updateField}
                                maxLength={150}
                                required
                                placeholder="e.g. Hair Styling"
                            />
                        </label>

                        <label>
                            Price (₹)
                            <input
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={updateField}
                                placeholder="Leave blank if not set"
                            />
                        </label>

                        <label>
                            Duration (minutes)
                            <input
                                name="duration_minutes"
                                type="number"
                                min="1"
                                step="1"
                                value={form.duration_minutes}
                                onChange={updateField}
                                placeholder="Leave blank if not set"
                            />
                        </label>

                        <label className="service-description-field">
                            Description
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={updateField}
                                rows={3}
                                placeholder="Describe this salon service"
                            />
                        </label>

                        <label className="service-checkbox-field">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={form.is_active}
                                onChange={updateField}
                            />
                            Make this service active
                        </label>

                        <div className="service-form-actions">
                            <button
                                type="submit"
                                className="service-primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Save changes"
                                        : "Create service"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="service-secondary-button"
                                    onClick={resetForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="service-list-panel">
                    <div className="service-panel-heading">
                        <div>
                            <p className="service-eyebrow">YOUR SALON MENU</p>
                            <h2>All services</h2>
                        </div>
                        <button
                            type="button"
                            className="service-secondary-button"
                            onClick={loadServices}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Refresh"}
                        </button>
                    </div>

                    {loading ? (
                        <p className="service-empty-state">Loading services...</p>
                    ) : services.length === 0 ? (
                        <div className="service-empty-state">
                            <h3>No services added yet</h3>
                            <p>Use the form above to create your first salon service.</p>
                        </div>
                    ) : (
                        <div className="service-table-wrap">
                            <table className="service-table">
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Price</th>
                                        <th>Duration</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map((service) => (
                                        <tr key={service.id}>
                                            <td>
                                                <strong>{service.title}</strong>
                                                {service.description && (
                                                    <small>{service.description}</small>
                                                )}
                                            </td>
                                            <td>{formatPrice(service.price)}</td>
                                            <td>
                                                {service.duration_minutes
                                                    ? `${service.duration_minutes} min`
                                                    : "Not set"}
                                            </td>
                                            <td>
                                                <span
                                                    className={`service-status ${
                                                        isActive(service)
                                                            ? "service-status-active"
                                                            : "service-status-inactive"
                                                    }`}
                                                >
                                                    {isActive(service) ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="service-row-actions">
                                                    <button
                                                        type="button"
                                                        className="service-text-button"
                                                        onClick={() => startEditing(service)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="service-text-button"
                                                        onClick={() => toggleStatus(service)}
                                                    >
                                                        {isActive(service)
                                                            ? "Deactivate"
                                                            : "Activate"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}

export default AdminServices;
