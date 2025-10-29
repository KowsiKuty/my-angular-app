// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiURL: 'https://emc-memo-be-uat.kvbank.in/',
  // apiURL: ' https://emc-memo-be-sit.kvbank.in/',
  apiURL:'http://127.0.0.1:8000',
  crypto_encrypt_key : '9043331384958502',
  logo_change_key:"KVB",
  buildVersion:require('../../package.json').version,
  isSkipLocationChange:true
};
//  logo_change_key:"Vsolv","KVB",
// Starting development server at http://127.0.0.1:8000/
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
