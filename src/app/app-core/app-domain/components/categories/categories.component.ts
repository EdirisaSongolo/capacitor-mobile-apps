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
import { Device } from '@domain-data-models/app-domain.enums';
import { LocationCategory } from '@domain-data-models/app-domain.interfaces';
import { BreakPointService } from '@domain-services/index';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'Tsk-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CategoriesComponent implements OnInit, OnDestroy {
  @Input() public locationCategories: LocationCategory[];
  @ViewChild('categories') public categories!: ElementRef<HTMLDivElement>;
  @Output() public categoryAction: EventEmitter<string> = new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public controls: any = {
    left: 'arrow_back_ios',
    right: 'arrow_forward_ios',
  };

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

  public selectLocationCategory(category: string): void {
    this.categoryAction.emit(category);
  }

  public scrollLeft(): void {
    this.categories.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  }

  public scrollRight(): void {
    this.categories.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  }
}
