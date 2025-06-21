import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSupervisionComponent } from './system-supervision.component';

describe('SystemSupervisionComponent', () => {
  let component: SystemSupervisionComponent;
  let fixture: ComponentFixture<SystemSupervisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemSupervisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemSupervisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
