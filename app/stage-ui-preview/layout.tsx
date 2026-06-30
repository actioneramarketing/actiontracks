import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Stage 1 Dashboard — UI Preview",
};

export default function StageUiPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={inter.variable}>{children}</div>;
}
