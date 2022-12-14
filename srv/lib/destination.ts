import {
  Destination,
  DestinationFetchOptions,
  DestinationForServiceBindingOptions,
  getDestination as _getDestination
} from "@sap-cloud-sdk/connectivity";

import { CustomError } from "./error";

/**
 * Retrieves cached destination with given name
 * @param destinationName name of a destinaion
 * @returns the found destination
 */
export async function getCachedDestination(destinationName: string): Promise<Destination> {
  return getDestination({ destinationName, useCache: true });
}

/**
 * Reads the destination with the given name, from destination service, subaccount or environment
 * @param destinationName name of a destination
 * @param token optional JWT token
 * @returns the destination definition
 */
export async function getDestination(
  options: DestinationFetchOptions & DestinationForServiceBindingOptions
): Promise<Destination> {
  const destination = await _getDestination(options);
  if (!destination) {
    throw new CustomError(`failed to get destination: ${options.destinationName}`, 404);
  }
  return destination;
}
