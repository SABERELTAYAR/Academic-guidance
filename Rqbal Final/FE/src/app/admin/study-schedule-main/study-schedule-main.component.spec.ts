import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyScheduleMainComponent } from './study-schedule-main.component';

describe('StudyScheduleMainComponent', () => {
  let component: StudyScheduleMainComponent;
  let fixture: ComponentFixture<StudyScheduleMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyScheduleMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyScheduleMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
