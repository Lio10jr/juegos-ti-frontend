import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEncuentrosComponent } from './admin-encuentros.component';

describe('AdminEncuentrosComponent', () => {
  let component: AdminEncuentrosComponent;
  let fixture: ComponentFixture<AdminEncuentrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminEncuentrosComponent]
    });
    fixture = TestBed.createComponent(AdminEncuentrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
