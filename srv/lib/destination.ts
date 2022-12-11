import { Destination, getDestination as _getDestination } from "@sap-cloud-sdk/connectivity";

const destinationCache = new Map<string, Destination>();

/**
 * Reads the destination with the given name, either from cache or from the destination service,
 * subaccount or environment
 * @param destinationName name of a destination
 * @returns the destination definition
 */
export async function getCachedDestination(destinationName: string): Promise<Destination> {
  if (destinationCache.has(destinationName)) {
    const destination = destinationCache.get(destinationName);
    if (destination) {
      return destination;
    } else {
      throw new Error(`Cached destination '${destinationName}' not found`);
    }
  } else {
    const destination = await getDestination(destinationName);
    destinationCache.set(destinationName, destination);
    return destination;
  }
}

/**
 * Reads the destination with the given name, from destination service, subaccount or environment
 * @param destinationName name of a destination
 * @param token optional JWT token
 * @returns the destination definition
 */
export async function getDestination(destinationName: string, token?: string): Promise<Destination> {
  const destination = await _getDestination({ destinationName, jwt: token });
  if (!destination) {
    throw new Error(`failed to get destination: ${destinationName}`);
  }
  return destination;
}
