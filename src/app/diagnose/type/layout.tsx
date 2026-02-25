import { Metadata } from "next";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "FIREタイプ診断 | あなたに合ったFIREスタイルがわかる",
  description: "8問に答えるだけ。ノマドFIRE・里山FIRE・クリエイターFIREなど6タイプの中からあなたにぴったりのFIREスタイルを診断します。結果はXでシェア可能。",
  alternates: { canonical: "/diagnose/type/" },
  openGraph: {
    title: "FIREタイプ診断 | あなたに合ったFIREスタイルがわかる",
    description: "8問に答えるだけ。あなたにぴったりのFIREスタイルを診断します。",
    url: "/diagnose/type/",
    siteName: "FIREシミュレーター",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
