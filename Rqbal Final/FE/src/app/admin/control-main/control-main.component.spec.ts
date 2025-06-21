import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlMainComponent } from './control-main.component';

describe('ControlMainComponent', () => {
  let component: ControlMainComponent;
  let fixture: ComponentFixture<ControlMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
