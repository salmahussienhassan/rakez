import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelInfoComponent } from './travel-info.component';

describe('TravelInfoComponent', () => {
  let component: TravelInfoComponent;
  let fixture: ComponentFixture<TravelInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
