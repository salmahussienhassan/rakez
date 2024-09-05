import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritysettingsComponent } from './security-settings.component';

describe('SecuritysettingsComponent', () => {
  let component: SecuritysettingsComponent;
  let fixture: ComponentFixture<SecuritysettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuritysettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecuritysettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
