import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarCheckoutComponent } from './car-checkout.component';

describe('CarCheckoutComponent', () => {
  let component: CarCheckoutComponent;
  let fixture: ComponentFixture<CarCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarCheckoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
