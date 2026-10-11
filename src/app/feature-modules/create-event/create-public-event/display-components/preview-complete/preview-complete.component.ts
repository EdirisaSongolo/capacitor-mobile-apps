import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  AppResponseType,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';

import {
  CreateEventLocationDTO,
  CreatePublicEvent,
  CreatePublicEventDTO,
  PublicEventTokenDTO,
  PublicEventLocationDTO,
  PublicEventPrincipalDTO,
} from '@public-events-core/api';

import { createEditPublicEventFeature } from '@public-events-core/store/create-edit-event/create-edit-event.selectors';

import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { CreatePublicEventStore } from '@public-events-core/store/create-edit-event/constants';
import { createPublicEventProfile } from '@public-events-core/store';
import { ProfileImageService } from '@media-core/services/profile-image/profile-image.service';
import { ProfileDTO } from '@app-core/app-api';
import { PublicEventMappersService } from '@public-events-core/services';

@Component({
  selector: 'Tsk-preview-complete',
  templateUrl: './preview-complete.component.html',
  styleUrls: ['./preview-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PreviewCompleteComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public publicEventToken: PublicEventTokenDTO;

  private profileImage: string | File;
  private eventMedia: File[] = [];
  private createPublicEventDTO: CreatePublicEventDTO = {
    eventName: null,
    eventCategory: null,
    eventDescription: null,
    eventPrincipal: null,
    eventLocations: [],
  };

  private createPublicEvent$: Observable<CreatePublicEventStore> =
    this.store.select(createEditPublicEventFeature);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private appResponse: AppResponseService,
    private publicEventMapper: PublicEventMappersService,
    private profileImageService: ProfileImageService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const createPublicEventSub = this.createPublicEvent$.subscribe(
      createPublicEvent => {
        this.publicEventToken =
          this.publicEventMapper.createEventTokenDTOMapper(createPublicEvent);

        this.profileImage = createPublicEvent.profileImage;
        if (this.profileImage) {
          this.profileImageService
            .readProfileImageFile(this.profileImage as File)
            .then(profileImageUrl => {
              this.publicEventToken = {
                ...this.publicEventToken,
                profileImage: profileImageUrl,
              };
            });
        }

        this.eventMedia = createPublicEvent.eventMedia as File[];
        this.createPublicEventDTO = {
          eventName: createPublicEvent.eventName,
          eventCategory: createPublicEvent.eventCategory,
          eventDescription: createPublicEvent.eventDescription,
          eventPrincipal: null,
          eventLocations: [],
        };

        this.mapProfilesToCreationDTOs(
          createPublicEvent.eventPrincipal,
          createPublicEvent.eventLocations
        );
      }
    );

    this.subscriptions.add(createPublicEventSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public submitPublicEvent(): void {
    if (
      !this.createPublicEventDTO.eventName?.trim() ||
      !this.createPublicEventDTO.eventDescription?.trim() ||
      !this.profileImage ||
      !this.createPublicEventDTO.eventCategory ||
      !this.createPublicEventDTO.eventPrincipal ||
      this.createPublicEventDTO.eventLocations.length == 0
    ) {
      this.appResponse.createAppResponse(AppResponseType.warning, [
        'create-event.public-event.notifications.invalid-public-event',
      ]);
      return;
    }

    const createPublicEventDTO: CreatePublicEvent = {
      eventPoster: this.profileImage as File,
      eventMedia: this.eventMedia,
      publicEvent: this.createPublicEventDTO,
    };

    this.store.dispatch(
      createPublicEventProfile({ createPublicEvent: createPublicEventDTO })
    );
  }

  private mapProfilesToCreationDTOs(
    principal: PublicEventPrincipalDTO,
    locations: PublicEventLocationDTO[]
  ): void {
    if (!principal || !locations) {
      return;
    }

    const principalDTO: ProfileDTO = {
      profile: Profiles.vendorProfile,
      profileId: principal.principalProfile.vendorProfileId,
    };
    this.createPublicEventDTO.eventPrincipal = principalDTO;

    const createLocationDTOs: CreateEventLocationDTO[] = locations.flatMap(
      location => this.publicEventMapper.createEventLocationDTOMapper(location)
    );
    this.createPublicEventDTO.eventLocations = createLocationDTOs;
  }
}
