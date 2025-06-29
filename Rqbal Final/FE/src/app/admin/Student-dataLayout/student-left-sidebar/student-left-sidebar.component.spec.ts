import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLeftSidebarComponent } from './student-left-sidebar.component';

describe('StudentLeftSidebarComponent', () => {
  let component: StudentLeftSidebarComponent;
  let fixture: ComponentFixture<StudentLeftSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentLeftSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentLeftSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
