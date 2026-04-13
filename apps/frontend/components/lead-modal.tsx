"use client";

import { useState } from "react";

type Props = {
  objectId: number;
  objectTitle: string;
};

export default function LeadModal({ objectId, objectTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        message,
        objectId,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setName("");
      setPhone("");
      setMessage("");
    } else {
      alert("Ошибка отправки");
    }
  }

  return (
    <>
      {/* КНОПКА */}
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%",
          padding: "16px",
          background: "#1f2b3d",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        ОСТАВИТЬ ЗАЯВКУ
      </button>

      {/* МОДАЛКА */}
      {open && (
        <div style={overlay}>
          <div style={modal}>
            {/* КРЕСТИК */}
            <button
              onClick={() => {
                setOpen(false);
                setSuccess(false);
              }}
              style={closeBtn}
            >
              ✕
            </button>

            <h2 style={{ marginTop: 0 }}>Оставить заявку</h2>

            {success ? (
              <p style={{ color: "green" }}>
                Заявка отправлена ✅
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <input
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={input}
                />

                <input
                  placeholder="Телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={input}
                />

                <textarea
                  placeholder="Комментарий"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={textarea}
                />

                <button
                  type="submit"
                  disabled={loading}
                  style={submit}
                >
                  {loading ? "Отправка..." : "Отправить"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modal: React.CSSProperties = {
  background: "#fff",
  padding: "24px",
  borderRadius: "12px",
  width: "400px",
  position: "relative",
};

const closeBtn: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  border: "none",
  background: "transparent",
  fontSize: "18px",
  cursor: "pointer",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
};

const textarea: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
};

const submit: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  background: "#1f2b3d",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};