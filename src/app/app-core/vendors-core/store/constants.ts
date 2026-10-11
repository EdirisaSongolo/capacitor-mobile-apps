import {
  VendorTokenDTO,
  VendorManagerDTO,
} from '@vendors-core/api/vendors.dto-models';
import { DetailsDisplay } from '@vendors-core/data-models';

export const VENDORS: string = 'vendors';

export interface VendorStore {
  detailsDisplay: DetailsDisplay;
  managedVendors: VendorTokenDTO[];
  vendorToken: VendorTokenDTO;
  vendorProfileManagers: VendorManagerDTO[];
}
