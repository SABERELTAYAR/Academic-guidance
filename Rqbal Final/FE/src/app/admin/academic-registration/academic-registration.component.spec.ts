import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicRegistrationComponent } from './academic-registration.component';

describe('AcademicRegistrationComponent', () => {
  let component: AcademicRegistrationComponent;
  let fixture: ComponentFixture<AcademicRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
