import { useState, useEffect } from "react";

const tips = [
  "Cancel unused subscriptions — avg saving: $50/mo",
  "Cook at home 5x/week instead of eating out",
  "Use cashback apps like Rakuten or Honey",
  "Sell unused items on eBay or Facebook Marketplace",
  "Switch to a no-fee bank account",
  "Automate your savings on payday — pay yourself first!",
  "Use the 24-hour rule before any non-essential purchase",
  "Reduce energy bills — unplug devices when not in use",
];

function WelcomeScreen({ onStart }) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [months, setMonths] = useState("");
  const [errors, setErrors] = useState({});
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (!goal || isNaN(goal) || +goal <= 0) e.goal = "Enter a valid savings amount.";
    if (!months || isNaN(months) || +months < 1 || +months > 60) e.months = "Enter months between 1 and 60.";
    return e;
  };

  const handleStart = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onStart({ name: name.trim(), goal: parseFloat(goal), months: parseInt(months) });
  };

  const field = (label, value, setter, key, placeholder, type = "text") => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 800, marginBottom: 8, letterSpacing: 1.5, textTransform: "uppercase" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => { setter(e.target.value); setErrors(p => ({ ...p, [key]: "" })); }}
        onKeyDown={e => e.key === "Enter" && handleStart()}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "13px 16px", borderRadius: 12, boxSizing: "border-box",
          border: errors[key] ? "2px solid #ef4444" : "2px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.09)", color: "white",
          fontSize: 15, fontWeight: 600, outline: "none",
        }}
      />
      {errors[key] && (
        <div style={{ color: "#fca5a5", fontSize: 11, marginTop: 6, fontWeight: 600 }}>
          {errors[key]}
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #111827 0%, #1f2937 55%, #374151 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 24, fontFamily: "'Segoe UI', sans-serif", position: "relative"
    }}>
      <div style={{
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.7s ease", width: "100%", maxWidth: 420, textAlign: "center"
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%",
          background: "linear-gradient(135deg, #6b7280, #374151)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 42, margin: "0 auto 22px",
          boxShadow: "0 0 50px rgba(107,114,128,0.45)"
        }}>
          🎯
        </div>
        <h1 style={{ color: "white", fontSize: 26, fontWeight: 900, margin: "0 0 6px" }}>
          My Savings Tracker
        </h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: "0 0 28px", lineHeight: 1.7 }}>
          Set your goal, enter your name,<br />and start your savings journey.
        </p>
        <div style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.13)",
          borderRadius: 22, padding: 28, backdropFilter: "blur(12px)", textAlign: "left"
        }}>
          {field("👤 Your Name", name, setName, "name", "e.g. PJ🧃")}
          {field("💰 Savings Goal ($)", goal, setGoal, "goal", "e.g. 3000", "number")}
          {field("📅 Time Frame (months)", months, setMonths, "months", "e.g. 6", "number")}
          <button
            onClick={handleStart}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: "linear-gradient(90deg, #4b5563, #6b7280)",
              color: "white", fontSize: 16, fontWeight: 900, cursor: "pointer",
              boxShadow: "0 6px 24px rgba(75,85,99,0.5)", marginTop: 4
            }}
          >
            Start My Journey →
          </button>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 20, textAlign: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 11, fontWeight: 600 }}>
          Crafted with ❤️ by{" "}
          <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 800 }}>PJCreat1v3Stud1o</span>
        </span>
      </div>
    </div>
  );
}

function TrackerApp({ config, onReset }) {
  const { name: userName, goal: GOAL, months: MONTHS } = config;
  const MONTHLY = GOAL / MONTHS;

  const [saved, setSaved] = useState(Array(MONTHS).fill(""));
  const [inputVal, setInputVal] = useState("");
  const [activeMonth, setActive] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [celebrated, setCelebrated] = useState(false);

  const monthNames = Array.from({ length: MONTHS }, (_, i) => `Month ${i + 1}`);
  const totalSaved = saved.reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const progress = Math.min((totalSaved / GOAL) * 100, 100);
  const remaining = Math.max(GOAL - totalSaved, 0);
  const monthsLeft = saved.filter(v => !v || parseFloat(v) === 0).length;

  useEffect(() => {
    if (totalSaved >= GOAL && !celebrated) setCelebrated(true);
  }, [totalSaved]);

  const handleSave = () => {
    if (activeMonth === null || inputVal === "") return;
    const updated = [...saved];
    updated[activeMonth] = inputVal;
    setSaved(updated);
    setInputVal("");
    setActive(null);
  };

  const getStatus = i => {
    const v = parseFloat(saved[i]) || 0;
    if (!saved[i]) return "empty";
    if (v >= MONTHLY) return "met";
    if (v > 0) return "partial";
    return "empty";
  };

  const statusColor = { met: "#4b5563", partial: "#9ca3af", empty: "#e5e7eb" };
  const statusLabel = { met: "✅ Goal Met", partial: "⚠️ Partial", empty: "Not Started" };

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  };

  const fmt = n => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f3f4f6", minHeight: "100vh", paddingBottom: 40 }}>
      <div style={{ background: "linear-gradient(135deg, #111827, #1f2937, #374151)", padding: "22px 24px 34px", color: "white" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.5, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
              {greeting()},
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4 }}>{userName} 👋</div>
            <div style={{ fontSize: 13, opacity: 0.55, marginTop: 4 }}>
              Saving {fmt(GOAL)} in {MONTHS} month{MONTHS > 1 ? "s" : ""}
            </div>
          </div>
          <button
            onClick={onReset}
            style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.55)", borderRadius: 10, padding: "8px 14px",
              fontSize: 12, cursor: "pointer", fontWeight: 700, marginTop: 4
            }}
          >
            ↩ Switch User
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "-16px auto 0", padding: "0 16px" }}>
        <div style={{ background: "white", borderRadius: 20, padding: 24, marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Overall Progress</span>
            <span style={{ fontWeight: 900, color: "#374151", fontSize: 18 }}>{progress.toFixed(1)}%</span>
          </div>
          <div style={{ background: "#e5e7eb", borderRadius: 99, height: 20, overflow: "hidden" }}>
            <div style={{
              width: `${progress}%`, height: "100%",
              background: progress >= 100 ? "linear-gradient(90deg,#374151,#6b7280)" : "linear-gradient(90deg,#4b5563,#9ca3af)",
              borderRadius: 99, transition: "width 0.6s ease",
              display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8
            }}>
              {progress > 15 && (
                <span style={{ fontSize: 10, color: "white", fontWeight: 800 }}>{fmt(totalSaved)}</span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            {[
              { label: "Saved", value: fmt(totalSaved), color: "#374151" },
              { label: "Remaining", value: fmt(remaining), color: "#6b7280" },
              { label: "Months Left", value: monthsLeft, color: "#9ca3af" },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 900, fontSize: 18, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
          {celebrated && (
            <div style={{ marginTop: 16, background: "#f9fafb", border: "2px solid #6b7280", borderRadius: 14, padding: 14, textAlign: "center", fontSize: 15, fontWeight: 800, color: "#374151" }}>
              🎉 Amazing, {userName}! You have crushed your {fmt(GOAL)} goal!
            </div>
          )}
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: 24, marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 800 }}>📅 {userName}'s Monthly Log</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {monthNames.map((mName, i) => {
              const status = getStatus(i);
              const val = parseFloat(saved[i]) || 0;
              const pct = Math.min((val / MONTHLY) * 100, 100);
              return (
                <div
                  key={i}
                  onClick={() => { setActive(i); setInputVal(saved[i] || ""); }}
                  style={{
                    border: `2px solid ${activeMonth === i ? "#4b5563" : statusColor[status]}`,
                    borderRadius: 14, padding: 14, cursor: "pointer",
                    background: activeMonth === i ? "#f3f4f6" : "#fafafa", transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 12 }}>{mName}</span>
                    <span style={{ fontSize: 9, fontWeight: 800, color: status === "met" ? "#374151" : status === "partial" ? "#6b7280" : "#9ca3af" }}>
                      {statusLabel[status]}
                    </span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 20, color: status === "empty" ? "#d1d5db" : "#111827" }}>
                    {fmt(val)}
                  </div>
                  <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 6 }}>Goal: {fmt(MONTHLY)}</div>
                  <div style={{ background: "#e5e7eb", borderRadius: 99, height: 5 }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: statusColor[status] === "#e5e7eb" ? "#d1d5db" : statusColor[status],
                      borderRadius: 99, transition: "width 0.4s"
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
          {activeMonth !== null && (
            <div style={{ marginTop: 16, background: "#f3f4f6", borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "#1f2937" }}>
                💰 How much did you save in {monthNames[activeMonth]}, {userName}?
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSave()}
                  placeholder={`e.g. ${MONTHLY.toFixed(0)}`}
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "2px solid #9ca3af", fontSize: 15, outline: "none" }}
                />
                <button
                  onClick={handleSave}
                  style={{ background: "#374151", color: "white", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 900, cursor: "pointer", fontSize: 14 }}
                >
                  Save
                </button>
                <button
                  onClick={() => setActive(null)}
                  style={{ background: "#e5e7eb", color: "#374151", border: "none", borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: 24, marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>📊 {userName}'s Savings Targets</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Per Day", value: fmt(GOAL / (MONTHS * 30)), icon: "📆", bg: "#f3f4f6", text: "#374151" },
              { label: "Per Week", value: fmt(GOAL / (MONTHS * 4)), icon: "🗓️", bg: "#e5e7eb", text: "#1f2937" },
              { label: "Per Month", value: fmt(MONTHLY), icon: "📅", bg: "#d1d5db", text: "#111827" },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 24 }}>{item.icon}</div>
                <div style={{ fontWeight: 900, fontSize: 16, color: item.text, marginTop: 4 }}>{item.value}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>💡 Tip for {userName}</h2>
            <button
              onClick={() => setTipIndex((tipIndex + 1) % tips.length)}
              style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#374151" }}
            >
              Next →
            </button>
          </div>
          <div style={{ background: "#f9fafb", border: "2px solid #d1d5db", borderRadius: 14, padding: 16, color: "#374151", fontWeight: 600, fontSize: 14, lineHeight: 1.6 }}>
            {tips[tipIndex]}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
            Tip {tipIndex + 1} of {tips.length}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "linear-gradient(135deg, #111827, #374151)", borderRadius: 16, padding: "14px 28px" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
              Designed and Built by
            </div>
            <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: 2, color: "#9ca3af" }}>
              PJCreat1v3Stud1o
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState(null);
  return config
    ? <TrackerApp config={config} onReset={() => setConfig(null)} />
    : <WelcomeScreen onStart={setConfig} />;
  }
