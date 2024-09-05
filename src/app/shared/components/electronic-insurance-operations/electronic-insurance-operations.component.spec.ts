import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicInsuranceOperationsComponent } from './electronic-insurance-operations.component';

describe('ElectronicInsuranceOperationsComponent', () => {
  let component: ElectronicInsuranceOperationsComponent;
  let fixture: ComponentFixture<ElectronicInsuranceOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectronicInsuranceOperationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElectronicInsuranceOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
