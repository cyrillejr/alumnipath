// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlumniPath — Université de Yaoundé I",
  description: "Enquête et analyse de l'insertion professionnelle des diplômés de l'Université de Yaoundé I",
  keywords: ["alumni", "Yaoundé", "insertion professionnelle", "diplômés"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
