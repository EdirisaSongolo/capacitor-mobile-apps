import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { Device, AppResponseType } from '@domain-data-models/app-domain.enums';
import {
  PublicEventCategories,
  PublicEventCategoriesList,
} from '@public-events-core/data-models';
import { PublicEventTokenDTO } from '@public-events-core/api';
import { BreakPointService } from '@domain-services/index';
import {
  publicEventProfileImageSelector,
  eventCategorySelector,
  eventNameSelector,
  createEditPublicEventFeature,
} from '@public-events-core/store/create-edit-event/create-edit-event.selectors';
import {
  setPublicEventCategory,
  setPublicEventName,
  setPublicEventProfileImage,
} from '@public-events-core/store/create-edit-event/create-edit-event.actions';
import { FilePickerService, ProfileImageService } from '@media-core/services';
import { MediaDesignation } from '@media-core/data-models';
import { CreatePublicEventStore } from '@public-events-core/store/create-edit-event/constants';
import { PublicEventMappersService } from '@public-events-core/services';

const selectCategory = 'select_category';

@Component({
  selector: 'Tsk-category-name',
  templateUrl: './category-name.component.html',
  styleUrls: ['./category-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CategoryNameComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileImage: File;
  public publicEventToken: PublicEventTokenDTO = {} as PublicEventTokenDTO;

  public publicEventCategories: string[][] = [];
  public publicEventName: string | null = null;
  public publicEventCategory: string | null = selectCategory;

  public nameForm = this.formBuilder.group({ eventName: [''] });

  private publicEventCategory$: Observable<string> = this.store.select(
    eventCategorySelector
  );
  private profileImage$: Observable<string | File> = this.store.select(
    publicEventProfileImageSelector
  );
  private publicEventName$: Observable<string> =
    this.store.select(eventNameSelector);

  private createPublicEvent$: Observable<CreatePublicEventStore> =
    this.store.select(createEditPublicEventFeature);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private formBuilder: FormBuilder,
    private store: Store<any>,
    private appResponseService: AppResponseService,
    private publicEventMapper: PublicEventMappersService,
    private profileImageService: ProfileImageService,
    private filePickerService: FilePickerService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const categories_list: string[][] = Object.entries(
      PublicEventCategoriesList
    );
    this.publicEventCategories = [
      [selectCategory, 'create-event.public-event.select-category'],
      ...categories_list,
    ];

    this.nameForm.get('eventName')?.valueChanges.subscribe(eventName => {
      this.store.dispatch(setPublicEventName({ eventName: eventName }));
    });

    const createPublicEventSub = this.createPublicEvent$.subscribe(
      createPublicEvent => {
        const publicEventLocation = createPublicEvent.eventLocations[0];
        if (publicEventLocation) {
          const tokenLocationDate =
            this.publicEventMapper.createTokenLocationDate(publicEventLocation);
          this.publicEventToken = {
            ...this.publicEventToken,
            tokenLocationDate: tokenLocationDate,
          };
        }
      }
    );

    this.subscriptions.add(createPublicEventSub);

    const eventCategorySub = this.publicEventCategory$.subscribe(
      eventCategory => {
        if (eventCategory) {
          Object.entries(PublicEventCategories).forEach(([key, value]) => {
            if (value === eventCategory) {
              this.publicEventCategory = key;
              this.publicEventToken = {
                ...this.publicEventToken,
                eventCategory: value,
              };
            }
          });
        }
      }
    );

    this.subscriptions.add(eventCategorySub);

    const eventNameSub = this.publicEventName$.subscribe(eventName => {
      if (eventName !== null) {
        this.nameForm.get('eventName')?.setValue(eventName);
        this.publicEventToken = {
          ...this.publicEventToken,
          eventName: eventName,
        };
      }
    });

    this.subscriptions.add(eventNameSub);

    const profileImageSub = this.profileImage$.subscribe(profileImage => {
      if (profileImage) {
        this.profileImage = profileImage as File;
        this.profileImageService
          .readProfileImageFile(this.profileImage)
          .then(profileImageUrl => {
            this.publicEventToken = {
              ...this.publicEventToken,
              profileImage: profileImageUrl,
            };
          })
          .catch(error =>
            this.appResponseService.createAppResponse(AppResponseType.warning, [
              error,
            ])
          );
      }
    });

    this.subscriptions.add(profileImageSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public eventCategorySelection(category: string): void {
    const eventCategory =
      PublicEventCategories[category as keyof typeof PublicEventCategories];
    this.store.dispatch(
      setPublicEventCategory({ eventCategory: eventCategory })
    );
  }

  public async uploadPublicEventPoster(): Promise<void> {
    const [profileImage] = await this.filePickerService.selectImageFiles(
      MediaDesignation.profile_image
    );
    if (!profileImage) {
      return;
    }

    this.store.dispatch(
      setPublicEventProfileImage({ profileImage: profileImage })
    );
  }
}
