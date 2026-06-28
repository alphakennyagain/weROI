import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import ResumeProvider from "@/components/ResumeProvider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zachary Hutton · Full-Stack Developer · Open to Internships",
  description:
    "Full-stack developer building APIs and web apps with TypeScript, Python, and React. UTech CS (GPA 3.7). Open to internships and co-ops.",
  openGraph: {
    title: "Zachary Hutton · Full-Stack Developer",
    description:
      "Full-stack developer · REST APIs · security-aware. Portmore, Jamaica. Open to internships and co-ops.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} antialiased`}>
        <ThemeProvider>
          <ResumeProvider>{children}</ResumeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
