"use client";

import { useState, useEffect, useCallback } from "react";

interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type"
  > {
  value: number;
  onValueChange: (value: number) => void;
}

/**
 * type="number" の controlled input で「0が消せない」問題を解決するラッパー。
 * 内部で文字列stateを保持し、空欄→再入力時にリーディングゼロが出ない。
 */
export default function NumberInput({
  value,
  onValueChange,
  min,
  max,
  "aria-invalid": ariaInvalidProp,
  ...props
}: Props) {
  const [raw, setRaw] = useState(String(value));

  // 外部から value が変わったら表示を同期（ユーザー入力中は上書きしない）
  useEffect(() => {
    if (raw === "" || Number(raw) !== value) {
      setRaw(String(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setRaw(v);
      if (v !== "" && !isNaN(Number(v))) {
        onValueChange(Number(v));
      }
    },
    [onValueChange],
  );

  const handleBlur = useCallback(() => {
    if (raw === "" || isNaN(Number(raw))) {
      setRaw("0");
      onValueChange(0);
    }
  }, [raw, onValueChange]);

  // aria-invalid: 呼び出し側の指定を優先、なければ min/max から自動判定
  const isOutOfRange =
    (min != null && value < Number(min)) ||
    (max != null && value > Number(max));
  const ariaInvalid = ariaInvalidProp ?? (isOutOfRange ? true : undefined);

  return (
    <input
      type="number"
      value={raw}
      onChange={handleChange}
      onBlur={handleBlur}
      min={min}
      max={max}
      aria-invalid={ariaInvalid}
      {...props}
    />
  );
}
