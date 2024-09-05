import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedQuestionsComponent } from './recommended-questions.component';

describe('RecommendedQuestionsComponent', () => {
  let component: RecommendedQuestionsComponent;
  let fixture: ComponentFixture<RecommendedQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedQuestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecommendedQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
