import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { ProfileMediaFileDTO } from '@media-core/api';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'Tsk-media-file-plac',
  templateUrl: './media-file-plac.component.html',
  styleUrls: ['./media-file-plac.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MediaFilePlacComponent implements OnInit, OnDestroy {
  @Input() public componentAction: ComponentAction;
  @Input() public mediaFile: ProfileMediaFileDTO;
  @Output() public placAction: EventEmitter<ProfileMediaFileDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public selected: boolean = false;

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();
  constructor(private breakPoint: BreakPointService) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public emitMediaFileDTO(mediaFile: ProfileMediaFileDTO): void {
    if (
      this.componentAction &&
      this.componentAction === ComponentAction.dashboard
    ) {
      this.selected = !this.selected;
    }

    this.placAction.emit(mediaFile);
  }
}
