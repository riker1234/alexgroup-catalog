"use client";

import { useState } from "react";

type Props = {
  objectId: number;
  objectTitle: string;
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  let normalized = digits;

  if (normalized.startsWith("8")) {
    normalized = "7" + normalized.slice(1);
  }

  if (!normalized.startsWith("7")) {
    normalized = "7" + normalized;
  }

  normalized = normalized.slice(0, 11);

  const part1 = normalized.slice(1, 4);
  const part2 = normalized.slice(4, 7);
  const part3 = normalized.slice(7, 9);
  const part4 = normalized.slice(9, 11);

  let result = "+7";

  if (part1) result += ` (${part1}`;
  if (part1.length === 3) result += ")";
  if (part2) result += ` ${part2}`;
  if (part3) result += `-${part3}`;
  if (part4) result += `-${part4}`;

  return result;
}

function getPhoneDigitsCount(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("7") ? digits.length : digits.length + 1;
}

export default function LeadModal({ objectId, objectTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [commonError, setCommonError] = useState("");

  function resetForm() {
    setName("");
    setPhone("+7");
    setMessage("");
    setNameError("");
    setPhoneError("");
    setCommonError("");
    setSuccess(false);
    setLoading(false);
  }

  function closeModal() {
    setOpen(false);
    resetForm();
  }

  function validate() {
    let isValid = true;

    setNameError("");
    setPhoneError("");
    setCommonError("");

    if (!name.trim()) {
      setNameError("Введите имя");
      isValid = false;
    }

    if (getPhoneDigitsCount(phone) < 11) {
      setPhoneError("Введите телефон полностью");
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setCommonError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim(),
          objectId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCommonError(data.error || "Ошибка отправки");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setName("");
      setPhone("+7");
      setMessage("");
    } catch {
      setCommonError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={openButton}
      >
        ОСТАВИТЬ ЗАЯВКУ
      </button>

      {open && (
        <div style={overlay} onClick={closeModal}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closeModal}
              style={closeBtn}
              aria-label="Закрыть"
            >
              ✕
            </button>

            <h2 style={title}>Оставить заявку</h2>

            <p style={subtitle}>
              Оставьте контакты, и с вами свяжутся по проекту{" "}
              <strong>{objectTitle}</strong>.
            </p>

            {success ? (
              <div style={successBox}>
                Заявка отправлена. Мы скоро с вами свяжемся.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={fieldWrap}>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                    style={{
                      ...input,
                      borderColor: nameError ? "#dc2626" : "#d1d5db",
                    }}
                  />
                  {nameError ? <div style={errorText}>{nameError}</div> : null}
                </div>

                <div style={fieldWrap}>
                  <input
                    type="text"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => {
                      setPhone(formatPhone(e.target.value));
                      if (phoneError) setPhoneError("");
                    }}
                    style={{
                      ...input,
                      borderColor: phoneError ? "#dc2626" : "#d1d5db",
                    }}
                  />
                  {phoneError ? <div style={errorText}>{phoneError}</div> : null}
                </div>

                <div style={fieldWrap}>
                  <textarea
                    placeholder="Комментарий"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={textarea}
                  />
                </div>

                {commonError ? <div style={errorText}>{commonError}</div> : null}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...submit,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "default" : "pointer",
                  }}
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

const openButton: React.CSSProperties = {
  width: "100%",
  padding: "16px 20px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#10213a",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.02em",
  cursor: "pointer",
};

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "16px",
};

const modal: React.CSSProperties = {
  width: "100%",
  maxWidth: "460px",
  background: "#ffffff",
  borderRadius: "12px",
  padding: "24px",
  position: "relative",
  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
};

const closeBtn: React.CSSProperties = {
  position: "absolute",
  top: "12px",
  right: "12px",
  border: "none",
  background: "transparent",
  fontSize: "20px",
  lineHeight: 1,
  cursor: "pointer",
  color: "#6b7280",
};

const title: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "10px",
  fontSize: "36px",
  textAlign: "center",
  color: "#111827",
};

const subtitle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "18px",
  textAlign: "center",
  color: "#4b5563",
  lineHeight: 1.6,
  fontSize: "15px",
};

const fieldWrap: React.CSSProperties = {
  marginBottom: "12px",
};

const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  color: "#111827",
  backgroundColor: "#ffffff",
};

const textarea: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: "100px",
  padding: "14px 16px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  color: "#111827",
  backgroundColor: "#ffffff",
  resize: "vertical",
};

const submit: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#1f2b3d",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 700,
};

const errorText: React.CSSProperties = {
  marginTop: "6px",
  fontSize: "13px",
  color: "#dc2626",
};

const successBox: React.CSSProperties = {
  padding: "16px",
  borderRadius: "8px",
  backgroundColor: "#ecfdf5",
  color: "#166534",
  textAlign: "center",
  fontWeight: 600,
};