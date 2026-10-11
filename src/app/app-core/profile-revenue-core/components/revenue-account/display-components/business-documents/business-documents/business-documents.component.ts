import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Device, Profiles } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { ProfileDTO } from '@app-core/app-api/app-api.dto-models';
import { profileDTOSelector } from '@app-domain/store';

import { RevenueAccountDTO } from '@profile-revenue-core/api';
import { revenueAccountSelector } from '@profile-revenue-core/store';

export enum DocumentPanels {
  managing_profile = 'MANAGING_PROFILE',
  id_verification = 'IDENTITY_VERIFICATION',
  business_contacts = 'BUSINESS_CONTACTS',
}

@Component({
  selector: 'Tsk-business-documents',
  templateUrl: './business-documents.component.html',
  styleUrls: ['./business-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BusinessDocumentsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public docPanelOptions: typeof DocumentPanels = DocumentPanels;
  public displayPanel: DocumentPanels = DocumentPanels.managing_profile;
  public docPanels: any[] = [];

  public revenueAccount: RevenueAccountDTO;
  private profileDTO: ProfileDTO;

  private revenueAccount$: Observable<RevenueAccountDTO> = this.store.select(
    revenueAccountSelector
  );
  private profileDTO$: Observable<ProfileDTO> =
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

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
        this.docPanels = this.setDocumentPanels(this.profileDTO);
      }
    });

    this.subscriptions.add(profileDTOSub);

    const revenueAccountSub = this.revenueAccount$.subscribe(revenueAccount => {
      if (revenueAccount?.revenueAccountId) {
        this.revenueAccount = { ...revenueAccount };
      }
    });

    this.subscriptions.add(revenueAccountSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public switchDisplayPanel(displayPanel: DocumentPanels): void {
    this.displayPanel = displayPanel;
  }

  private setDocumentPanels(profileDTO: ProfileDTO): any[] {
    const detailsHeader: string =
      profileDTO.profile === Profiles.userProfile
        ? 'profile-revenue.revenue-account.business-details.personal-details'
        : 'profile-revenue.revenue-account.business-details.managing-profile';

    const docPanels: any[] = [
      {
        icon: 'crop_free',
        display: DocumentPanels.managing_profile,
        header: detailsHeader,
      },
      {
        icon: 'crop_free',
        display: DocumentPanels.id_verification,
        header:
          'profile-revenue.revenue-account.business-details.identity-verification',
      },
    ];

    if (profileDTO.profile !== Profiles.userProfile) {
      const companyContacts = {
        icon: 'crop_free',
        display: DocumentPanels.business_contacts,
        header:
          'profile-revenue.revenue-account.business-details.company-contacts',
      };

      docPanels.push(companyContacts);
    }

    return docPanels;
  }
}
