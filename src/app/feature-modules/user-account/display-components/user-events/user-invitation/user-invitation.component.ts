import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import {
  Device,
  Profiles,
  UserEventAccess,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService, DateTimeService } from '@domain-services/index';

import {
  retrieveUserInvitation,
  updateInvitationStatus,
  userInvitationSelector,
} from '@private-events-core/store';
import { InvitationDTO, InviteResponseDTO } from '@private-events-core/api';
import { ProfileDTO } from '@app-core/app-api';
import { ProfileMediaFileDTO } from '@media-core/api';
import { UserTokenDTO } from '@user-profile-core/api';
import { ActivatedRoute } from '@angular/router';
import { UserAccountRoutes } from '@user-profile-core/data-models';

@Component({
  selector: 'Tsk-user-invitation',
  templateUrl: './user-invitation.component.html',
  styleUrls: ['./user-invitation.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserInvitationComponent implements OnInit, OnDestroy {
  @Input() public profileDTO: ProfileDTO;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public eventName: string;
  public eventTime: string;
  public eventDate: string;
  public venueAddress: string;
  public userInvitation: string;

  public eventHost: boolean = false;
  public hostUserToken: UserTokenDTO;
  public mediaFileList: ProfileMediaFileDTO[] = [];
  public responseOptions: typeof UserEventAccess = UserEventAccess;

  private invitationDTO: InvitationDTO;

  public userInvitation$: Observable<InvitationDTO> = this.store.select(
    userInvitationSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private dateTimeService: DateTimeService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const routerParamSub = this.activatedRoute.paramMap.subscribe(
      parameters => {
        const privateEventId = parameters.get(UserAccountRoutes.EVENT_ID);
        this.profileDTO = {
          profile: Profiles.publicEventProfile,
          profileId: privateEventId,
        };

        this.store.dispatch(
          retrieveUserInvitation({ profileDTO: this.profileDTO })
        );
      }
    );

    this.subscriptions.add(routerParamSub);

    const userInvitationSub = this.userInvitation$.subscribe(invitation => {
      if (invitation) {
        this.invitationDTO = { ...invitation };
        this.processUserInvitation(this.invitationDTO);
      }
    });

    this.subscriptions.add(userInvitationSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public invitationResponse(reponse: UserEventAccess): void {
    const inviteResponse: InviteResponseDTO = {
      invitationId: this.invitationDTO.guestId,
      response: reponse,
    };

    this.store.dispatch(
      updateInvitationStatus({
        inviteResponse: inviteResponse,
        profileDTO: this.profileDTO,
      })
    );
  }

  private processUserInvitation(userInvitation: InvitationDTO): void {
    const privateEventToken = userInvitation.privateEventToken;

    const eventHost = privateEventToken.eventHost;
    if (eventHost) {
      this.eventHost = true;
      this.hostUserToken = eventHost;
    }

    this.eventDate = this.dateTimeService.processApiDateResponse(
      privateEventToken.eventDate
    );

    this.eventTime = this.dateTimeService.processApiTimeRangeResponse(
      privateEventToken.startTime,
      privateEventToken.endTime
    );

    this.eventName = privateEventToken.eventName;
    this.userInvitation = privateEventToken.eventInvitation;
    this.mediaFileList = userInvitation.inviteMedia;
  }
}
