import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PublicEventEffects } from '@public-events-core/store/public-events/public-events.effects';
import { publicEventReducer } from '@public-events-core/store/public-events/public-events.reducer';
import { PUBLIC_EVENT } from '@public-events-core/store/public-events/constants';
import { CREATE_PUBLIC_EVENT } from '@app-core/public-events-core/store/create-edit-event/constants';
import { createEditPublicEventReducer } from '@public-events-core/store/create-edit-event/create-edit-event.reducer';
import { CreateEditEventEffects } from '@public-events-core/store/create-edit-event/create-edit-event.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(CREATE_PUBLIC_EVENT, createEditPublicEventReducer),
    StoreModule.forFeature(PUBLIC_EVENT, publicEventReducer),
    EffectsModule.forFeature([CreateEditEventEffects, PublicEventEffects]),
  ],
  exports: [StoreModule, EffectsModule],
})
export class PublicEventStoreModule {}
