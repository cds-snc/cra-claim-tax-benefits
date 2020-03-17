[La version française suit.](#mettre-à-jour-les-dépendances)

# Updating dependencies

We use open-source npm dependencies to build our application. These dependencies are (mostly) under active development and new versions are pushed fairly regularly.

As many dependency updates fix small bugs or ensure compatibility with new platforms, we want to be keeping up with them. Letting dependencies fall behind several major versions is generally a bad scene.

We run this process at least once every 2-week period (ie, once a sprint), or as soon as possible if we are alerted to a vulnerability. To know the last time the dependencies were updated, you can check [the git history of the `package.json`](https://github.com/cds-snc/cra-claim-tax-benefits/commits/master/package.json) file.

## The update process

1. Run `npm outdated`. This will list packages with newer versions than the ones we're using.

2. Apply all updates — patch, minor, and major updates — by updating the version numbers in `package.json` to match the version in the `LATEST` column returned by `npm`.

3. Delete the `package-lock.json` file and the `./node_modules` folder. This will ensure we get the latest nested dependencies as well.

On macOS

```
rm -rf package-lock.json ./node_modules
```

On Windows

```
del package-lock.json
del node_modules
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

## ---------------------------------------------------------------------

# Mettre à jour les dépendances

Nous utilisons des dépendances `npm` libres pour construire notre application. Ces dépendances sont, pour la plupart, activement développées, et de nouvelles versions sont rendues disponibles de manière généralement regulière.

Puisque la mise à jour de dépendances corrige de petits bogues ou assure la compatibilité avec de nouvelles plateformes, nous voulons tenir notre base de code à jour de façon rigoureuse. Laisser les dépendances non à jour mène généralement à de mauvaises surprises.

Nous exécutons ce processus au minimum une fois par sprint (2 semaines), ou en temps opportun si nous recevons une alerte de vulnérabilité. Pour savoir quand une dépendance a été mise à jour, vous pouvez jeter un oeil [à l'historique git du fichier `package.json`](https://github.com/cds-snc/cra-claim-tax-benefits/commits/master/package.json).

## Le processus de mise à jour

1. Exécutez `npm outdated`. Vous obtiendrez une liste de packages qui ont une version disponible plus récente que celle que vous utilisez en moment.

2. Appliquez toutes les mises à jour — les correctifs, mineures, et majeures — en changeant le numéro de version dans `package.json` afin que cela corresponde avec la version indiquée dans la colonne `LATEST` lorsque vous avez exécuté la commande `npm`.

3. Supprimez le fichier `package-lock.json` et le répertoire `./node_modules`. Cela va permettre d'assurer que les dépendances transitives seront également mises à jour correctement.

Sur macOS

```
rm -rf package-lock.json ./node_modules
```

Sur Windows

```
del package-lock.json
del node_modules
```

1. Installez les nouvelles dépendances via la commande `npm install`.

2. Exécutez les tests.

```
npm test
npm run lint
npm run cypress:cli
```

1. Si les tests _échouent_, continuez à l'étape 6. Si les tests _passent_, continuez à l'étape 7.

2. Revenez à la dernière version des dépendances (ex : `git checkout -- .`) et exécutez `npm install` pour les télécharger de nouveau. Exécutez les tests avec les dépendances originales pour s'assurer qu'ils fonctionnent toujours. Dans la positive, vous savez que ce bris est dû à la mise à jour des dépendances, et non un autre problême non relié.

   - Retournez à l'étape 1.
   - Lorsque vous arrivez à l'étape 2, appliquez les seulement les **mineures** et les **patch**.
   - Si les tests échouent à l'étape 4, renversez à nouveau, et cette fois-ci, appliquez seulement les **patch**.
   - Si les tests continuent d'échouer sur les **patch**, déboguez le(s) problême(s) jusqu'à ce que les tests passent.

3. Déployez l'application localement et assurez vous que tout fonctionne comme attendu (les tests cypress (`npm run cypress:cli`).

4. Envoyez un pull request avec vos changements.

5. Une fois le pull request approuvé, fusionner le code dans la branche `master`! 🚢 [L'application est continuellement déployée](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/.github/workflows/testBuildDeploy.yml) dans notre [Azure App Service](https://claim-tax-benefits.azurewebsites.net/start) via [Github Actions](https://github.com/features/actions). [Jetez un oeil au dernier _workflow_ ](https://github.com/cds-snc/cra-claim-tax-benefits/actions) pour vous assurer que l'application a été déployée correctement. Si une erreur survient, consultez les [instructions de déploiement manuel](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/DEPLOY.md).

## Mise à jour du polyfill `<details>`

Nous utilisons [l'élément `<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) pour cacher le texte d'aide dans l'application ou nous ne voulons pas embourber l'interface. Cette pratique est également nommée [divulgation progressive](https://en.wikipedia.org/wiki/Progressive_disclosure)).

L'élément `<details>` est une façon simple de créer des afficher/cacher; par contre, ce [n'est pas supporté par tous les navigateurs](https://caniuse.com/#search=details) (plus précisément IE11 et Edge v19 en descendant). Nous avons adressé ce problême en utilisant LE [details-element-polyfill](https://github.com/javan/details-element-polyfill), dont nous avons ajouté comme fichier statique sous [`/public/js`](https://github.com/cds-snc/cra-claim-tax-benefits/tree/master/public/js).

### Processus de mise à jour pour `details-element-polyfill`

1. Vérifiez la version du fichier [`details-element-polyfill.js`](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/public/js/details-element-polyfill.js). (Présentement, `2.4.0`.)

2. Visitez [javan/details-element-polyfill](https://github.com/javan/details-element-polyfill) sur Github.

3. Vérifiez la dernière version dans [`details-element-polyfill/dist/details-element-polyfill.js`](https://github.com/javan/details-element-polyfill/blob/master/dist/details-element-polyfill.js). (Présentement, `2.4.0`.)

4. Si les versions sont les mêmes, ne faites rien.

5. Si les versions sont différentes, copiez [`details-element-polyfill/dist/details-element-polyfill.js`](https://github.com/javan/details-element-polyfill/blob/master/dist/details-element-polyfill.js) par dessus `/public/js/details-element-polyfill.js`.

6. Créez un pull request avec vos changements.

7. Une fois le pull request approuvé, fusionner le code dans la branche `master`! 🚢 [L'application est continuellement déployée](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/.github/workflows/testBuildDeploy.yml) dans notre [Azure App Service](https://claim-tax-benefits.azurewebsites.net/start) via [Github Actions](https://github.com/features/actions). [Jetez un oeil au dernier _workflow_ ](https://github.com/cds-snc/cra-claim-tax-benefits/actions) pour vous assurer que l'application a été déployée correctement. Si une erreur survient, consultez les [instructions de déploiement manuel](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/DEPLOY.md).
