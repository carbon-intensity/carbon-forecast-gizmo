# Carbon Intensity Forecase gizmo

[![Powered by electricity](http://forthebadge.com/images/badges/powered-by-electricity.svg)](http://forthebadge.com)

## Use

To add this on your site, use the following snippet:

```html
<iframe class="carbon-gizmo" src="https://carbon-gizmo.wwf.org.uk/2.0.0" width="100%" height="400px" scrolling="no" style="border:0"></iframe>
```

## Build

To run locally, you'll need Node v9.6.1 - it'll probably run on earlier versions, but it's not been tested.

Do the usual install - `npm install`.

To run as a dev server you need to run both the Webpack development server and Netlify Lambda:
    * `npm run dev`
and separately
    * `npm run dev:functions`

TODO: separate `.env.local` for API endpoints, not using Rollbar, and not putting pageviews into Google Analytics.

To build for deployment:
    * `npm run build`
and then:
    * `npm run functions`

But in all honesty it's probably easier to fork this repo, then run the site on Netlify.
