import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicTablesComponent } from './academic-tables.component';

describe('AcademicTablesComponent', () => {
  let component: AcademicTablesComponent;
  let fixture: ComponentFixture<AcademicTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
