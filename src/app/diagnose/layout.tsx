import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FIRE達成度診断 | あなたはFIREまであと何年？",
  description:
    "たった3問であなたのFIRE達成度を診断。年齢・貯蓄額・資産額からFIRE達成年齢とランクを判定します。",
  openGraph: {
    title: "FIRE達成度診断 | あなたはFIREまであと何年？",
    description:
      "たった3問であなたのFIRE達成度を診断。年齢・貯蓄額・資産額からFIRE達成年齢とランクを判定します。",
  },
};

export default function DiagnoseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
