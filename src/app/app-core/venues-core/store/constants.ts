import { VenueTokenDTO, VenueManagerDTO } from '@venues-core/api';
import { DetailsDisplay } from '@venues-core/data-models';

export const VENUES = 'venues';

export interface VenueStore {
  detailsDisplay: DetailsDisplay;
  venueToken: VenueTokenDTO;
  locationVenues: VenueTokenDTO[];
  managedVenues: VenueTokenDTO[];
  venueSearch: VenueTokenDTO[];
  venueManagers: VenueManagerDTO[];
}
