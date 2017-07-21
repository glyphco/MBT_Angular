// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  authServer: 'https://mbtauth.dev',
  apiServer: 'https://mbtapi.dev/api',
  //within how many minutes should the token be refreshed
  refreshWindow: 30,
  googleTimezoneKey: 'AIzaSyCJ9ag8h4yGT6B_g-giiTk44c2oKh9uLaQ',
  locationDefault: {"lat":41.96127718008788,"lng":-87.67827987670898,"city":"Chicago","neighborhood":"North Center","state":"Illinois","postal_code":"60618","country":"United States"}
};
