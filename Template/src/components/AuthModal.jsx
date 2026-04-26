import { useMemo, useState } from "react";

export function AuthModal({ open, onClose, session, loading, onSignIn, onSignUp }) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("");
  const isSignedIn = Boolean(session?.user);

  const title = useMemo(() => (mode === "signin" ? "Welcome back" : "Create your founder account"), [mode]);

  if (!open) {
    return null;
  }

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");

    try {
      if (mode === "signin") {
        await onSignIn({ email: form.email, password: form.password });
        setStatus("You are signed in.");
      } else {
        await onSignUp(form);
        setStatus("Your account request was received. Check your inbox if confirmation is enabled.");
      }
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          x
        </button>

        {isSignedIn ? (
          <div className="auth-success">
            <p className="eyebrow">Welcome Back</p>
            <h2>You are signed in.</h2>
            <p>{session.user.email}</p>
          </div>
        ) : (
          <>
            <div className="section-heading compact-heading">
              <p className="eyebrow">Founder Access</p>
              <h2>{title}</h2>
            </div>

            <div className="auth-switch">
              <button
                type="button"
                className={mode === "signin" ? "toggle-option active" : "toggle-option"}
                onClick={() => setMode("signin")}
              >
                Sign In
              </button>
              <button
                type="button"
                className={mode === "signup" ? "toggle-option active" : "toggle-option"}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <input
                  type="text"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="Your name"
                  required
                />
              )}
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="Email address"
                required
              />
              <input
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="Password"
                required
              />
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </>
        )}

        {status && <p className="form-status">{status}</p>}
      </div>
    </div>
  );
}
