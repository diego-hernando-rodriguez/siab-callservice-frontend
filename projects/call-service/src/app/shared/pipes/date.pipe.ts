import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '../utils/date.utils';

@Pipe({ name: 'siabDate' })
export class SiabDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    return DateUtils.formatDate(date);
  }
}

@Pipe({ name: 'siabTime' })
export class SiabTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    if (typeof value === 'string' && value.includes(':')) return value;
    const date = typeof value === 'string' ? new Date(value) : value;
    return DateUtils.formatTime(date);
  }
}
