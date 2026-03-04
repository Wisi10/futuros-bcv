export const metadata = {
  title: "Futuros BCV",
  description: "Microservicio de tasa BCV",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
