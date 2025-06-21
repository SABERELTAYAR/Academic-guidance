import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDataMainComponent } from './student-data-main.component';

describe('StudentDataMainComponent', () => {
  let component: StudentDataMainComponent;
  let fixture: ComponentFixture<StudentDataMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDataMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDataMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
