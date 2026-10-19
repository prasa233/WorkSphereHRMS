
import { useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchNotifications() {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Please log in to view your notifications.");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.status === 401) {
          throw new Error("Your session has expired. Please log in again.");
        }

        if (!response.ok) {
          throw new Error(
            `Unable to load notifications (HTTP ${response.status}).`
          );
        }

        const data = await response.json();

        if (!cancelled) {
          setNotifications(
            Array.isArray(data)
              ? data
              : Array.isArray(data.notifications)
                ? data.notifications
                : Array.isArray(data.items)
                  ? data.items
                  : []
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load notifications.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Notifications</h1>
          <p style={styles.subtitle}>
            View your latest HRMS updates and announcements.
          </p>
        </div>

        <span style={styles.count}>
          {notifications.length} notifications
        </span>
      </div>

      {loading ? (
        <div style={styles.message}>Loading notifications...</div>
      ) : error ? (
        <div style={styles.error}>
          <p>{error}</p>
          <button
            style={styles.button}
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.icon}>🔔</div>
          <h2>No notifications yet</h2>
          <p>New updates will appear here when available.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {notifications.map((notification, index) => (
            <article
              key={notification.id ?? index}
              style={styles.card}
            >
              <div style={styles.notificationIcon}>🔔</div>

              <div style={styles.content}>
                <h3 style={styles.cardTitle}>
                  {notification.title ??
                    notification.subject ??
                    "Notification"}
                </h3>

                <p style={styles.description}>
                  {notification.message ??
                    notification.body ??
                    notification.description ??
                    "No additional details."}
                </p>

                {(notification.created_at || notification.createdAt) && (
                  <small style={styles.date}>
                    {new Date(
                      notification.created_at ?? notification.createdAt
                    ).toLocaleString()}
                  </small>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "32px",
    maxWidth: "1000px",
    margin: "0 auto",
    color: "#1f2937",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "28px",
  },
  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 700,
  },
  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
  },
  count: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "10px 14px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  message: {
    padding: "32px",
    textAlign: "center",
  },
  error: {
    padding: "24px",
    background: "#fef2f2",
    color: "#b91c1c",
    borderRadius: "12px",
  },
  button: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "64px 24px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
  },
  icon: {
    fontSize: "40px",
  },
  list: {
    display: "grid",
    gap: "16px",
  },
  card: {
    display: "flex",
    gap: "16px",
    padding: "22px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
  },
  notificationIcon: {
    fontSize: "24px",
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    margin: "0 0 8px",
    fontSize: "17px",
  },
  description: {
    margin: "0 0 10px",
    color: "#4b5563",
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },
  date: {
    color: "#9ca3af",
  },
};
