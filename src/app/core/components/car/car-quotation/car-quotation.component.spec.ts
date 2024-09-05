import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarQuotationComponent } from './car-quotation.component';

describe('CarQuotationComponent', () => {
  let component: CarQuotationComponent;
  let fixture: ComponentFixture<CarQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarQuotationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
