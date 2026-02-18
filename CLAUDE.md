# FIREシミュレーター — プロジェクトコンテキスト

## 概要
日本向け FIRE（経済的自立・早期退職）シミュレーションWebアプリ。地域・年収・家族構成から必要資産額と達成年を計算し、ガイド記事やモデルケースを通じてユーザーの資産形成を支援する。

## 技術スタック
- **Next.js 15** (App Router, Static Export中心)
- **TypeScript**
- **Tailwind CSS** (カスタムカラー: primary=blue, accent=green)
- **Recharts** (グラフ)
- **Vercel** デプロイ
- 外部DB: Upstash KV (カウンター用)

## サイト構成
| パス | 内容 |
|------|------|
| `/` | トップページ |
| `/simulate/` | メインシミュレーター |
| `/diagnose/` | FIRE診断 (3問でグレード判定) |
| `/withdraw/` | 取り崩しシミュレーション |
| `/tracker/` | 進捗トラッカー (localStorage) |
| `/guide/` | ガイド記事一覧 |
| `/guide/[slug]/` | 個別ガイド記事 |
| `/recommend/` | おすすめ証券口座・投信 (アフィリエイト) |
| `/fire/` | 地域別一覧 |
| `/fire/[pref]/` | 都道府県別FIRE情報 |
| `/cases/` | モデルケース一覧 |
| `/cases/[slug]/` | 個別モデルケース |
| `/plan/` | 年収×年代別プラン |
| `/faq/` | よくある質問 |
| `/result/` | シミュレーション結果 (動的、OGP画像付き) |

## データ構成
- `src/data/guides/index.ts` — ガイド記事データ (マークダウン風テキスト)
- `src/data/prefectures.ts` — 都道府県データ・生活費係数
- `src/data/model-cases.ts` — モデルケースデータ
- `src/data/recommend.ts` — 証券口座・投信のアフィリエイトデータ
- `src/config/assumptions.ts` — 計算の前提条件

## 本番URL
https://fire-sim-phi.vercel.app

## 品質基準
- `npm run build` が通ること (必須)
- SEO: 全ページに title / description / openGraph。記事ページには JSON-LD (Article + BreadcrumbList)
- アクセシビリティ: ARIA ラベル、キーボードナビ、スクリーンリーダー対応
- パフォーマンス: 静的生成優先、Client Component は最小限
- モバイルファースト: Tailwind sm: ブレークポイント (640px)

## コミット規約
- 日本語OK、英語OK（英語推奨）
- Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com> を末尾に付与
- 改善は論理的なまとまりでコミットを分ける

## 改善時の注意
- アフィリエイトリンク (`isAffiliate` フラグ) の URL は変更しない
- 計算ロジック (`src/config/assumptions.ts`) は根拠なく変えない
- 既存ページのURLは変更しない（SEO的に破壊的）
