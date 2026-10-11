import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { UserTokenDTO } from '@user-profile-core/api';
import {
  UserProfileConstants,
  UserProfileRoutes,
} from '@user-profile-core/data-models';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { userProfileInfoSelector } from '@core-modules';
import { ProviderPlacDetails } from '@profile-accounts-core/data-models';
import { ProfileProcessorService } from '@profile-accounts-core/services/profile-processors/profile-processor.service';

@Component({
  selector: 'Tsk-user-profile-plac',
  templateUrl: './user-profile-plac.component.html',
  styleUrls: ['./user-profile-plac.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserProfilePlacComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public componentAction: ComponentAction;
  @Input() public userTokenDTO: UserTokenDTO;
  @Output() public placAction: EventEmitter<UserTokenDTO | any> =
    new EventEmitter();
  @Output() public removeAction: EventEmitter<UserTokenDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public actionOptions: typeof ComponentAction = ComponentAction;

  public actionable: boolean = true;
  public displayOptions: boolean = false;

  public optionControl: string = 'more_vert';
  public removeIcon: string = 'remove';

  public userProfileImage: string = `url(${UserProfileConstants.DEFAULT_PROFILE_IMAGE}) center center / contain no-repeat`;
  public userName: string;
  public providerPlacDetails: ProviderPlacDetails | null = null;

  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private router: Router,
    private store: Store,
    private profileProcessor: ProfileProcessorService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => {
        const userProfileId = userProfileInfo?.userProfileId;
        if (
          userProfileId &&
          userProfileId === this.userTokenDTO?.userProfileId
        ) {
          this.actionable = false;
        }
      }
    );

    this.subscriptions.add(userProfileInfoSub);

    this.processUserData();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const userTokenDTOChanges = changes['userTokenDTO'];
    this.userTokenDTO = userTokenDTOChanges?.currentValue;
    if (this.userTokenDTO) {
      this.processUserData();
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public toggleOptions(): void {
    this.displayOptions = !this.displayOptions;
  }

  public processPlacAction(): void {
    if (!this.actionable) return;

    if (
      this.componentAction === ComponentAction.dashboard ||
      this.componentAction === ComponentAction.event_management
    ) {
      this.displayOptions = false;
      this.placAction.emit(this.userTokenDTO);
      return;
    }

    this.router.navigate([
      UserProfileRoutes.USER_PROFILE,
      this.userTokenDTO.userProfileId,
    ]);
  }

  public emitRemoveAction() {
    this.removeAction.emit(this.userTokenDTO);
  }

  private processUserData(): void {
    if (this.userTokenDTO.profileImage !== null) {
      const imagePath = this.userTokenDTO.profileImage;
      this.userProfileImage = `url(${imagePath}) center center / contain no-repeat`;
    }

    this.userName = this.userTokenDTO.userName;

    const providerPlacDetails =
      this.profileProcessor.processProviderPlacDetails(this.userTokenDTO);
    this.providerPlacDetails = providerPlacDetails;
  }
}
