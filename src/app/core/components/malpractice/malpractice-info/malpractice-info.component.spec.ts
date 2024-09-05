import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalpracticeInfoComponent } from './malpractice-info.component';

describe('MalpracticeInfoComponent', () => {
  let component: MalpracticeInfoComponent;
  let fixture: ComponentFixture<MalpracticeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MalpracticeInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MalpracticeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
