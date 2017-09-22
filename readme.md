# Carbon Intensity Forecase gizmo


## Use

To embed this on your site, copy and paste the following code:

```html
<iframe class="carbon-gizmo" src="https://carbon-gizmo.wwf.org.uk/1.0.10--beta/" width="100%" height="400px" scrolling="no" style="border:0">
```

<iframe class="carbon-gizmo" src="https://carbon-gizmo.wwf.org.uk/1.0.10--beta/" width="100%" height="400px" scrolling="no" style="border:0">

## Build

To build the tool for deployment on your Amazon S3 bucket, you'll need:

* Node 8 installed - tested with 8.0.0; recommend either [n](https://github.com/tj/n) or [NVM](https://github.com/creationix/nvm) for Node versioning.

Pull the repo, then `npm install` to install the dependencies.

Edit `.env-example` with your S3 credentials, then save as `.env`.

To publish the page, `gulp publish`. It will place it in a versioned folder, so if you make an update then the version number should be changed to bust any caches.

