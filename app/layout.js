import "./globals.css";

export const metadata = { title: "App Logística" };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <script src="https://cdn.tailwindcss.com"></script>
      <body>{children}</body>
    </html>
  );
}
