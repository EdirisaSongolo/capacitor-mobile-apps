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
import { TranslateService } from '@ngx-translate/core';

import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { LocationTokenDTO } from '@app-core/public-events-core/api';
import { PublicEventConstants } from '@app-core/public-events-core/data-models';

@Component({
  selector: 'Tsk-public-event-location-plac',
  templateUrl: './public-event-location-plac.component.html',
  styleUrls: ['./public-event-location-plac.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventLocationPlacComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() public componentAction: ComponentAction;
  @Input() public profileImage: string | File;
  @Input() public locationToken: LocationTokenDTO;
  @Output() public placAction: EventEmitter<LocationTokenDTO> =
    new EventEmitter();
  @Output() public deleteAction: EventEmitter<LocationTokenDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public actionOptions: typeof ComponentAction = ComponentAction;
  public removeIcon: string = 'remove';

  public posterImagePath: string = `${PublicEventConstants.DEFAULT_PROFILE_IMAGE} center/ contain no-repeat`;
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private translator: TranslateService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const profileImageChanges = changes['profileImage'];
    this.profileImage = profileImageChanges?.currentValue;

    if (this.profileImage) {
      this.displayPublicEventPoster();
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public emitPublicEventLocationDTO(): void {
    this.placAction.emit(this.locationToken);
  }

  public initiateDeleteAction(): void {
    this.deleteAction.emit(this.locationToken);
  }

  private displayPublicEventPoster(): void {
    if (this.profileImage) {
      const posterImage = this.profileImage;

      if (typeof posterImage === 'object') {
        const reader = new FileReader();
        reader.onload = file => {
          const posterImage = file.target.result as string;
          this.posterImagePath = `url(${posterImage}) center/ contain no-repeat`;
        };
        reader.readAsDataURL(posterImage as File);
      } else {
        const imagePath: string = this.profileImage as string;
        this.posterImagePath = `url(${imagePath}) center/ contain no-repeat`;
      }
    }
  }
}
