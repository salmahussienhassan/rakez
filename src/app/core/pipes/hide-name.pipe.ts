import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideName',
  standalone: true
})
export class HideNamePipe implements PipeTransform {
  transform(value: string): unknown {
    debugger
    const values = value.split(' ');
     const firstPart = values[0];
    let secondPart = values.slice(1).join(' ');

    secondPart = secondPart.replace(/./g, '*');

    return `${firstPart} ${secondPart}`;
  }
}
