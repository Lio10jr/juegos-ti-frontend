import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGenCampeonatoComponent } from './admin-gen-campeonato.component';

describe('AdminGenCampeonatoComponent', () => {
  let component: AdminGenCampeonatoComponent;
  let fixture: ComponentFixture<AdminGenCampeonatoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminGenCampeonatoComponent]
    });
    fixture = TestBed.createComponent(AdminGenCampeonatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
