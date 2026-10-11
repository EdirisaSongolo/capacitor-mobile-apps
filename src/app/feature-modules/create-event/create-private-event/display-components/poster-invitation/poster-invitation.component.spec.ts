import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PosterInvitationComponent } from './poster-invitation.component';

describe('PosterInvitationComponent', () => {
  let component: PosterInvitationComponent;
  let fixture: ComponentFixture<PosterInvitationComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PosterInvitationComponent] });

    fixture = TestBed.createComponent(PosterInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
