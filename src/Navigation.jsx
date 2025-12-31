import { Link } from "react-router-dom";

function Navigation() {
  return (
    <div style={styles.container}>
      <h1>🎉 Wishes Navigation 🎉</h1>

      <div style={styles.links}>
        <Link to="/wish-1">Wish 1</Link>
        <Link to="/wish-2">Wish 2</Link>
        <Link to="/wish-3">Wish 3</Link>
        <Link to="/wish-4">Wish 4</Link>
        <Link to="/wish-5">Wish 5</Link>
        <Link to="/wish-6">Wish 6</Link>
        <Link to="/wish-7">Wish 7</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
  },
  links: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    fontSize: "18px",
  },
};

export default Navigation;
