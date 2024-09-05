import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarProfileComponent } from './progress-bar-profile.component';

describe('ProgressBarProfileComponent', () => {
  let component: ProgressBarProfileComponent;
  let fixture: ComponentFixture<ProgressBarProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgressBarProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
