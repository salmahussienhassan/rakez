import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCreditCard]',
  standalone: true
})
export class CreditCardDirective {

  constructor(private el: ElementRef) { }
  @HostListener('input')
  onInputChange(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    let trimmed = input.value.replace(/\s+/g, '');
    if (trimmed.length > 16) {
      trimmed = trimmed.substr(0, 16);
    }

    let numbers = [];
    for (let i = 0; i < trimmed.length; i += 4) {
      numbers.push(trimmed.substr(i, 4));
    }

    input.value = numbers.join(' ');
  }
    @HostListener('blur')
    onBlur(): void {
      const input = this.el.nativeElement as HTMLInputElement;
      input.value = input.value.replace(/\s+/g, '');
    }
}
