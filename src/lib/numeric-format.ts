export function getNumberSymbols(locale: string) {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const group = parts.find((part) => part.type === 'group')?.value ?? ',';
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.';

  return { group, decimal };
}

export function sanitizeNumericInput(value: string, locale: string) {
  const { group, decimal } = getNumberSymbols(locale);

  const withoutGroup = value
    .replaceAll(group, '')
    .replaceAll('\u00A0', '')
    .replaceAll(' ', '')
    .replaceAll(decimal, '.');

  return withoutGroup.replace(/[^\d.-]/g, '');
}

export function formatNumericInput(value: string, locale: string) {
  if (!value) return '';

  const { decimal } = getNumberSymbols(locale);
  const hasTrailingDot = value.endsWith('.');
  const [integerPartRaw, fractionalPart = ''] = value.split('.');
  const isNegative = integerPartRaw.startsWith('-');
  const integerDigits = integerPartRaw.replace('-', '').replace(/^0+(?=\d)/, '');
  const normalizedInteger = integerDigits || '0';

  const formattedInteger = new Intl.NumberFormat(locale).format(Number(normalizedInteger));
  const signedInteger = isNegative ? `-${formattedInteger}` : formattedInteger;

  if (hasTrailingDot) {
    return `${signedInteger}${decimal}`;
  }

  if (fractionalPart) {
    return `${signedInteger}${decimal}${fractionalPart}`;
  }

  return signedInteger;
}
