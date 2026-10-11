import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CREATE_PRIVATE_EVENT } from '@private-events-core/store/create-edit-event/constants';
import { createPrivateEventReducer } from '@private-events-core/store/create-edit-event/create-edit-event.reducer';
import { CreateEditEventEffects } from '@private-events-core/store/create-edit-event/create-edit-event.effects';
import { PRIVATE_EVENT } from '@private-events-core/store/private-events/constants';
import { PrivateEventEffects } from '@private-events-core/store/private-events/private-events.effects';
import { privateEventReducer } from '@private-events-core/store/private-events/private-events.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(CREATE_PRIVATE_EVENT, createPrivateEventReducer),
    StoreModule.forFeature(PRIVATE_EVENT, privateEventReducer),
    EffectsModule.forFeature([CreateEditEventEffects, PrivateEventEffects]),
  ],
  exports: [StoreModule, EffectsModule],
})
export class PrivateEventStoreModule {}
