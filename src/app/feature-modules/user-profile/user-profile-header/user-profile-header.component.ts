import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { ProfileDTO } from '@app-core/app-api';
import {
  SocialsDisplay,
  UserProfileConstants,
} from '@user-profile-core/data-models';
import { retrieveUserToken } from '@user-profile-core/store';
import { UserTokenDTO } from '@user-profile-core/api';
import { profileDTOSelector } from '@app-domain/store';
import { serviceProviderSelector } from '@profile-accounts-core/store';
import { ServiceProviderDTO } from '@profile-accounts-core/api';

@Component({
  selector: 'Tsk-user-profile-header',
  templateUrl: './user-profile-header.component.html',
  styleUrls: ['./user-profile-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserProfileHeaderComponent implements OnInit, OnDestroy {
  @Output() public updateDisplay: EventEmitter<SocialsDisplay> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public socialsOptions: typeof SocialsDisplay = SocialsDisplay;
  public profileImage: string = `url(${UserProfileConstants.DEFAULT_PROFILE_IMAGE}) center center / contain no-repeat`;
  public userTokenDTO: UserTokenDTO;

  private profileDTO: ProfileDTO;
  private serviceProvider: ServiceProviderDTO;

  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private serviceProvider$: Observable<ServiceProviderDTO> = this.store.select(
    serviceProviderSelector
  );
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
        this.store.dispatch(retrieveUserToken({ profile: this.profileDTO }));
      }
    });

    this.subscriptions.add(profileDTOSub);

    const serviceProviderSub = this.serviceProvider$.subscribe(
      serviceProvider => {
        if (serviceProvider) {
          this.serviceProvider = { ...serviceProvider };
          this.userTokenDTO = this.serviceProvider as UserTokenDTO;
          this.processUserTokenDTO();
        }
      }
    );

    this.subscriptions.add(serviceProviderSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displaySocialsPanel(socialsOption: SocialsDisplay): void {
    this.updateDisplay.emit(socialsOption);
  }

  private processUserTokenDTO(): void {
    if (this.userTokenDTO?.profileImage) {
      this.profileImage = `url(${this.userTokenDTO?.profileImage}) center center / contain no-repeat`;
    }
  }
}
