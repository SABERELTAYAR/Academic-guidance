import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDataNavComponent } from './student-data-nav.component';

describe('StudentDataNavComponent', () => {
  let component: StudentDataNavComponent;
  let fixture: ComponentFixture<StudentDataNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDataNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDataNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
