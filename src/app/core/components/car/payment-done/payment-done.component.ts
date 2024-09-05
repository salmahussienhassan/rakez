import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-done',
  standalone: true,
  imports: [RouterLink,TranslateModule],
  templateUrl: './payment-done.component.html',
  styleUrl: './payment-done.component.css'
})
export class PaymentDoneComponent {

}
