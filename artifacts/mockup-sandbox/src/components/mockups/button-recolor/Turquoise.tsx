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


export function Turquoise() {
  return (
    <Shell title="Deep Turquoise">
      <Row label="Primary">
        <Btn bg="linear-gradient(180deg, #2c8ba3 0%, #1f6f84 100%)" border="#3fa3bc" color="#ffffff" shadow="inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 18px -12px rgba(31,111,132,0.45)">Start Studying</Btn>
        <Btn bg="linear-gradient(180deg, #35a0bb 0%, #257e95 100%)" border="#3fa3bc" color="#ffffff" shadow="inset 0 1px 0 rgba(255,255,255,0.45), 0 0 16px -2px rgba(31,111,132,0.45), 0 10px 20px -12px rgba(31,111,132,0.45)">Hover</Btn>
      </Row>
      <Row label="Secondary">
        <Btn bg="#f4f5f6" border="#7fb9c8" color="#1f6f84">View Progress</Btn>
        <Btn bg="#eaecee" border="#7fb9c8" color="#1f6f84">Hover</Btn>
      </Row>
      <Row label="Ghost">
        <Btn bg="transparent" border="transparent" color="#1f6f84" shadow="none" ghost>Skip for now</Btn>
      </Row>
      <Row label="Disabled">
        <Btn bg="linear-gradient(180deg, #2c8ba3 0%, #1f6f84 100%)" border="#3fa3bc" color="#ffffff" shadow="none"><span style={{opacity:0.55}}>Start Studying</span></Btn>
      </Row>
    </Shell>
  );
}
