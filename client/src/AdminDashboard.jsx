
import { useEffect, useState } from "react";
import { BsGrid, BsScissors, BsCalendarCheck, BsPeople, BsBoxArrowRight, BsClockHistory, BsStars } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api";

function AdminDashboard() {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("adminToken");

        if (!token) {
            navigate("/admin/login", { replace: true });
            return;
        }

        let cancelled = false;

        async function loadDashboard() {
            try {
                const response = await fetch(`${API_URL}/admin/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.status === 401 || response.status === 403) {
                    sessionStorage.removeItem("adminToken");
                    sessionStorage.removeItem("adminUser");
                    navigate("/admin/login", { replace: true });
                    return;
                }

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Unable to load dashboard.");
                }

                if (!cancelled) {
                    setDashboard(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message === "Failed to fetch"
                            ? "Cannot connect to the backend. Check that the server is running."
                            : err.message
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {
            cancelled = true;
        };
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminUser");
        navigate("/admin/login", { replace: true });
    };

    const stats = dashboard?.stats;

    const formatDate = (value) => {
        if (!value) return "\u2014";

        const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

        return Number.isNaN(date.getTime())
            ? String(value)
            : date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
    };

    const formatTime = (value) => {
        if (!value) return "\u2014";

        const parts = String(value).split(":");

        if (parts.length < 2) return String(value);

        const date = new Date();
        date.setHours(Number(parts[0]), Number(parts[1]), 0, 0);

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <main className="admin-dashboard">
            <aside className="dashboard-sidebar">
                <a className="dashboard-brand" href="/">
                    <span className="dashboard-brand-mark">B</span>
                    <span>LINK <small>SALON ADMIN</small></span>
                </a>

                <p className="dashboard-nav-label">WORKSPACE</p>

                <nav className="dashboard-nav">
                    <a className="dashboard-nav-link active" href="#overview">
                        <span><BsGrid aria-hidden="true" /></span> Overview
                    </a>
                    <Link className="dashboard-nav-link" to="/admin/services"><span><BsScissors aria-hidden="true" /></span> Services</Link>
                    <a className="dashboard-nav-link" href="#bookings">
                        <span><BsCalendarCheck aria-hidden="true" /></span> Bookings
                    </a>
                    <a className="dashboard-nav-link" href="#customers">
                        <span><BsPeople aria-hidden="true" /></span> Customers
                    </a>
                </nav>

                <div className="dashboard-sidebar-bottom">
                    <div className="dashboard-admin-avatar">
                        {(dashboard?.admin?.username || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="dashboard-admin-details">
                        <strong>{dashboard?.admin?.username || "Administrator"}</strong>
                        <span>Salon Administrator</span>
                    </div>
                    <button
                        className="dashboard-logout-icon"
                        onClick={handleLogout}
                        aria-label="Sign out"
                    >
                        <BsBoxArrowRight aria-hidden="true" />
                    </button>
                </div>
            </aside>

            <section className="dashboard-main" id="overview">
                <header className="dashboard-topbar">
                    <div>
                        <p className="dashboard-eyebrow">SALON MANAGEMENT</p>
                        <h1>Dashboard</h1>
                    </div>

                    <button className="dashboard-logout-button" onClick={handleLogout}>
                        Sign out <span>↗</span>
                    </button>
                </header>

                <div className="dashboard-welcome">
                    <div>
                        <p className="dashboard-welcome-label">YOUR SALON AT A GLANCE</p>
                        <h2>Welcome back, {dashboard?.admin?.username || "Admin"}!</h2>
                        <p>Manage your salon services and appointments in one place.</p>
                    </div>
                    <div className="dashboard-welcome-decoration" aria-hidden="true">
                        B
                    </div>
                </div>

                {loading && (
                    <div className="dashboard-message" role="status">
                        {"Loading your dashboard\u2026"}
                    </div>
                )}

                {error && !loading && (
                    <div className="dashboard-error" role="alert">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && stats && (
                    <>
                        <div className="dashboard-section-heading">
                            <h2>Overview</h2>
                            <span>Live database figures</span>
                        </div>

                        <div className="dashboard-stat-grid">
                            <article className="dashboard-stat-card">
                                <div className="dashboard-stat-top">
                                    <span className="dashboard-stat-icon purple-icon"><BsScissors aria-hidden="true" /></span>
                                    <span className="dashboard-stat-tag">SERVICES</span>
                                </div>
                                <p>Total services</p>
                                <strong>{stats.services.total}</strong>
                                <span className="dashboard-stat-foot">
                                    {stats.services.active} active
                                </span>
                            </article>

                            <article className="dashboard-stat-card">
                                <div className="dashboard-stat-top">
                                    <span className="dashboard-stat-icon pink-icon"><BsPeople aria-hidden="true" /></span>
                                    <span className="dashboard-stat-tag">CUSTOMERS</span>
                                </div>
                                <p>Total customers</p>
                                <strong>{stats.customers.total}</strong>
                                <span className="dashboard-stat-foot">
                                    Registered customers
                                </span>
                            </article>

                            <article className="dashboard-stat-card">
                                <div className="dashboard-stat-top">
                                    <span className="dashboard-stat-icon orange-icon"><BsCalendarCheck aria-hidden="true" /></span>
                                    <span className="dashboard-stat-tag">APPOINTMENTS</span>
                                </div>
                                <p>Total bookings</p>
                                <strong>{stats.bookings.total}</strong>
                                <span className="dashboard-stat-foot">
                                    All recorded appointments
                                </span>
                            </article>

                            <article className="dashboard-stat-card">
                                <div className="dashboard-stat-top">
                                    <span className="dashboard-stat-icon lavender-icon"><BsClockHistory aria-hidden="true" /></span>
                                    <span className="dashboard-stat-tag">NEEDS ATTENTION</span>
                                </div>
                                <p>Pending bookings</p>
                                <strong>{stats.bookings.pending}</strong>
                                <span className="dashboard-stat-foot">
                                    Awaiting confirmation
                                </span>
                            </article>
                        </div>

                        <div className="dashboard-lower-grid">
                            <section className="dashboard-panel" id="bookings">
                                <div className="dashboard-panel-heading">
                                    <div>
                                        <p className="dashboard-eyebrow">APPOINTMENT ACTIVITY</p>
                                        <h2>Recent bookings</h2>
                                    </div>
                                    <span className="dashboard-count">
                                        {dashboard.recentBookings.length}
                                    </span>
                                </div>

                                {dashboard.recentBookings.length === 0 ? (
                                    <div className="dashboard-empty-state">
                                        <span className="dashboard-empty-icon"><BsCalendarCheck aria-hidden="true" /></span>
                                        <h3>No bookings yet</h3>
                                        <p>
                                            Appointments will appear here when they are saved to
                                            your database.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="dashboard-table-wrap">
                                        <table className="dashboard-table">
                                            <thead>
                                                <tr>
                                                    <th>Customer</th>
                                                    <th>Service</th>
                                                    <th>Date & time</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboard.recentBookings.map((booking) => (
                                                    <tr key={booking.id}>
                                                        <td>{booking.customer_name}</td>
                                                        <td>{booking.service_name}</td>
                                                        <td>
                                                            {formatDate(booking.appointment_date)}
                                                            <small>
                                                                {formatTime(booking.appointment_time)}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`dashboard-status status-${booking.status}`}
                                                            >
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>

                            <section className="dashboard-panel dashboard-status-panel">
                                <p className="dashboard-eyebrow">BOOKING BREAKDOWN</p>
                                <h2>Appointment status</h2>

                                {[
                                    ["Pending", stats.bookings.pending, "pending"],
                                    ["Confirmed", stats.bookings.confirmed, "confirmed"],
                                    ["Completed", stats.bookings.completed, "completed"],
                                    ["Cancelled", stats.bookings.cancelled, "cancelled"],
                                ].map(([label, count, status]) => (
                                    <div className="dashboard-breakdown-row" key={status}>
                                        <div>
                                            <span className={`dashboard-status-dot dot-${status}`} />
                                            <span>{label}</span>
                                        </div>
                                        <strong>{count}</strong>
                                    </div>
                                ))}

                                <div className="dashboard-breakdown-note">
                                    Counts update from your MySQL database when the page loads.
                                </div>
                            </section>
                        </div>

                        <section className="dashboard-panel dashboard-setup-panel" id="services">
                            <div>
                                <p className="dashboard-eyebrow">NEXT STEP</p>
                                <h2>Manage your salon services</h2>
                                <p>
                                    Your service database is ready. The next step is connecting
                                    service creation, editing and activation to this dashboard.
                                </p>
                            </div>
                            <span className="dashboard-setup-mark"><BsStars aria-hidden="true" /></span>
                        </section>

                        <div id="customers" className="dashboard-footer-note">
                            BLINK Salon | Admin workspace
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

export default AdminDashboard;


