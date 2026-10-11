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

import { VendorManagerDTO } from '@vendors-core/api';

import { UserTokenDTO } from '@user-profile-core/api';
import {
  createVendorProfileManager,
  removeVendorProfileManagers,
  retrieveVendorProfileManagers,
  vendorProfileManagersSelector,
} from '@vendors-core/store';

import { ProfileDTO } from '@app-core/app-api';

@Component({
  selector: 'Tsk-vendor-profile-managers',
  templateUrl: './vendor-profile-manager.component.html',
  styleUrls: ['./vendor-profile-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VendorProfileManagementComponent implements OnInit, OnDestroy {
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

  public vendorManagement: VendorManagerDTO[] = [];
  public selectedProfiles: UserTokenDTO[] = [];

  private profileDTO: ProfileDTO;

  private vendorManagement$: Observable<VendorManagerDTO[]> = this.store.select(
    vendorProfileManagersSelector
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
          retrieveVendorProfileManagers({ profile: this.profileDTO })
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

    const venueManagementSub = this.vendorManagement$.subscribe(
      vendorManagement => {
        if (vendorManagement !== null) {
          this.vendorManagement = [...vendorManagement];
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
      this.selectedProfiles = [];
    } else if (this.managementDisplay === this.displayOptions.socialsList) {
      this.managementDisplay = this.displayOptions.managementList;
      this.controlIcon = 'add';
      this.selectedProfiles = [];
    }
  }

  public createVendorManager(userTokenDTO: UserTokenDTO): void {
    const duplicateProfile: boolean = this.vendorManagement.some(
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

    const vendorManager: VendorManagerDTO = {
      vendorProfileId: this.profileDTO.profileId,
      manager: userTokenDTO,
      managerStatus: RequestStatus.pending,
    };

    this.store.dispatch(
      createVendorProfileManager({ vendorManager: vendorManager })
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
    const vendorManagement: VendorManagerDTO[] = [];

    if (this.selectedProfiles.length >= this.vendorManagement.length) {
      const messages: string[] = [
        'vendors-dashboard.errors.delete-all-managers',
      ];
      this.appResponseService.createAppResponse(
        AppResponseType.error,
        messages
      );
      return;
    }

    this.selectedProfiles.forEach(userProfile => {
      const managerProfile = this.vendorManagement.find(
        managerDTO =>
          managerDTO.manager.userProfileId === userProfile.userProfileId
      );
      vendorManagement.push(managerProfile);
    });

    this.store.dispatch(
      removeVendorProfileManagers({ vendorManagers: vendorManagement })
    );

    //If user removes own profile, navigate to venues list comp
  }
}
