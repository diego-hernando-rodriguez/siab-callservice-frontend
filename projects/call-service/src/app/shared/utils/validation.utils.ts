import { DateUtils } from './date.utils';

/**
 * Validation utilities matching Oracle Forms dato_valido_causa.
 */
export class ValidationUtils {
  static isValidByType(value: string, tipoDato: string): boolean {
    if (!value || !tipoDato) return true;
    switch (tipoDato.toUpperCase()) {
      case 'HORA': return DateUtils.isValidTime(value);
      case 'FECHA': return DateUtils.isValidDate(value);
      case 'NUMERO': return !isNaN(Number(value));
      case 'ALFANUMERICO': return true;
      default: return true;
    }
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  static isRequiredFilled(value: string | undefined | null): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
  }
}
