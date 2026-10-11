import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { BreakPointService } from '@domain-services/break-point/break-point.service';
import {
  AppResponseType,
  ComponentAction,
  DialogAction,
  Device,
  ManagementDisplay,
  RequestStatus,
} from '@domain-data-models/app-domain.enums';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { componentActionSelector, profileDTOSelector } from '@app-domain/store';
import { ProfileDTO } from '@app-core/app-api';
import { VenueManagerDTO } from '@venues-core/api';
import {
  createVenueProfileManager,
  removeVenueProfileManagers,
  retrieveVenueProfileManagers,
  venueProfileManagementSelector,
} from '@venues-core/store';
import { UserTokenDTO } from '@user-profile-core/api';

@Component({
  selector: 'Tsk-venue-profile-managers',
  templateUrl: './venue-profile-managers.component.html',
  styleUrls: ['./venue-profile-managers.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VenueProfileManagementComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction;
  public actionsOptions: typeof ComponentAction = ComponentAction;

  public managementDisplay: string = ManagementDisplay.managementList;
  public displayOptions: typeof ManagementDisplay = ManagementDisplay;

  public controlIcon: string =
    this.managementDisplay === ManagementDisplay.managementList
      ? 'add'
      : 'filter_list';
  public deleteIcon: string = 'remove';

  public confirmationDialog: boolean = false;
  public deleteConfirmation = 'venues-dashboard.managers.confirm-delete-action';

  public venueManagement: VenueManagerDTO[] = [];
  public selectedProfiles: UserTokenDTO[] = [];

  private profileDTO: ProfileDTO;

  private venueManagement$: Observable<VenueManagerDTO[]> = this.store.select(
    venueProfileManagementSelector
  );
  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private componentAction$: Observable<ComponentAction> = this.store.select(
    componentActionSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
        this.store.dispatch(
          retrieveVenueProfileManagers({ profile: this.profileDTO })
        );
      }
    });

    this.subscriptions.add(profileDTOSub);

    const componentActionSub = this.componentAction$.subscribe(
      componentAction => {
        if (componentAction) {
          this.componentAction = componentAction;
        }
      }
    );

    this.subscriptions.add(componentActionSub);

    const venueManagementSub = this.venueManagement$.subscribe(
      venuemanagement => {
        if (venuemanagement !== null) {
          this.venueManagement = [...venuemanagement];
        }
      }
    );

    this.subscriptions.add(venueManagementSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public updateDisplayPanel(): void {
    if (this.managementDisplay === this.displayOptions.managementList) {
      this.managementDisplay = this.displayOptions.socialsList;
      this.controlIcon = 'filter_list';
    } else if (this.managementDisplay === this.displayOptions.socialsList) {
      this.managementDisplay = this.displayOptions.managementList;
      this.controlIcon = 'add';
    }

    this.selectedProfiles = [];
  }

  public createVenueManager(userTokenDTO: UserTokenDTO): void {
    const duplicateProfile: boolean = this.venueManagement.some(
      managerDTO =>
        managerDTO.manager.userProfileId === userTokenDTO.userProfileId
    );

    if (duplicateProfile) {
      const messages: string[] = ['venues-dashboard.errors.duplicate-manager'];

      this.appResponseService.createAppResponse(
        AppResponseType.error,
        messages
      );
      return;
    }

    const venueManager: VenueManagerDTO = {
      venueProfileId: this.profileDTO.profileId,
      manager: userTokenDTO,
      managerStatus: RequestStatus.pending,
    };

    this.store.dispatch(
      createVenueProfileManager({ venueManager: venueManager })
    );

    this.updateDisplayPanel();
  }

  public updateSelectedProfiles(userProfile: UserTokenDTO): void {
    if (!this.selectedProfiles.includes(userProfile)) {
      this.selectedProfiles.push(userProfile);
    } else {
      const profileIndex = this.selectedProfiles.findIndex(
        profile => profile.userProfileId === userProfile.userProfileId
      );
      this.selectedProfiles.splice(profileIndex, 1);
    }
  }

  public deleteSelectedManagers(): void {
    this.confirmationDialog = true;
  }

  public propateDialogAction(dialogAction: DialogAction): void {
    if (dialogAction === DialogAction.cancelled) {
      this.confirmationDialog = false;
    } else if (dialogAction === DialogAction.confirmed) {
      this.removeSelectedManagers();
      this.confirmationDialog = false;
    }
  }

  public removeSelectedManagers(): void {
    const venueManagement: VenueManagerDTO[] = [];

    if (this.selectedProfiles.length >= this.venueManagement.length) {
      const messages: string[] = [
        'venues-dashboard.errors.delete-all-managers',
      ];

      this.appResponseService.createAppResponse(
        AppResponseType.error,
        messages
      );
      return;
    }

    this.selectedProfiles.forEach(userProfile => {
      const managerProfile = this.venueManagement.find(
        managerDTO =>
          managerDTO.manager.userProfileId !== userProfile.userProfileId
      );
      venueManagement.push(managerProfile);
    });

    this.store.dispatch(
      removeVenueProfileManagers({ venueManagers: venueManagement })
    );

    this.selectedProfiles = [];
    this.updateDisplayPanel();

    //If user removes own profile, navigate to venues list comp
  }
}
