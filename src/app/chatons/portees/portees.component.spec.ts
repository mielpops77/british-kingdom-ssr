import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorteesComponent } from './portees.component';

describe('PorteesComponent', () => {
  let component: PorteesComponent;
  let fixture: ComponentFixture<PorteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PorteesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PorteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
