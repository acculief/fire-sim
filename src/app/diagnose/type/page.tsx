"use client";
import { useState } from "react";
import Link from "next/link";
import { SITE_URL } from "@/config/site";

/* ── タイプ定義 ── */
const TYPES = {
  nomad:   { emoji: "🌏", img: "/images/fire-types/nomad.png", name: "ノマドFIRE型",     sub: "世界中を旅しながら生きる",     color: "#6366f1", bg: "#eef2ff", asset: "2,000〜3,000万円", desc: "国境も職業も関係ない。WiFiがあればどこでも家。あなたにとってFIREとは「住む場所の自由」を手に入れることです。タイもポルトガルも、気分次第で移り住める人生が理想。生活費を抑えて少ない資産でも早期FIREを実現できるタイプです。" },
  satoyama:{ emoji: "🏔️", img: "/images/fire-types/satoyama.png", name: "里山FIRE型",       sub: "自然の中でスローライフ",       color: "#16a34a", bg: "#f0fdf4", asset: "1,500〜2,500万円", desc: "都会の競争から離れ、自然のリズムで生きる。畑を耕し、地元の人と繋がり、シンプルだけど豊かな暮らし。生活コストが低いので少ない資産でも実現可能。食の自給自足に挑戦したいタイプです。" },
  creator: { emoji: "🎨", img: "/images/fire-types/creator.png", name: "クリエイターFIRE型", sub: "創作と発信に全時間を使う",    color: "#d946ef", bg: "#fdf4ff", asset: "3,000〜5,000万円", desc: "お金のために働くのをやめて、本当に作りたいものだけ作る。小説、音楽、動画、プロダクト——形は何でもいい。生活費を稼ぐためじゃなく、純粋に表現するために生きるタイプです。" },
  family:  { emoji: "👨‍👩‍👧", img: "/images/fire-types/family.png", name: "家族時間FIRE型",  sub: "子育てと自由時間を両立",      color: "#f59e0b", bg: "#fffbeb", asset: "5,000万円〜1億円", desc: "子供の成長を一瞬も見逃したくない。学校の送り迎え、宿題の付き合い、家族旅行——お金より時間を家族に使いたい。教育費・老後資金も含めると資産は多めに必要ですが、それだけの価値がある人生です。" },
  side:    { emoji: "💼", img: "/images/fire-types/side.png", name: "サイドFIRE型",      sub: "好きな仕事だけ細く続ける",    color: "#0ea5e9", bg: "#f0f9ff", asset: "2,500〜4,000万円", desc: "完全リタイアは退屈すぎる。でも嫌な仕事はもうしない。好きなことで月10〜20万稼ぎながら、残りは投資収益で生活する「いいとこ取り」のFIRE。社会との繋がりも保てます。" },
  premium: { emoji: "👑", img: "/images/fire-types/premium.png", name: "プレミアムFIRE型", sub: "生活水準を下げず豊かに生きる",  color: "#dc2626", bg: "#fef2f2", asset: "1億円以上",       desc: "FIRE後も高級レストラン、ビジネスクラス、趣味への投資は妥協しない。必要資産は多いけれど、それを目標にする明確なビジョンがある。「質の高い人生」にフルベットするタイプです。" },
} as const;

type TypeKey = keyof typeof TYPES;

/* ── 質問定義 ── */
const QUESTIONS = [
  {
    q: "FIREしたら、どこに住む？",
    opts: [
      { text: "🌴 海外のどこかに移住",              scores: { nomad: 3 } },
      { text: "🏡 日本の自然豊かな地方",             scores: { satoyama: 3 } },
      { text: "🏙️ 今の都市のまま（でも余裕を持って）", scores: { side: 2, premium: 1 } },
      { text: "✈️ 旅しながら、どこか一拠点",          scores: { nomad: 2, creator: 1 } },
    ],
  },
  {
    q: "1ヶ月いくらあれば十分？",
    opts: [
      { text: "💚 10万円以下で十分",    scores: { satoyama: 3, nomad: 1 } },
      { text: "💛 15〜20万円くらい",    scores: { side: 2, creator: 1 } },
      { text: "🧡 25〜30万円は欲しい",  scores: { family: 2, side: 1 } },
      { text: "❤️ 40万円以上ないと無理", scores: { premium: 3 } },
    ],
  },
  {
    q: "FIREしたら、何に一番時間を使う？",
    opts: [
      { text: "🌍 旅と冒険",              scores: { nomad: 3 } },
      { text: "🎨 創作・発信・表現",       scores: { creator: 3 } },
      { text: "👶 子供や家族との時間",     scores: { family: 3 } },
      { text: "💻 好きな仕事・副業",       scores: { side: 3 } },
      { text: "🌱 畑・DIY・地域活動",     scores: { satoyama: 3 } },
      { text: "🍽️ 食・旅・文化の享受",    scores: { premium: 3 } },
    ],
  },
  {
    q: "「仕事」に対するあなたの本音は？",
    opts: [
      { text: "🙅 完全にやめたい、二度とやりたくない", scores: { nomad: 2, satoyama: 1 } },
      { text: "😌 好きなことだけ、ゆるく続けたい",    scores: { side: 3 } },
      { text: "🔥 自分のプロジェクトに集中したい",    scores: { creator: 3 } },
      { text: "💰 稼げれば何でもいい、早く辞めたい",  scores: { premium: 2, nomad: 1 } },
    ],
  },
  {
    q: "人との関わりで理想なのは？",
    opts: [
      { text: "🧘 一人の時間が9割でいい",           scores: { satoyama: 2, creator: 1 } },
      { text: "👫 家族・親友と深くつながりたい",      scores: { family: 3 } },
      { text: "🌐 世界中の面白い人と出会いたい",      scores: { nomad: 3 } },
      { text: "🤝 地域コミュニティに根ざしたい",      scores: { satoyama: 2, family: 1 } },
    ],
  },
  {
    q: "お金を使うなら何に？",
    opts: [
      { text: "✈️ 体験・旅行・冒険",           scores: { nomad: 2, premium: 1 } },
      { text: "🎸 創作・趣味・自己投資",         scores: { creator: 3 } },
      { text: "📚 子供の教育・家族のため",       scores: { family: 3 } },
      { text: "🍷 食・ファッション・豊かな暮らし", scores: { premium: 3 } },
      { text: "🌾 自然・食材・シンプルな生活",   scores: { satoyama: 3 } },
    ],
  },
  {
    q: "理想の朝は？",
    opts: [
      { text: "🌅 異国のカフェでゆっくりコーヒー",    scores: { nomad: 3 } },
      { text: "🌾 畑仕事をして新鮮な野菜を収穫",      scores: { satoyama: 3 } },
      { text: "👶 子供と一緒に朝ごはんを作る",         scores: { family: 3 } },
      { text: "💻 好きなプロジェクトを静かに進める",   scores: { creator: 2, side: 1 } },
      { text: "🏨 高級ホテルのブレックファスト",       scores: { premium: 3 } },
    ],
  },
  {
    q: "正直、一番不安なことは？",
    opts: [
      { text: "💸 お金が想定外に足りなくなること",     scores: { premium: 2, family: 1 } },
      { text: "😴 暇すぎて退屈になること",             scores: { side: 3, creator: 1 } },
      { text: "🏠 日本に縛られ続けること",             scores: { nomad: 3 } },
      { text: "👥 人とのつながりが薄くなること",        scores: { family: 2, satoyama: 1 } },
      { text: "😐 特に不安はない",                    scores: { satoyama: 2 } },
    ],
  },
] as const;

export default function FireTypePage() {
  const [step, setStep] = useState(0); // 0=intro, 1-8=questions, 9=result
  const [scores, setScores] = useState<Record<TypeKey, number>>({
    nomad: 0, satoyama: 0, creator: 0, family: 0, side: 0, premium: 0,
  });
  const [animating, setAnimating] = useState(false);

  const totalSteps = QUESTIONS.length;
  const qIndex = step - 1;

  const choose = (optScores: Partial<Record<TypeKey, number>>) => {
    if (animating) return;
    setAnimating(true);
    const next = { ...scores };
    Object.entries(optScores).forEach(([k, v]) => {
      next[k as TypeKey] = (next[k as TypeKey] ?? 0) + (v ?? 0);
    });
    setScores(next);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 300);
  };

  const result: TypeKey = (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "side") as TypeKey;
  const type = TYPES[result];

  const shareText = encodeURIComponent(
    `【FIREタイプ診断】\n\n私のFIREタイプは「${type.emoji} ${type.name}」でした！\n\n${type.sub}\n必要資産の目安: ${type.asset}\n\n👉 あなたのタイプは？\nhttps://fire-simulator.net/diagnose/type`
  );

  /* ── イントロ ── */
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔥</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">FIREタイプ診断</h1>
          <p className="text-gray-500 text-sm mb-1">8問に答えるだけ</p>
          <p className="text-gray-400 text-xs mb-8">あなたにぴったりのFIREスタイルがわかる</p>
          <div className="grid grid-cols-3 gap-2 mb-8">
            {Object.values(TYPES).map((t) => (
              <div key={t.name} className="rounded-xl overflow-hidden shadow-sm border-2 transition-transform hover:scale-105" style={{ borderColor: t.color + "55" }}>
                <img src={t.img} alt={t.name} className="w-full aspect-square object-cover" />
                <div className="px-1 py-1.5 text-center" style={{ background: t.bg }}>
                  <p className="font-semibold text-gray-800 text-[11px] leading-tight">{t.name.replace("型", "")}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep(1)}
            className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl text-lg hover:bg-primary-700 transition-all active:scale-95"
          >
            診断スタート →
          </button>
        </div>
      </div>
    );
  }

  /* ── 結果 ── */
  if (step > totalSteps) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* 結果カード */}
          <div className="rounded-3xl p-6 mb-6 text-center shadow-sm border" style={{ background: type.bg, borderColor: type.color + "33" }}>
            <img src={type.img} alt={type.name} className="w-32 h-32 rounded-2xl object-cover mx-auto mb-4 shadow-md" />
            <p className="text-xs font-medium mb-1" style={{ color: type.color }}>あなたのFIREタイプは</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{type.name}</h1>
            <p className="text-gray-500 text-sm mb-4">{type.sub}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: type.color + "15", color: type.color }}>
              💰 必要資産の目安: {type.asset}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 shadow-sm">
            <p className="text-sm text-gray-700 leading-relaxed">{type.desc}</p>
          </div>

          {/* スコア内訳 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-3">あなたのFIREタイプ構成</p>
            {(Object.entries(scores) as [TypeKey, number][])
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => {
                const t = TYPES[k];
                const max = Math.max(...Object.values(scores));
                return (
                  <div key={k} className="flex items-center gap-2 mb-2">
                    <span className="text-lg w-6">{t.emoji}</span>
                    <span className="text-xs text-gray-600 w-28 truncate">{t.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${max > 0 ? (v / max) * 100 : 0}%`, background: t.color }} />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* アクション */}
          <div className="flex flex-col gap-3">
            <a
              href={`https://x.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 bg-black text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              結果をXでシェア
            </a>
            <Link
              href="/simulate/"
              className="flex items-center justify-center gap-2 py-3.5 bg-primary-600 text-white text-sm font-bold rounded-2xl hover:bg-primary-700 transition-all"
            >
              🔥 {type.name}のFIRE達成年を計算する
            </Link>
            <button
              onClick={() => { setStep(0); setScores({ nomad: 0, satoyama: 0, creator: 0, family: 0, side: 0, premium: 0 }); }}
              className="py-3 text-gray-400 text-sm hover:text-gray-600"
            >
              もう一度診断する
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 質問 ── */
  const q = QUESTIONS[qIndex];
  const progress = (qIndex / totalSteps) * 100;

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col transition-opacity duration-300 ${animating ? "opacity-50" : "opacity-100"}`}>
      {/* プログレスバー */}
      <div className="h-1 bg-gray-200">
        <div className="h-1 bg-primary-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex flex-col px-4 py-8 max-w-md mx-auto w-full">
        {/* カウンター */}
        <p className="text-xs text-gray-400 mb-6 text-center">{qIndex + 1} / {totalSteps}</p>

        {/* 質問 */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-8 leading-snug">
          {q.q}
        </h2>

        {/* 選択肢 */}
        <div className="flex flex-col gap-3">
          {q.opts.map((opt, i) => (
            <button
              key={i}
              onClick={() => choose(opt.scores)}
              className="w-full text-left px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl text-sm font-medium text-gray-800 hover:border-primary-300 hover:bg-primary-50 active:scale-[0.98] transition-all shadow-sm"
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
