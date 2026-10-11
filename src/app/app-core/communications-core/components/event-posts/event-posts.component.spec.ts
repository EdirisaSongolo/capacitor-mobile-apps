import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventPostsComponent } from './event-posts.component';

describe('EventPostsComponent', () => {
  let component: EventPostsComponent;
  let fixture: ComponentFixture<EventPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventPostsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventPostsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
