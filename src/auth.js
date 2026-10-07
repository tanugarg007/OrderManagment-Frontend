export const getStoredSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem("orderflow-session") || "null");

    if (
      !session ||
      typeof session.token !== "string" ||
      !session.user ||
      typeof session.user.role !== "string"
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

export const setStoredSession = (session) => {
  localStorage.setItem("orderflow-session", JSON.stringify(session));
  window.dispatchEvent(new Event("orderflow-session-change"));
};

export const clearStoredSession = () => {
  localStorage.removeItem("orderflow-session");
  window.dispatchEvent(new Event("orderflow-session-change"));
};
