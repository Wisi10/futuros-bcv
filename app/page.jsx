export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Futuros BCV</h1>
      <p>Microservicio de tasa oficial del Banco Central de Venezuela.</p>
      <p>
        Endpoint: <code>GET /api/rates</code>
      </p>
    </div>
  );
}
