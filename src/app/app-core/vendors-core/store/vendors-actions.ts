import {
  ProfileDTO,
  ProfilesListDTO,
} from '@app-core/app-api/app-api.dto-models';

import { createAction, props } from '@ngrx/store';
import {
  VendorTokenDTO,
  VendorManagerDTO,
} from '@vendors-core/api/vendors.dto-models';
import { DetailsDisplay } from '@vendors-core/data-models';

export const SET_VENDORS_DETAILS_DISPLAY =
  '[Vendor Dashboard] Set vendors dashboard details display';
export const setVendorsDetailsDisplay = createAction(
  SET_VENDORS_DETAILS_DISPLAY,
  props<{ detailsDisplay: DetailsDisplay }>()
);

export const RETRIEVE_USER_MANAGED_VENDORS =
  '[Vendor Dashboard] Retrieve user managed Vendor Profiles';
export const retrieveUserManagedVendors = createAction(
  RETRIEVE_USER_MANAGED_VENDORS
);

export const STORE_USER_MANAGED_VENDORS =
  '[Vendor Dashboard] Store user managed vendors';
export const storeUserManagedVendors = createAction(
  STORE_USER_MANAGED_VENDORS,
  props<{ managedVendors: VendorTokenDTO[] }>()
);

export const CREATE_VENDOR_PROFILE = '[Vendor Dashboard] Create Vendor Profile';
export const createVendorProfile = createAction(
  CREATE_VENDOR_PROFILE,
  props<{ vendorDTO: VendorTokenDTO }>()
);

export const RETRIEVE_VENDOR_TOKEN: string = '[Vendors] Retrieve vendor Token';
export const retrieveVendorToken = createAction(
  RETRIEVE_VENDOR_TOKEN,
  props<{ profile: ProfileDTO }>()
);

export const STORE_VENDOR_TOKEN: string = '[Vendors] Store Vendor Token';
export const storeVendorToken = createAction(
  STORE_VENDOR_TOKEN,
  props<{ vendor: VendorTokenDTO }>()
);

export const UPDATE_VENDOR_PROFILE_DETAILS =
  '[Vendors] Update vendor profile details';
export const updateVendorProfileDetails = createAction(
  UPDATE_VENDOR_PROFILE_DETAILS,
  props<{ vendorDTO: VendorTokenDTO }>()
);

export const UPDATE_VENDOR_PROFILE_IMAGE =
  '[Vendor Dashboard] Update vendor profile image';
export const updateVendorProfileImage = createAction(
  UPDATE_VENDOR_PROFILE_IMAGE,
  props<{ mediaFileUrl: string }>()
);

export const RETRIEVE_VENDOR_PROFILE: string =
  '[vendorToken] Retrieve Vendor Profile';
export const retrieveVendorProfile = createAction(
  RETRIEVE_VENDOR_PROFILE,
  props<{
    profile: ProfileDTO;
  }>()
);

export const CREATE_VENDOR_PROFILE_MANAGER =
  '[Vendor Core] Create vendor profile manager';
export const createVendorProfileManager = createAction(
  CREATE_VENDOR_PROFILE_MANAGER,
  props<{ vendorManager: VendorManagerDTO }>()
);

export const RETRIEVE_VENDOR_PROFILE_MANAGERS =
  '[Vendors Core] Retrieve vendor profile managers';
export const retrieveVendorProfileManagers = createAction(
  RETRIEVE_VENDOR_PROFILE_MANAGERS,
  props<{ profile: ProfileDTO }>()
);

export const REMOVE_VENDOR_PROFILE_MANAGERS =
  '[Vendor Core] Remove vendor profile managers';
export const removeVendorProfileManagers = createAction(
  REMOVE_VENDOR_PROFILE_MANAGERS,
  props<{
    vendorManagers: VendorManagerDTO[];
  }>()
);

export const STORE_VENDOR_PROFILE_MANAGERS =
  '[Vendor Dashboard] Store vendor profile managers';
export const storeVendorProfileManagers = createAction(
  STORE_VENDOR_PROFILE_MANAGERS,
  props<{ vendorManagers: VendorManagerDTO[] }>()
);

export const RETRIEVE_LISTED_VENDORS: string =
  '[Public Event Profile] Retrieve listed vendors';
export const retrieveListedVendors = createAction(
  RETRIEVE_LISTED_VENDORS,
  props<{ vendorsIds: ProfilesListDTO }>()
);
