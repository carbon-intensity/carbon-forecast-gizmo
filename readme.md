# Carbon Intensity Forecase gizmo

![](screenshot.png)

[![Powered by electricity](http://forthebadge.com/images/badges/powered-by-electricity.svg)](http://forthebadge.com)

## Use

To add this on your site, use the following snippet:

```html
<iframe class="carbon-gizmo" src="https://carbon-gizmo.wwf.org.uk/1.0.14--beta/" width="100%" height="400px" scrolling="no" style="border:0"></iframe>
```

## Build

To build the tool for deployment on your Amazon S3 bucket, you'll need **Node 8** installed. It has been tested with 8.0.0; recommend either [n](https://github.com/tj/n) or [NVM](https://github.com/creationix/nvm) for switching between different versions of Node.

Clone the repo, then `npm install` or `npm i` to install the dependencies.

You can optionally add in your [Rollbar](https://rollbar.com) clientside access token; if you leave this out, make sure to comment out the Rollbar snippet in `_views/index.pug`.

`npm run build` compiles the JavaScript and builds the pages into the `build` folder - run a server with this folder at the root to see the gizmo. Both the pages and JavaScript needs to be built for every change, since the compiled JavaScript is versioned with a hash of the file appended to the filename to enable cache-busting.
