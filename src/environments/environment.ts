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
  locationDefault: {
    "lat":41.875792256780315,
    "lng":-87.62811183929443,
    "dist":2,
    "city":"Chicago",
    "neighborhood":"Chicago Loop",
    "state":"Illinois",
    "country":"United States",
    "timezone":"America/Chicago"
  }
};
