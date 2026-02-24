import { Metadata } from "next";

export const metadata: Metadata = {
  title: "配信停止",
  robots: { index: false, follow: false },
};

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
