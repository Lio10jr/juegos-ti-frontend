import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTablaPosicionesComponent } from './admin-tabla-posiciones.component';

describe('AdminTablaPosicionesComponent', () => {
  let component: AdminTablaPosicionesComponent;
  let fixture: ComponentFixture<AdminTablaPosicionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTablaPosicionesComponent]
    });
    fixture = TestBed.createComponent(AdminTablaPosicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
