import { Brain, Bell, GraduationCap } from "lucide-react";

// Verification mockup for the refined PsychPro headers (top bar + dashboard
// brand banner). Direction v2 (per feedback): NOT stripped down — richer and
// cohesive, with the wordmark/tagline matching the LANDING PAGE treatment
// exactly (Outfit 300, 0.32em tracking, strong cyan glow; tagline 500 / 0.42em).
// One smooth cohesive aura behind the wordmark instead of choppy stacked
// decorative layers. Locked cerulean.

const P = {
  ink: "#03151D",
  teal: "#5EB0C8",
  surf: "#76E4F7",
  mist: "#A7F3FF",
  cloud: "#F4FBFF",
  mistSoft: "#7FBFD0",
};

export function Refined() {
  return (
    <div className="hdr-root">
      <style>{styles}</style>

      {/* ===== Refined global top bar ===== */}
      <header className="hdr-topbar">
        <div className="hdr-topbar__left">
          <Brain className="hdr-crumb-icon" aria-hidden />
          <span className="hdr-crumb-mark">PSYCHPRO</span>
          <span className="hdr-crumb-sep" aria-hidden />
          <span className="hdr-crumb-page">Dashboard</span>
        </div>
        <div className="hdr-topbar__right">
          <button className="eppp-launch-btn" type="button">
            <span className="eppp-launch-btn__inner">
              <GraduationCap />
              EPPP Mastery Suite
            </span>
          </button>
          <button className="hdr-icon-btn" type="button" aria-label="Notifications">
            <Bell />
            <span className="hdr-badge">3</span>
          </button>
          <span className="hdr-avatar" />
        </div>
      </header>

      {/* ===== Refined dashboard brand banner ===== */}
      <main className="hdr-main">
        <header className="dashhdr">
          <div className="dashhdr-card">
            <div className="dashhdr-aura" aria-hidden />
            <div className="brandbanner">
              <div className="brandbanner-row">
                <Brain className="brandbanner-icon" />
                <h1 className="brandbanner-word">PSYCHPRO</h1>
              </div>
              <p className="brandbanner-tag">learn. expand. connect.</p>
              <div className="brandbanner-greet">
                <span className="brandbanner-rule" aria-hidden />
                <p className="brandbanner-greet-text">Welcome back, Jordan.</p>
              </div>
            </div>
          </div>
        </header>

        {/* faint content placeholder for context */}
        <div className="hdr-placeholder">
          <div className="hdr-ph-card" />
          <div className="hdr-ph-card" />
          <div className="hdr-ph-card" />
        </div>
      </main>
    </div>
  );
}

const styles = `
.hdr-root {
  min-height: 100vh;
  background:
    radial-gradient(1200px 620px at 50% -8%, rgba(118,228,247,0.10), transparent 62%),
    linear-gradient(180deg, #061F2B 0%, #04161F 100%);
  color: ${P.mist};
  font-family: "Inter", system-ui, sans-serif;
}

/* ===== Top bar ===== */
.hdr-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 clamp(16px, 3vw, 28px);
  border-bottom: 1px solid rgba(118,228,247,0.1);
  background: linear-gradient(180deg, rgba(3,21,29,0.55) 0%, transparent 100%);
  backdrop-filter: blur(10px);
}
.hdr-topbar__left { display: flex; align-items: center; gap: 11px; }
.hdr-crumb-icon {
  width: 20px; height: 20px;
  color: ${P.surf};
  filter: drop-shadow(0 0 9px rgba(118,228,247,0.6));
}
.hdr-crumb-mark {
  font-weight: 600;
  letter-spacing: 0.32em;
  font-size: 13px;
  text-indent: 0.32em;
  color: ${P.cloud};
}
.hdr-crumb-sep {
  width: 1px; height: 18px;
  background: rgba(118,228,247,0.28);
}
.hdr-crumb-page {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: ${P.mistSoft};
}
.hdr-topbar__right { display: flex; align-items: center; gap: 12px; }

/* shared glass control sizing for cohesion */
.eppp-launch-btn,
.hdr-icon-btn {
  height: 40px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .3s ease, border-color .2s ease,
              background .2s ease, color .2s ease;
}

/* EPPP entry — distinguished but calm (no pulse / no shimmer) */
.eppp-launch-btn {
  padding: 0 18px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.01em;
  white-space: nowrap;
  color: #BFF4FF;
  border: 1px solid rgba(118,228,247,0.4);
  background: linear-gradient(180deg, rgba(118,228,247,0.13), rgba(118,228,247,0.035));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 0 18px -7px rgba(118,228,247,0.45);
}
.eppp-launch-btn:hover {
  transform: translateY(-1px);
  color: ${P.cloud};
  border-color: rgba(118,228,247,0.72);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 0 26px -4px rgba(118,228,247,0.72);
}
.eppp-launch-btn__inner { display: inline-flex; align-items: center; gap: 8px; }
.eppp-launch-btn__inner svg {
  width: 16px; height: 16px;
  color: ${P.surf};
  filter: drop-shadow(0 0 5px rgba(118,228,247,0.6));
}

/* Bell — matching glass circle */
.hdr-icon-btn {
  position: relative;
  width: 40px;
  color: ${P.mist};
  border: 1px solid rgba(118,228,247,0.28);
  background: rgba(6,32,44,0.55);
}
.hdr-icon-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(118,228,247,0.5);
  background: rgba(10,45,61,0.7);
}
.hdr-icon-btn svg { width: 17px; height: 17px; }
.hdr-badge {
  position: absolute;
  top: -2px; right: -2px;
  min-width: 18px; height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.hdr-avatar {
  width: 40px; height: 40px;
  border-radius: 999px;
  background: linear-gradient(135deg, #2A7387, #0A2D3D);
  border: 1px solid rgba(118,228,247,0.4);
  box-shadow: 0 0 0 1px rgba(118,228,247,0.12);
}

/* ===== Main + banner ===== */
.hdr-main { padding: clamp(40px, 6vw, 72px) clamp(16px, 4vw, 40px) clamp(24px, 4vw, 40px); }
.dashhdr { position: relative; margin-bottom: 30px; }
.dashhdr-card {
  position: relative;
  margin: 0 auto;
  max-width: 46rem;
  padding: 10px 24px 18px;
}
/* one smooth, cohesive aura behind the wordmark (mirrors landing hero aura) */
.dashhdr-aura {
  position: absolute;
  top: -90px;
  left: 50%;
  transform: translateX(-50%);
  width: 620px;
  max-width: 120%;
  height: 360px;
  border-radius: 9999px;
  filter: blur(52px);
  pointer-events: none;
  background: radial-gradient(circle, rgba(118,228,247,0.26) 0%, rgba(94,176,200,0.12) 42%, transparent 72%);
}
.brandbanner {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.brandbanner-row { display: flex; align-items: center; justify-content: center; gap: 16px; }
.brandbanner-icon {
  width: 34px; height: 34px;
  color: ${P.surf};
  filter: drop-shadow(0 0 12px rgba(118,228,247,0.55));
}
/* wordmark — matches .landing-wordmark exactly (Outfit 300 / 0.32em / cyan glow) */
.brandbanner-word {
  margin: 0;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300;
  line-height: 1;
  font-size: clamp(34px, 5.4vw, 60px);
  letter-spacing: 0.32em;
  padding-left: 0.32em;
  color: ${P.cloud};
  text-shadow: 0 0 40px rgba(118,228,247,0.33), 0 0 12px rgba(118,228,247,0.2);
}
/* tagline — matches .landing-tagline (500 / 0.42em / icy soft-cyan) */
.brandbanner-tag {
  margin: 14px 0 0;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.42em;
  padding-left: 0.42em;
  color: ${P.mist};
}
.brandbanner-greet { display: flex; flex-direction: column; align-items: center; margin-top: 18px; }
.brandbanner-rule {
  display: block;
  height: 1px; width: 40px;
  margin-bottom: 14px;
  background: linear-gradient(90deg, transparent, rgba(118,228,247,0.4), transparent);
}
.brandbanner-greet-text { margin: 0; font-weight: 300; font-size: 15px; color: ${P.mistSoft}; }

/* placeholder grid */
.hdr-placeholder {
  max-width: 64rem;
  margin: 8px auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.hdr-ph-card {
  height: 120px;
  border-radius: 18px;
  border: 1px solid rgba(118,228,247,0.12);
  background: linear-gradient(145deg, rgba(10,45,61,0.5), rgba(6,28,40,0.6));
}
`;
