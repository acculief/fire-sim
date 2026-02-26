import { Metadata } from "next";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "FIRE診断【無料】あなたはどのFIREタイプ？8問で6タイプ判定",
  description: "無料のFIRE診断。8問に答えるだけでノマドFIRE・里山FIRE・クリエイターFIRE・サイドFIRE・プレミアムFIREなど6タイプのうちあなたに最適なFIREスタイルがわかります。Xシェア対応。",
  alternates: { canonical: "/diagnose/type/" },
  openGraph: {
    title: "FIRE診断【無料】あなたはどのFIREタイプ？8問で6タイプ判定",
    description: "8問に答えるだけ。あなたにぴったりのFIREスタイルを診断します。",
    url: "/diagnose/type/",
    siteName: "FIREシミュレーター",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
