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
  title: "Zachary Hutton · CS Student · Full-Stack · Security-minded",
  description:
    "CS student at UTech (GPA 3.7) building across the stack. Coursework, security labs, and production web apps. Open to internships and co-ops.",
  openGraph: {
    title: "Zachary Hutton · Portfolio",
    description:
      "CS student · collaborative builder · security-aware engineer. Based in Jamaica.",
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
