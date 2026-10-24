import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatePersonelComponent } from './gate-personel.component';

describe('GatePersonelComponent', () => {
  let component: GatePersonelComponent;
  let fixture: ComponentFixture<GatePersonelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatePersonelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GatePersonelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
