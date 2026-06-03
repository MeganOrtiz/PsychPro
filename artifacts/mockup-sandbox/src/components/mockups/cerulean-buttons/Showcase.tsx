// Faithful reproduction of the LIVE PsychPro cerulean glass recipes
// (copied verbatim from artifacts/neuronotes/src/index.css after the
// mint #5EEAD4 -> cerulean #76E4F7 / rgb(118,228,247) swap). Scoped under
// `.cer` so nothing leaks into the sandbox. This shows what the sidebar nav
// and every button now look like on the authenticated study-page surface.
export function Showcase() {
  return (
    <div className="cer">
      <style>{`
        .cer {
          min-height: 100vh;
          padding: 40px;
          background:
            radial-gradient(1200px 700px at 70% -10%, #0E3C50 0%, rgba(14,60,80,0) 60%),
            linear-gradient(180deg, #061F2B 0%, #03151D 100%);
          color: #F4FBFF;
          font-family: Inter, system-ui, sans-serif;
          display: flex;
          gap: 48px;
          box-sizing: border-box;
        }
        .cer h2 {
          font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
          color: #7FBFD0; margin: 0 0 16px; font-weight: 600;
        }
        .cer .col { display: flex; flex-direction: column; }
        .cer .sidebar { width: 240px; flex-shrink: 0; }
        .cer .buttons { flex: 1; }

        /* ---- sidebar nav pills (.nav-glass-*) ---- */
        .cer .nav {
          position: relative;
          display: flex; align-items: center; gap: 10px;
          padding: 8px 12px; border-radius: 8px; margin-bottom: 8px;
          font-size: 14px; font-weight: 500;
          backdrop-filter: blur(12px); cursor: pointer;
          transition: all .2s ease;
        }
        .cer .nav .ico { width: 16px; height: 16px; flex-shrink: 0; opacity: .9; }
        .cer .nav-idle {
          color: #B9D2DA;
          background: rgba(12, 28, 38, 0.55);
          border: 1px solid rgba(118, 228, 247, 0.12);
          box-shadow: 0 0 12px rgba(118, 228, 247, 0.08), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .cer .nav-idle:hover {
          color: #A7F3FF;
          background: rgba(118, 228, 247, 0.06);
          border-color: rgba(118, 228, 247, 0.20);
          box-shadow: 0 0 14px rgba(118, 228, 247, 0.18), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .cer .nav-active {
          color: #A7F3FF;
          background: rgba(118, 228, 247, 0.08);
          border: 1px solid rgba(118, 228, 247, 0.18);
          box-shadow: 0 0 16px rgba(118, 228, 247, 0.25), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .cer .nav-active::before {
          content: ""; position: absolute; left: 0; top: 6px; bottom: 6px;
          width: 2px; border-radius: 0 2px 2px 0;
          background: #76E4F7; box-shadow: 0 0 8px #76E4F7;
        }
        .cer .pro {
          margin-left: auto; font-size: 10px; font-weight: 600; letter-spacing: .04em;
          padding: 2px 6px; border-radius: 999px; color: #A7F3FF;
          border: 1px solid rgba(118,228,247,0.30);
          box-shadow: 0 0 8px rgba(118,228,247,0.18);
        }

        /* ---- buttons ---- */
        .cer .btn-row { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 28px; }
        .cer button {
          font: inherit; font-size: 14px; font-weight: 500; color: #E4F4F6;
          padding: 10px 18px; border-radius: 10px; cursor: pointer;
          backdrop-filter: blur(12px) saturate(130%); transition: all .2s ease;
        }
        .cer .btn-glass {
          background: rgba(12, 28, 38, 0.55);
          border: 1px solid rgba(118, 228, 247, 0.12);
          box-shadow: 0 0 12px rgba(118,228,247,0.08), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .cer .btn-glass:hover {
          background: rgba(118, 228, 247, 0.06); border-color: rgba(118,228,247,0.2);
          box-shadow: 0 0 14px rgba(118,228,247,0.18), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .cer .btn-glass-strong {
          color: #eafbf7;
          background: rgba(118, 228, 247, 0.1);
          border: 1px solid rgba(118, 228, 247, 0.22);
          box-shadow: 0 0 18px rgba(118,228,247,0.28), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .cer .btn-glass-strong:hover {
          background: rgba(118, 228, 247, 0.16); border-color: rgba(118,228,247,0.3);
          box-shadow: 0 0 22px rgba(118,228,247,0.36), inset 0 1px 0 rgba(255,255,255,0.07);
        }
        .cer .btn-secondary {
          background: rgba(12, 28, 38, 0.55);
          border: 1px solid rgba(118, 228, 247, 0.12);
          box-shadow: 0 0 12px rgba(118,228,247,0.08), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .cer .btn-secondary:hover {
          background: rgba(118, 228, 247, 0.06); border-color: rgba(118,228,247,0.2);
          box-shadow: 0 0 14px rgba(118,228,247,0.18), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .cer .btn-outline {
          background: rgba(12, 28, 38, 0.45);
          border: 1px solid rgba(118, 228, 247, 0.14);
          box-shadow: 0 0 12px rgba(118,228,247,0.07), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .cer .btn-outline:hover {
          background: rgba(118, 228, 247, 0.06); border-color: rgba(118,228,247,0.2);
          box-shadow: 0 0 14px rgba(118,228,247,0.16), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .cer .swatch-row { display: flex; gap: 16px; margin-top: 8px; }
        .cer .swatch { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 11px; color: #A9C6CF; }
        .cer .chip { width: 56px; height: 56px; border-radius: 12px; box-shadow: 0 0 14px rgba(118,228,247,0.3); }
      `}</style>

      <div className="col sidebar">
        <h2>Sidebar nav</h2>
        <div className="nav nav-active">
          <span className="ico">◆</span> Dashboard
        </div>
        <div className="nav nav-idle">
          <span className="ico">▣</span> Topics
        </div>
        <div className="nav nav-idle">
          <span className="ico">✦</span> Brain Lab <span className="pro">PRO</span>
        </div>
        <div className="nav nav-idle">
          <span className="ico">◷</span> Progress
        </div>
        <div className="nav nav-idle">
          <span className="ico">♥</span> Reflections
        </div>
      </div>

      <div className="col buttons">
        <h2>Buttons</h2>
        <div className="btn-row">
          <button className="btn-glass-strong">Primary CTA</button>
          <button className="btn-glass">Glass button</button>
          <button className="btn-secondary">Secondary</button>
          <button className="btn-outline">Outline</button>
        </div>

        <h2 style={{ marginTop: 8 }}>Locked accent — surf #76E4F7</h2>
        <div className="swatch-row">
          <div className="swatch"><div className="chip" style={{ background: "#2A7387" }} /> steel #2A7387</div>
          <div className="swatch"><div className="chip" style={{ background: "#5EB0C8" }} /> teal #5EB0C8</div>
          <div className="swatch"><div className="chip" style={{ background: "#76E4F7" }} /> surf #76E4F7</div>
          <div className="swatch"><div className="chip" style={{ background: "#A7F3FF" }} /> mist #A7F3FF</div>
        </div>

        <h2 style={{ marginTop: 28 }}>Retired — mint (gone everywhere)</h2>
        <div className="swatch-row">
          <div className="swatch" style={{ opacity: 0.7 }}>
            <div className="chip" style={{ background: "#5EEAD4", boxShadow: "none", position: "relative" }}>
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#03151D" }}>✕</span>
            </div>
            #5EEAD4
          </div>
        </div>
      </div>
    </div>
  );
}
