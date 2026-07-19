import React from "react";

type BtnProps = {
  bg: string; border: string; color: string; shadow?: string; ghost?: boolean;
  children: React.ReactNode;
};
function Btn({ bg, border, color, shadow, ghost, children }: BtnProps) {
  return (
    <button
      style={{
        background: bg,
        border: `1.5px solid ${border}`,
        color,
        boxShadow: shadow ?? "0 1px 2px rgba(20,23,26,0.10)",
        borderRadius: 10,
        padding: "10px 22px",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Inter, system-ui, sans-serif",
        cursor: "pointer",
        opacity: ghost ? 1 : undefined,
      }}
    >
      {children}
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <span style={{ width: 110, fontSize: 12, color: "#6b7278", fontFamily: "Inter, system-ui, sans-serif" }}>{label}</span>
      {children}
    </div>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(120% 90% at 50% 0%, #ffffff 0%, #eef1f3 55%, #dfe3e6 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 32,
    }}>
      <div style={{
        background: "#f7f8f9", border: "1px solid #dfe3e6", borderRadius: 18,
        padding: "30px 34px", boxShadow: "0 18px 40px -28px rgba(20,23,26,0.35)",
        display: "flex", flexDirection: "column", gap: 20, minWidth: 480,
      }}>
        <h2 style={{ margin: 0, fontSize: 15, letterSpacing: "0.14em", textTransform: "uppercase",
          color: "#24282c", fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}


export function SilverChrome() {
  return (
    <Shell title="Silver Chrome">
      <Row label="Primary">
        <Btn bg="linear-gradient(180deg, #f2f4f6 0%, #c9ced3 55%, #b4bac0 100%)" border="#9aa2a9" color="#24282c" shadow="inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 18px -12px rgba(90,98,105,0.40)">Start Studying</Btn>
        <Btn bg="linear-gradient(180deg, #ffffff 0%, #d5dade 55%, #c0c6cc 100%)" border="#9aa2a9" color="#24282c" shadow="inset 0 1px 0 rgba(255,255,255,0.45), 0 0 16px -2px rgba(90,98,105,0.40), 0 10px 20px -12px rgba(90,98,105,0.40)">Hover</Btn>
      </Row>
      <Row label="Secondary">
        <Btn bg="#f4f5f6" border="#b4bac0" color="#3f4449">View Progress</Btn>
        <Btn bg="#eaecee" border="#b4bac0" color="#3f4449">Hover</Btn>
      </Row>
      <Row label="Ghost">
        <Btn bg="transparent" border="transparent" color="#3f4449" shadow="none" ghost>Skip for now</Btn>
      </Row>
      <Row label="Disabled">
        <Btn bg="linear-gradient(180deg, #f2f4f6 0%, #c9ced3 55%, #b4bac0 100%)" border="#9aa2a9" color="#24282c" shadow="none"><span style={{opacity:0.55}}>Start Studying</span></Btn>
      </Row>
    </Shell>
  );
}
