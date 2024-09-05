import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appTicketStatus]',
  standalone: true
})
export class TicketStatusDirective {
  @Input() status = 0;
  constructor(private el: ElementRef) { }
  ngOnInit(): void {
    if(this.status === 0){
      this.el.nativeElement.style.color = '#96038C';
      this.el.nativeElement.style.background = '#FAEFF9';
    }
    else if(this.status === 1){
      this.el.nativeElement.style.color ='#027A48';
      this.el.nativeElement.style.background = '#ECFDF3';
    }
    else if(this.status === 2){
      this.el.nativeElement.style.color = '#344054';
      this.el.nativeElement.style.background = '#F2F4F7';
    }
  }

}
