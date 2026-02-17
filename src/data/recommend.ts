export interface Broker {
  name: string;
  slug: string;
  description: string;
  features: string[];
  nisa: boolean;
  ideco: boolean;
  minFee: string;
  creditCardReturn: string;
  fundCount: string;
  usStockCount: string;
  idecoCount: string;
  pointType: string;
  url: string; // 公式サイトURL
  affiliateUrl?: string; // アフィリエイトURL（A8.net等）
  trackingPixel?: string; // アフィリエイト計測用1x1ピクセル
  isAffiliate?: boolean; // アフィリエイト案件フラグ
}

export interface Book {
  title: string;
  author: string;
  description: string;
  url: string; // Amazon等のURL（後でアフィリエイトURLに差し替え）
  tags: string[];
}

export interface Fund {
  name: string;
  type: string;
  costRatio: string;
  description: string;
}

export const brokers: Broker[] = [
  {
    name: "三菱UFJ eスマート証券",
    slug: "mufg-esmart",
    description:
      "三菱UFJフィナンシャル・グループの信頼感と、投資アプリ「TOSSY」の使いやすさを両立。株・投信・FXまでアプリひとつで完結し、Pontaポイント還元やauじぶん銀行との金利優遇も魅力。",
    features: [
      "投資アプリ「TOSSY」で株・投信・FXまでスマホで一元管理",
      "au PAYカード積立でPontaポイント最大1%還元",
      "auじぶん銀行連携で普通預金金利が最大年0.31%に優遇",
      "新NISA対応・投信購入手数料すべて無料",
    ],
    nisa: true,
    ideco: true,
    minFee: "0円",
    creditCardReturn: "最大1%",
    fundCount: "1,700本以上",
    usStockCount: "1,800銘柄以上",
    idecoCount: "27本",
    pointType: "Pontaポイント",
    url: "https://kabu.com/",
    affiliateUrl:
      "https://px.a8.net/svt/ejp?a8mat=4AXDCI+D44RHU+1WP2+1HM30Y",
    trackingPixel:
      "https://www19.a8.net/0.gif?a8mat=4AXDCI+D44RHU+1WP2+1HM30Y",
    isAffiliate: true,
  },
  {
    name: "DMM株（DMM.com証券）",
    slug: "dmm",
    description:
      "米国株の取引手数料が一律0円という圧倒的なコスト優位性。口座開設は最短即日完了で、すぐに取引を始められる。25歳以下なら国内株手数料も実質無料で、若い世代のFIRE志向者に特におすすめ。",
    features: [
      "米国株式の取引手数料が一律0円（業界唯一水準）",
      "国内株式の取引手数料も業界最安水準",
      "最短即日で口座開設完了・すぐに取引開始",
      "新NISA対応・25歳以下は国内株手数料実質無料",
    ],
    nisa: true,
    ideco: false,
    minFee: "0円",
    creditCardReturn: "米国株0円",
    fundCount: "個別株特化",
    usStockCount: "2,500銘柄以上",
    idecoCount: "-",
    pointType: "DMM株ポイント",
    url: "https://kabu.dmm.com/",
    affiliateUrl:
      "https://px.a8.net/svt/ejp?a8mat=4AXDCI+C4ER76+1WP2+15R4NM",
    trackingPixel:
      "https://www18.a8.net/0.gif?a8mat=4AXDCI+C4ER76+1WP2+15R4NM",
    isAffiliate: true,
  },
  {
    name: "SBI証券",
    slug: "sbi",
    description:
      "ネット証券最大手。投信積立クレカ対応、Vポイント還元。FIRE志向者に最も人気の証券会社。",
    features: [
      "投信積立のクレカ決済（三井住友カード）でポイント還元",
      "新NISA対応・投信購入手数料すべて無料",
      "iDeCo取扱商品数が業界最多水準",
      "米国株式の取扱銘柄数が豊富",
    ],
    nisa: true,
    ideco: true,
    minFee: "0円",
    creditCardReturn: "最大5%",
    fundCount: "2,600本以上",
    usStockCount: "5,400銘柄以上",
    idecoCount: "38本",
    pointType: "Vポイント",
    url: "https://www.sbisec.co.jp/",
  },
  {
    name: "楽天証券",
    slug: "rakuten",
    description:
      "楽天経済圏との相性抜群。楽天カード積立で楽天ポイント還元。初心者にも使いやすいUI。",
    features: [
      "楽天カード積立で最大1%ポイント還元",
      "楽天銀行連携で普通預金金利UP",
      "投資信託の品揃えが豊富",
      "マネーブリッジで資金移動が簡単",
    ],
    nisa: true,
    ideco: true,
    minFee: "0円",
    creditCardReturn: "最大1%",
    fundCount: "2,600本以上",
    usStockCount: "4,700銘柄以上",
    idecoCount: "32本",
    pointType: "楽天ポイント",
    url: "https://www.rakuten-sec.co.jp/",
  },
  {
    name: "マネックス証券",
    slug: "monex",
    description:
      "米国株に強い。銘柄分析ツール「銘柄スカウター」が秀逸。高配当株投資にもおすすめ。",
    features: [
      "米国株の取扱銘柄数がトップクラス",
      "銘柄スカウターで企業分析が簡単",
      "dカード積立でdポイント還元",
      "新NISA対応・投信購入手数料無料",
    ],
    nisa: true,
    ideco: true,
    minFee: "0円",
    creditCardReturn: "最大1.1%",
    fundCount: "1,700本以上",
    usStockCount: "5,000銘柄以上",
    idecoCount: "27本",
    pointType: "dポイント",
    url: "https://www.monex.co.jp/",
  },
];

export const books: Book[] = [
  {
    title: "FIRE 最強の早期リタイア術",
    author: "クリスティー・シェン、ブライス・リャン",
    description:
      "カナダでFIREを達成した著者夫妻の実践記。投資ポートフォリオの具体的な構築方法からFIRE後の生活まで幅広くカバー。FIRE入門書の定番。",
    url: "https://www.amazon.co.jp/dp/4478108579",
    tags: ["FIRE入門", "実践記"],
  },
  {
    title: "本気でFIREをめざす人のための資産形成入門",
    author: "穂高 唯希",
    description:
      "日本でFIREを実践した著者による具体的なロードマップ。高配当株投資を中心としたFIRE戦略を解説。日本の税制・社会保険を踏まえた内容。",
    url: "https://www.amazon.co.jp/dp/4408339563",
    tags: ["日本版FIRE", "高配当"],
  },
  {
    title: "ほったらかし投資術",
    author: "山崎元、水瀬ケンイチ",
    description:
      "インデックス投資の入門書として長年ベストセラー。全世界株式インデックスファンド1本で資産形成する方法を平易に解説。",
    url: "https://www.amazon.co.jp/dp/4022518634",
    tags: ["インデックス投資", "入門"],
  },
  {
    title: "敗者のゲーム",
    author: "チャールズ・エリス",
    description:
      "投資の名著。なぜアクティブ運用よりインデックス運用が優れているかを論理的に解説。長期投資の重要性を理解するための必読書。",
    url: "https://www.amazon.co.jp/dp/4532358000",
    tags: ["投資哲学", "名著"],
  },
  {
    title: "ウォール街のランダム・ウォーカー",
    author: "バートン・マルキール",
    description:
      "効率的市場仮説とインデックス投資の重要性を説いた古典的名著。投資理論を体系的に学びたいFIRE志向者におすすめ。",
    url: "https://www.amazon.co.jp/dp/4532359287",
    tags: ["投資理論", "名著"],
  },
  {
    title: "DIE WITH ZERO",
    author: "ビル・パーキンス",
    description:
      "「ゼロで死ね」。お金を貯めすぎず人生を最大限楽しむという視点。FIRE達成後の「使い方」を考えるきっかけになる一冊。",
    url: "https://www.amazon.co.jp/dp/4478109680",
    tags: ["人生設計", "FIRE後"],
  },
];

export const funds: Fund[] = [
  {
    name: "eMAXIS Slim 全世界株式（オール・カントリー）",
    type: "全世界株式",
    costRatio: "0.05775%",
    description:
      "通称「オルカン」。全世界約50カ国の株式に分散投資。FIRE志向者の積立先として最も人気。信託報酬が業界最低水準。",
  },
  {
    name: "eMAXIS Slim 米国株式（S&P500）",
    type: "米国株式",
    costRatio: "0.09372%",
    description:
      "米国の大型株500銘柄に投資するS&P500連動ファンド。過去のリターン実績が高く、4%ルールの根拠となった市場。",
  },
  {
    name: "eMAXIS Slim 先進国株式インデックス",
    type: "先進国株式",
    costRatio: "0.09889%",
    description:
      "日本を除く先進国の株式に投資。オルカンよりも新興国リスクを避けたい方向け。安定性を重視するFIRE志向者に。",
  },
  {
    name: "SBI・V・全米株式インデックス・ファンド",
    type: "米国株式（全体）",
    costRatio: "0.0938%",
    description:
      "米国の大型〜小型株を含む約4,000銘柄に投資。S&P500よりも分散が効いており、バンガードVTIに連動。",
  },
];
