import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'Tsk-private-event-account',
  templateUrl: './private-event-account.component.html',
  styleUrls: ['./private-event-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrivateEventAccountComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
