import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enToArCarNumber',
  standalone: true
})
export class EnToArCarNumberPipe implements PipeTransform {
 
  private englishToArabicMap: { [key: string]: string } = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩'
  };
  transform(value: string | number): string {
    if (typeof value === 'number') {
      value = value.toString();
    }

    return value.split('').map(char => this.englishToArabicMap[char] || char).join('');
  }

}
