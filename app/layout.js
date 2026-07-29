import "./globals.css";

export const metadata = {
  title: "SportSphere Shop",
  description: "A sports shopping website built with Next.js and Node.js."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
