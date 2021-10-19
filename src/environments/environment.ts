// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  endpoint: 'https://gateway.marvel.com:443/v1/public',
  publicKey: '12f2d21956810afe14f3b07dc210148d',
  privateKey: '11090d43f4c235794819f6e8eb92019b17762c32',
  ts: '123',
  applicationId: 'sandbox-sq0idb-nnLSj0-2c9jDnFzCVTYdnA',
  locationId: 'LJZTBR6WY191F',
  GCPFunction: 'https://us-central1-vivid-tuner-273919.cloudfunctions.net/square-checkout'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
