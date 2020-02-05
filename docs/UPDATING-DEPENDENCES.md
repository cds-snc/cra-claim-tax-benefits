# Updating dependencies

We use open-source npm dependencies to build our application. These dependencies are (mostly) under active development and new versions are pushed fairly regularly.

As many dependency updates fix small bugs or ensure compatibility with new platforms, we want to be keeping up with them. Letting dependencies fall behind several major versions is generally a bad scene.

We run this process at least once every 2-week period (ie, once a sprint), or as soon as possible if we are alerted to a vulnerability. To know the last time the dependencies were updated, you can check [the git history of the `package.json`](https://github.com/cds-snc/cra-claim-tax-benefits/commits/master/package.json) file.

## The update process

1. Run `npm outdated`. This will list packages with newer versions than the ones we're using.

2. Apply all updates — patch, minor, and major updates — by updating the version numbers in `package.json` to match the version in the `LATEST` column returned by `npm`.

3. Delete the `package-lock.json` file and the `./node_modules` folder. This will ensure we get the latest nested dependencies as well.

```
rm -rf package-lock.json ./node_modules
```

4. Install new dependencies with `npm install`.

5. Run the tests.

```
npm test
npm run lint
npm run cypress:cli
```

6. If the tests _fail_, continue to step 6. If the tests _pass_, continue to step 7.

7. Revert to the previous dependency versions (eg, `git checkout -- .`) and run `npm install` to re-download them. Run the tests with the original dependencies to ensure they do actually pass. If they do, you can be sure that your updates broke the tests and not some other random issue.

   - Return to step 1.
   - When you arrive at step 2, only apply the **minor**, and **patch** upgrades.
   - If any of the tests fail on step 4, revert again but this time apply only the **patch** upgrades.
   - If the tests continue to fail on the patch upgrades, debug the problem(s) until the tests pass and the application works as expected.

8. Boot up the application locally and make sure things look as expected (the cypress tests (`npm run cypress:cli`) cover most of the pages, so this is just a sense check).

9. Submit a pull request with your updates.

10. Once pull request is approved, merge away! 🚢 [Our app is continuously deployed](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/.github/workflows/testBuildDeploy.yml) to our [App Service URL](https://claim-tax-benefits.azurewebsites.net/start) using [Github Actions](https://github.com/features/actions). [Check the latest workflow](https://github.com/cds-snc/cra-claim-tax-benefits/actions) to make sure the app was deployed successfully. In the unlikley event of an error, read [the manual deployment instructions](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/DEPLOY.md).

## Updating our `<details>` polyfill

We use [the `<details>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) to hide help text in the app where we don't want to clutter up the interface. (This is known as [progressive disclosure](https://en.wikipedia.org/wiki/Progressive_disclosure)).

The `<details>` element is an easy, semantic way to create an open/close element; however, [it's not supported by all browsers](https://caniuse.com/#search=details) (specifically IE11 and Edge v19 or lower). We’ve addressed this is by using the [details-element-polyfill](https://github.com/javan/details-element-polyfill), which we’ve included as a vendor file in [`/public/js`](https://github.com/cds-snc/cra-claim-tax-benefits/tree/master/public/js).

### Update process for `details-element-polyfill`

1. Check version of our vendored [`details-element-polyfill.js` file](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/public/js/details-element-polyfill.js). (Currently, `2.4.0`.)

2. Visit [javan/details-element-polyfill](https://github.com/javan/details-element-polyfill) on Github.

3. Check current version in [`details-element-polyfill/dist/details-element-polyfill.js`](https://github.com/javan/details-element-polyfill/blob/master/dist/details-element-polyfill.js). (Currently, `2.4.0`.)

4. If the versions are the same, do nothing.

5. If the versions are different, copy [`details-element-polyfill/dist/details-element-polyfill.js`](https://github.com/javan/details-element-polyfill/blob/master/dist/details-element-polyfill.js) into `/public/js/details-element-polyfill.js`.

6. Submit a pull request with your updates.

7. Once pull request is approved, merge away! 🚢 [Our app is continuously deployed](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/.github/workflows/testBuildDeploy.yml) to our [App Service URL](https://claim-tax-benefits.azurewebsites.net/start) using [Github Actions](https://github.com/features/actions). [Check the latest workflow](https://github.com/cds-snc/cra-claim-tax-benefits/actions) to make sure the app was deployed successfully. In the unlikley event of an error, read [the manual deployment instructions](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/DEPLOY.md).
