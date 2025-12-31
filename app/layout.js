import "./globals.css";

export const metadata = {
  title: "Email Tone Adjuster",
  description: "Adjust the tone of your emails with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
