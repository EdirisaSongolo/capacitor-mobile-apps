import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';
import { DialogAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { Store } from '@ngrx/store';
import { cancelPrivateEvent } from '@private-events-core/store/create-edit-event';

import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'Tsk-cancel-private-event',
  templateUrl: './cancel-private-event.component.html',
  styleUrls: ['./cancel-private-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CancelPrivateEventComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public confirmationDialog: boolean = false;
  public cancelConfirmation: string =
    'private-event-dashboard.confirm-delete-action';
  private profileDTO: ProfileDTO;

  private profileDTo$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileDTOSub = this.profileDTo$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
      }
    });

    this.subscriptions.add(profileDTOSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayConfirmationDialog(): void {
    this.confirmationDialog = true;
  }

  public cancelDialogAction(dialogAction: DialogAction): void {
    if (dialogAction === DialogAction.confirmed) {
      this.store.dispatch(cancelPrivateEvent({ profileDTO: this.profileDTO }));
    }

    this.confirmationDialog = false;
  }
}
