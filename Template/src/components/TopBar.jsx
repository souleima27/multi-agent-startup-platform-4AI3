import logoLight from "../../images/logo.png";
import logoDark from "../../images/darkLogo.png";

export function TopBar({ darkMode, onToggleDarkMode, onOpenAuth, user, onSignOut }) {
  return (
    <header className="topbar">
      <a href="#home" className="brand">
        <img
          className="brand-logo"
          src={darkMode ? logoDark : logoLight}
          alt="Venture Path logo"
        />
      </a>

      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#services">Services</a>
        <a href="#about">About</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#contact">Contact</a>
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          className="theme-toggle icon-toggle"
          onClick={onToggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          <span aria-hidden="true">{darkMode ? "\u2600" : "\u263E"}</span>
        </button>

        {user ? (
          <>
            <span className="auth-pill">{user.email}</span>
            <button type="button" className="secondary-btn nav-secondary" onClick={onSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <button type="button" className="secondary-btn nav-secondary" onClick={onOpenAuth}>
            Sign In
          </button>
        )}

        <a href="#contact" className="nav-cta">
          Get Started
        </a>
      </div>
    </header>
  );
}
