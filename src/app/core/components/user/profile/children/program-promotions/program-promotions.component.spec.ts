import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramPromotionsComponent } from './program-promotions.component';

describe('ProgramPromotionsComponent', () => {
  let component: ProgramPromotionsComponent;
  let fixture: ComponentFixture<ProgramPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramPromotionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
