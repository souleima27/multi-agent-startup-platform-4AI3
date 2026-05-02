import { useEffect, useMemo, useState } from "react";
import { AuthModal } from "./components/AuthModal";
import { ContactSection } from "./components/ContactSection";
import { FaqSection } from "./components/FaqSection";
import { FeatureSection } from "./components/FeatureSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { NewsletterSection } from "./components/NewsletterSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { ServicesSection } from "./components/ServicesSection";
import { StatsSection } from "./components/StatsSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { TrackPage } from "./components/TrackPage";
import { TopBar } from "./components/TopBar";
import { portfolioItems, services, siteCopy, stats, values } from "./data/siteContent";
import { useAuth } from "./hooks/useAuth";
import { useScrollEffects } from "./hooks/useScrollEffects";
import { useTestimonials } from "./hooks/useTestimonials";
import { Track1Analyzer } from "./pages/Track1Analyzer";
import { Track1SavedReport } from "./pages/Track1SavedReport";
import { Track2LegalAssistant } from "./pages/Track2LegalAssistant";
import { Track3Hub } from "./pages/Track3Hub";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [routeHash, setRouteHash] = useState(window.location.hash || "");
  const { scrollProgress, scrollY } = useScrollEffects();
  const { session, user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { testimonials, submitReview, loading: reviewsLoading, submittingReview } = useTestimonials();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    return () => document.body.classList.remove("dark-mode");
  }, [darkMode]);

  useEffect(() => {
    const onHashChange = () => {
      setRouteHash(window.location.hash || "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const heroParallax = useMemo(() => ({ transform: `translateY(${scrollY * 0.05}px)` }), [scrollY]);
  const aboutParallax = useMemo(() => ({ transform: `translateY(${scrollY * 0.035}px)` }), [scrollY]);
  const activeTrack = useMemo(
    () => services.find((service) => `#${service.id}` === routeHash) ?? null,
    [routeHash]
  );
  const isTrackB = activeTrack?.id === "track-b";

  if (window.location.hash === "#track1-analyzer") {
  return (
    <div className="site-shell">
      <TopBar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((current) => !current)}
        onOpenAuth={() => setAuthOpen(true)}
        user={user}
        onSignOut={signOut}
      />
      <Track1Analyzer />
      <Footer />
    </div>
  );
}
if (window.location.hash === "#track1-report") {
  return (
    <div className="site-shell">
      <TopBar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((current) => !current)}
        onOpenAuth={() => setAuthOpen(true)}
        user={user}
        onSignOut={signOut}
      />
      <Track1SavedReport />
      <Footer />
    </div>
  );
}

if (isTrackB) {
  return (
    <div className="site-shell">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <TopBar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((current) => !current)}
        onOpenAuth={() => setAuthOpen(true)}
        user={user}
        onSignOut={signOut}
      />
      <Track2LegalAssistant track={activeTrack} />
      <Footer />
    </div>
  );
}

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <div className="site-shell">
        <TopBar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((current) => !current)}
          onOpenAuth={() => setAuthOpen(true)}
          user={user}
          onSignOut={signOut}
        />

        <main>
          {activeTrack ? (
            <>
              {activeTrack.id === "track-c" ? (
                <Track3Hub track={activeTrack} />
              ) : (
                <TrackPage track={activeTrack} />
              )}
              <ContactSection />
            </>
          ) : (
            <>
              <HeroSection
                copy={siteCopy.hero}
                stats={siteCopy.heroStats}
                heroParallax={heroParallax}
                onPrimaryAction={() => setAuthOpen(true)}
              />
              <StatsSection stats={stats} />
              <FeatureSection values={values} aboutParallax={aboutParallax} />
              <ServicesSection services={services} />
              <PortfolioSection items={portfolioItems} />
              <TestimonialsSection
                testimonials={testimonials}
                loading={reviewsLoading}
                onSubmitReview={submitReview}
                submittingReview={submittingReview}
              />
              <FaqSection faqs={siteCopy.faqs} />
              <NewsletterSection />
              <ContactSection />
            </>
          )}
        </main>

        <Footer />
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        session={session}
        loading={authLoading}
        onSignIn={signIn}
        onSignUp={signUp}
      />
    </>
  );
}

export default App;
