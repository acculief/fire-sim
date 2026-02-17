import { Metadata } from "next";

export const metadata: Metadata = {
  title: "よくある質問（FAQ） | FIREの疑問を解決",
  description:
    "FIREに必要な資産額、4%ルール、投資戦略、生活費の目安など、FIRE（経済的自立・早期退職）に関するよくある質問にお答えします。",
  openGraph: {
    title: "よくある質問（FAQ） | FIREの疑問を解決",
    description:
      "FIREに必要な資産額、4%ルール、投資戦略など、よくある質問に回答。",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
