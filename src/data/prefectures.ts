export interface Prefecture {
  code: string;
  name: string;
  nameEn: string;
  costIndex: number;
  region: string;
}

export const prefectures: Prefecture[] = [
  { code: "hokkaido", name: "北海道", nameEn: "hokkaido", costIndex: 0.90, region: "北海道" },
  { code: "aomori", name: "青森県", nameEn: "aomori", costIndex: 0.85, region: "東北" },
  { code: "iwate", name: "岩手県", nameEn: "iwate", costIndex: 0.85, region: "東北" },
  { code: "miyagi", name: "宮城県", nameEn: "miyagi", costIndex: 0.92, region: "東北" },
  { code: "akita", name: "秋田県", nameEn: "akita", costIndex: 0.84, region: "東北" },
  { code: "yamagata", name: "山形県", nameEn: "yamagata", costIndex: 0.86, region: "東北" },
  { code: "fukushima", name: "福島県", nameEn: "fukushima", costIndex: 0.87, region: "東北" },
  { code: "ibaraki", name: "茨城県", nameEn: "ibaraki", costIndex: 0.91, region: "関東" },
  { code: "tochigi", name: "栃木県", nameEn: "tochigi", costIndex: 0.90, region: "関東" },
  { code: "gunma", name: "群馬県", nameEn: "gunma", costIndex: 0.89, region: "関東" },
  { code: "saitama", name: "埼玉県", nameEn: "saitama", costIndex: 0.98, region: "関東" },
  { code: "chiba", name: "千葉県", nameEn: "chiba", costIndex: 0.97, region: "関東" },
  { code: "tokyo", name: "東京都", nameEn: "tokyo", costIndex: 1.25, region: "関東" },
  { code: "kanagawa", name: "神奈川県", nameEn: "kanagawa", costIndex: 1.10, region: "関東" },
  { code: "niigata", name: "新潟県", nameEn: "niigata", costIndex: 0.88, region: "中部" },
  { code: "toyama", name: "富山県", nameEn: "toyama", costIndex: 0.88, region: "中部" },
  { code: "ishikawa", name: "石川県", nameEn: "ishikawa", costIndex: 0.90, region: "中部" },
  { code: "fukui", name: "福井県", nameEn: "fukui", costIndex: 0.88, region: "中部" },
  { code: "yamanashi", name: "山梨県", nameEn: "yamanashi", costIndex: 0.89, region: "中部" },
  { code: "nagano", name: "長野県", nameEn: "nagano", costIndex: 0.89, region: "中部" },
  { code: "gifu", name: "岐阜県", nameEn: "gifu", costIndex: 0.90, region: "中部" },
  { code: "shizuoka", name: "静岡県", nameEn: "shizuoka", costIndex: 0.93, region: "中部" },
  { code: "aichi", name: "愛知県", nameEn: "aichi", costIndex: 1.00, region: "中部" },
  { code: "mie", name: "三重県", nameEn: "mie", costIndex: 0.90, region: "近畿" },
  { code: "shiga", name: "滋賀県", nameEn: "shiga", costIndex: 0.92, region: "近畿" },
  { code: "kyoto", name: "京都府", nameEn: "kyoto", costIndex: 1.02, region: "近畿" },
  { code: "osaka", name: "大阪府", nameEn: "osaka", costIndex: 1.05, region: "近畿" },
  { code: "hyogo", name: "兵庫県", nameEn: "hyogo", costIndex: 0.98, region: "近畿" },
  { code: "nara", name: "奈良県", nameEn: "nara", costIndex: 0.93, region: "近畿" },
  { code: "wakayama", name: "和歌山県", nameEn: "wakayama", costIndex: 0.87, region: "近畿" },
  { code: "tottori", name: "鳥取県", nameEn: "tottori", costIndex: 0.86, region: "中国" },
  { code: "shimane", name: "島根県", nameEn: "shimane", costIndex: 0.86, region: "中国" },
  { code: "okayama", name: "岡山県", nameEn: "okayama", costIndex: 0.90, region: "中国" },
  { code: "hiroshima", name: "広島県", nameEn: "hiroshima", costIndex: 0.93, region: "中国" },
  { code: "yamaguchi", name: "山口県", nameEn: "yamaguchi", costIndex: 0.88, region: "中国" },
  { code: "tokushima", name: "徳島県", nameEn: "tokushima", costIndex: 0.87, region: "四国" },
  { code: "kagawa", name: "香川県", nameEn: "kagawa", costIndex: 0.88, region: "四国" },
  { code: "ehime", name: "愛媛県", nameEn: "ehime", costIndex: 0.87, region: "四国" },
  { code: "kochi", name: "高知県", nameEn: "kochi", costIndex: 0.86, region: "四国" },
  { code: "fukuoka", name: "福岡県", nameEn: "fukuoka", costIndex: 0.95, region: "九州" },
  { code: "saga", name: "佐賀県", nameEn: "saga", costIndex: 0.86, region: "九州" },
  { code: "nagasaki", name: "長崎県", nameEn: "nagasaki", costIndex: 0.87, region: "九州" },
  { code: "kumamoto", name: "熊本県", nameEn: "kumamoto", costIndex: 0.87, region: "九州" },
  { code: "oita", name: "大分県", nameEn: "oita", costIndex: 0.87, region: "九州" },
  { code: "miyazaki", name: "宮崎県", nameEn: "miyazaki", costIndex: 0.85, region: "九州" },
  { code: "kagoshima", name: "鹿児島県", nameEn: "kagoshima", costIndex: 0.86, region: "九州" },
  { code: "okinawa", name: "沖縄県", nameEn: "okinawa", costIndex: 0.88, region: "九州" },
];

export function getPrefectureByCode(code: string): Prefecture | undefined {
  return prefectures.find((p) => p.code === code);
}
