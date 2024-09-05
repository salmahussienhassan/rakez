import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideId',
  standalone: true
})
export class HideIdPipe implements PipeTransform {
  transform(value: string): unknown {
    debugger
    const visiblePart = value.slice(6, 10);
    const hiddenPart = value.slice(4).replace(/./g, '*');
    return `${visiblePart}${hiddenPart}`;
  }
}
