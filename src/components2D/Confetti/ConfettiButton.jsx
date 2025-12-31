export default function ConfettiButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 30,
        right: 30,
        zIndex: 10,
        padding: "12px 20px",
        borderRadius: 30,
        border: "none",
        background: "#ffd93d",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      🎊 Celebrate
    </button>
  );
}
