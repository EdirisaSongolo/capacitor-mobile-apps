import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventLocationsComponent } from '@public-events-core/components';

describe('PublicEventLocationsComponent', () => {
  let component: PublicEventLocationsComponent;
  let fixture: ComponentFixture<PublicEventLocationsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PublicEventLocationsComponent],
    });

    fixture = TestBed.createComponent(PublicEventLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
