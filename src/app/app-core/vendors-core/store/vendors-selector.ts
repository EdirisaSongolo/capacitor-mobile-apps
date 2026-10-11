import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VENDORS, VendorStore } from './constants';

export const vendorsFeature = createFeatureSelector<VendorStore>(VENDORS);

export const vendorsDetailsSelector = createSelector(
  vendorsFeature,
  state => state.detailsDisplay
);

export const vendorTokenSelector = createSelector(
  vendorsFeature,
  state => state.vendorToken
);

export const managedVendorsSelector = createSelector(
  vendorsFeature,
  state => state.managedVendors
);

export const vendorProfileManagersSelector = createSelector(
  vendorsFeature,
  state => state.vendorProfileManagers
);
