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

export interface Fund {
  name: string;
  type: string;
  costRatio: string;
  description: string;
}

export const brokers: Broker[] = [
  {
    name: "TOSSY（DMM.com証券）",
    slug: "tossy",
    description:
      "DMM.com証券が提供するウルトラ投資アプリ。あらゆる取引がアプリひとつで完結し、お得な特典も盛りだくさん。直感的な操作性で初心者でもすぐに始められる。",
    features: [
      "株・FX・CFDまでアプリひとつで完結",
      "直感的なUIで初心者でも迷わず操作",
      "お得なキャンペーン・特典が充実",
      "新NISA対応・最短即日で取引開始",
    ],
    nisa: true,
    ideco: false,
    minFee: "0円",
    creditCardReturn: "特典充実",
    fundCount: "アプリ完結",
    usStockCount: "2,500銘柄以上",
    idecoCount: "-",
    pointType: "DMM株ポイント",
    url: "https://kabu.dmm.com/",
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
  {
    name: "松井証券",
    slug: "matsui",
    description:
      "創業100年超の老舗ネット証券。株式・投資信託・先物など豊富な投資サービスを提供。1日の約定代金50万円まで手数料無料で、少額投資のFIRE初心者に最適。投信残高に応じたポイント還元も魅力。",
    features: [
      "1日の約定代金50万円まで手数料無料",
      "投信残高に応じて松井証券ポイント還元",
      "老舗ならではの手厚いサポート体制",
      "新NISA対応・iDeCo取扱あり",
    ],
    nisa: true,
    ideco: true,
    minFee: "0円",
    creditCardReturn: "投信残高還元",
    fundCount: "1,800本以上",
    usStockCount: "3,800銘柄以上",
    idecoCount: "40本",
    pointType: "松井証券ポイント",
    url: "https://www.matsui.co.jp/",
    affiliateUrl:
      "https://px.a8.net/svt/ejp?a8mat=4AXDCI+96FLIQ+3XCC+691UP",
    trackingPixel:
      "https://www13.a8.net/0.gif?a8mat=4AXDCI+96FLIQ+3XCC+691UP",
    isAffiliate: true,
  },
  {
    name: "三菱UFJ eスマート証券",
    slug: "mufg-esmart",
    description:
      "旧auカブコム証券。三菱UFJフィナンシャル・グループの安心感。Pontaポイント投資やauじぶん銀行連携による金利優遇が魅力。",
    features: [
      "au PAYカード積立でPontaポイント還元",
      "auじぶん銀行連携で金利優遇",
      "Pontaポイントで投資信託が買える",
      "新NISA対応・投信購入手数料無料",
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
