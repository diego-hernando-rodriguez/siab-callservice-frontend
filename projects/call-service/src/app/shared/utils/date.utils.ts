/**
 * Date utilities matching Oracle Forms date/time formatting.
 */
export class DateUtils {
  /** Format date as dd/mm/yyyy */
  static formatDate(date: Date): string {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /** Format time as HH24:MI */
  static formatTime(date: Date): string {
    if (!date) return '';
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  /** Validate date format dd/mm/yyyy */
  static isValidDate(value: string): boolean {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
  }

  /** Validate time format HH24:MI */
  static isValidTime(value: string): boolean {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
  }

  /** Parse dd/mm/yyyy string to Date */
  static parseDate(value: string): Date | null {
    if (!DateUtils.isValidDate(value)) return null;
    const [day, month, year] = value.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
}
