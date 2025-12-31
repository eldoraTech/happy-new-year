import { Link } from "react-router-dom";

function Navigation() {
  const wishes = [
    { id: 1, title: "Wish 1 🌟", path: "/wish-1" },
    { id: 2, title: "Wish 2 🎉", path: "/wish-2" },
    { id: 3, title: "Wish 3 💫", path: "/wish-3" },
    { id: 4, title: "Wish 4 🌸", path: "/wish-4" },
    { id: 5, title: "Wish 5 ⭐", path: "/wish-5" },
    { id: 6, title: "Wish 6 🎂", path: "/wish-6" },
    { id: 7, title: "Wish 7 ❤️", path: "/wish-7" },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>💙 Wishes from Eldora Technologies</h1>

      <p style={styles.message}>
        At <strong>Eldora Technologies</strong>, we believe small wishes can
        create big smiles 😊 <br />
        Choose a wish below — each one is sent with care and positivity from our
        team to you ✨
      </p>

      <div style={styles.grid}>
        {wishes.map((wish) => (
          <Link key={wish.id} to={wish.path} style={styles.card}>
            {wish.title}
            <span style={styles.cardText}>Tap to receive a wish</span>
          </Link>
        ))}
      </div>

      <footer style={styles.footer}>
        🌐 Crafted with ❤️ by{" "}
        <a
          href="https://www.eldoratools.tech/"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.footerLink}
        >
          Eldora Technologies
        </a>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #4f46e5, #9333ea)",
    color: "#fff",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  heading: {
    fontSize: "34px",
    marginBottom: "12px",
  },
  message: {
    maxWidth: "520px",
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "32px",
    opacity: 0.95,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
    width: "100%",
    maxWidth: "420px",
  },
  card: {
    textDecoration: "none",
    background: "rgba(255,255,255,0.18)",
    padding: "20px",
    borderRadius: "16px",
    fontSize: "18px",
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  cardText: {
    fontSize: "13px",
    opacity: 0.85,
  },
  footer: {
    marginTop: "36px",
    fontSize: "14px",
    opacity: 0.9,
  },
  footerLink: {
    color: "#ffd700",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Navigation;
