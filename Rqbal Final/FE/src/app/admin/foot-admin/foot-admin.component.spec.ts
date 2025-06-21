import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootAdminComponent } from './foot-admin.component';

describe('FootAdminComponent', () => {
  let component: FootAdminComponent;
  let fixture: ComponentFixture<FootAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
