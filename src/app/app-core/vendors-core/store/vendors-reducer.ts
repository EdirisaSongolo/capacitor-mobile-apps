import { createReducer, on } from '@ngrx/store';

import { VendorStore } from './constants';
import {
  retrieveVendorProfileManagers,
  storeVendorProfileManagers,
  storeVendorToken,
  updateVendorProfileImage,
  setVendorsDetailsDisplay,
  storeUserManagedVendors,
} from '@vendors-core/store/vendors-actions';

export const vendorState: VendorStore = {
  detailsDisplay: null,
  managedVendors: [],
  vendorToken: null,
  vendorProfileManagers: [],
};

export const vendorsReducer = createReducer(
  vendorState,
  on(setVendorsDetailsDisplay, (state, { detailsDisplay }) => ({
    ...state,
    detailsDisplay: detailsDisplay,
  })),
  on(storeUserManagedVendors, (state, { managedVendors }) => ({
    ...state,
    managedVendors: managedVendors,
  })),
  on(storeVendorToken, (state, { vendor }) => ({
    ...state,
    vendorToken: vendor,
  })),
  on(updateVendorProfileImage, (state, { mediaFileUrl }) => ({
    ...state,
    vendorToken: { ...state.vendorToken, profileImage: mediaFileUrl },
  })),
  on(retrieveVendorProfileManagers, (state): VendorStore => ({
    ...state,
    vendorProfileManagers: [],
  })),
  on(storeVendorProfileManagers, (state, { vendorManagers }) => ({
    ...state,
    vendorProfileManagers: [...vendorManagers],
  }))
);
