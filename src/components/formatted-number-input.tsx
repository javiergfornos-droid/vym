'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = {
  lang: 'es' | 'en';
  value: string;
  onChange: (value: string) => void;
  className: string;
};

const getSeparators = (lang: 'es' | 'en') =>
  lang === 'es' ? { decimal: ',', group: '.' } : { decimal: '.', group: ',' };

const toCanonical = (rawInput: string) => {
  const cleaned = rawInput.replace(/\s/g, '').replace(/[^\d.,]/g, '');
  if (!cleaned) return '';

  const lastDot = cleaned.lastIndexOf('.');
  const lastComma = cleaned.lastIndexOf(',');
  const decimalIndex = Math.max(lastDot, lastComma);

  const integerPart = (decimalIndex >= 0 ? cleaned.slice(0, decimalIndex) : cleaned).replace(/\D/g, '');
  const fractionPart = (decimalIndex >= 0 ? cleaned.slice(decimalIndex + 1) : '').replace(/\D/g, '');

  const normalizedInteger = integerPart || '0';
  return fractionPart ? `${normalizedInteger}.${fractionPart}` : normalizedInteger;
};

const formatForDisplay = (value: string, lang: 'es' | 'en') => {
  if (!value) return '';

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return '';

  const fractionDigits = value.includes('.') ? value.split('.')[1].length : 0;
  return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numberValue);
};

const toLocaleEditable = (value: string, lang: 'es' | 'en') => {
  const { decimal } = getSeparators(lang);
  return decimal === ',' ? value.replace('.', ',') : value;
};

export function FormattedNumberInput({ lang, value, onChange, className }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');

  const displayValue = useMemo(() => {
    if (isFocused) return text;
    return formatForDisplay(value, lang);
  }, [isFocused, lang, text, value]);

  useEffect(() => {
    if (!isFocused) {
      setText(formatForDisplay(value, lang));
    }
  }, [isFocused, lang, value]);

  return (
    <input
      className={className}
      inputMode="decimal"
      type="text"
      value={displayValue}
      onFocus={() => {
        setIsFocused(true);
        setText(toLocaleEditable(value, lang));
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
      onChange={(event) => {
        const nextText = event.target.value;
        setText(nextText);
        onChange(toCanonical(nextText));
      }}
    />
  );
}
