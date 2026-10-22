import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditGatePersonelComponent } from './create-edit-gate-personel.component';

describe('CreateEditGatePersonelComponent', () => {
  let component: CreateEditGatePersonelComponent;
  let fixture: ComponentFixture<CreateEditGatePersonelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateEditGatePersonelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditGatePersonelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
