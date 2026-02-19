export default function Disclaimer() {
  return (
    <div className="rounded-lg bg-gray-100 p-4 text-xs text-gray-600">
      <p className="font-medium">免責事項・前提条件</p>
      <ul className="mt-1 list-inside list-disc space-y-0.5">
        <li>
          本シミュレーションは概算であり、投資助言・税務助言ではありません。
        </li>
        <li>
          実際の投資成果や税負担は市場環境・個人の状況により大きく異なります。
        </li>
        <li>
          生活費は総務省家計調査等を参考にした簡易係数であり、実際の生活費とは乖離する場合があります。
        </li>
        <li>税金・社会保険料は簡易計算です。正確な試算はFPにご相談ください。</li>
        <li>投資判断はご自身の責任で行ってください。</li>
      </ul>
    </div>
  );
}
