import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DialogAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'Tsk-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  @Input() public confirmationMessage: string;
  @ViewChild('dialog_selector')
  public servicesDialog!: ElementRef<HTMLDivElement>;
  @Output() public dialogAction: EventEmitter<DialogAction> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public remove: string = 'remove';
  public actionOptions: typeof DialogAction = DialogAction;

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

  public componentClickEvent(event: MouseEvent): void {
    const dialogClicked = this.servicesDialog?.nativeElement.contains(
      event.target as Node
    );

    if (!dialogClicked) {
      this.dialogAction.emit(this.actionOptions.cancelled);
    }
  }

  public dialogClickEvent(event: MouseEvent): void {
    event.stopPropagation();
  }

  public closeDialog(): void {
    this.dialogAction.emit(this.actionOptions.cancelled);
  }

  public propagateDeleteAction(): void {
    this.dialogAction.emit(this.actionOptions.confirmed);
  }
}
