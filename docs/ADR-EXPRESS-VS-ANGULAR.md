# Architecture decision record: Express vs. Angular

[The Claim Tax Benefits (CTB) frontend application](https://claim-tax-benefits.azurewebsites.net/start) is currently using Express with Pug as a templating engine, after an unfavourable comparison with [Angular](https://angular.io/). We will continue to develop the CTB app with Express rendering a server-side templates, although the direction of the application after the handover period is up to CRA to determine.

## Initial direction

Initially, [the determination was made](https://docs.google.com/document/d/16T9GcQPLNzMLgtA8ga_GQxEquYePEUIXPhvWTcqXq5k/edit#) to use Angular (with Express):

**(Extracts from the document about Angular)**

> _CRA likes it, so it’s what they are willing to support once we hand it over_

> _At CDS, we care about building an accessible application that will help real Canadians. We can use Angular to do that._

> _We at CDS feel we could use server-side templating to build the app but CRA would likely balk at ongoing support_

However, we thereafter pivoted to using [Express](https://expressjs.com/) with [Pug](https://pugjs.org/api/getting-started.html) as a server-side templating language, and moving away from using a client-side framework at all. The impetus for this was the result of a technical spike (From [Wikipedia](<https://en.wikipedia.org/wiki/Spike_(software_development)>): "A spike is a product-testing method that uses the simplest possible program to explore potential solutions. It is used to determine how much work will be required to solve or work around a software issue.").

## Technical spike

As the Tech Lead, I ([Paul Craig](mailto:paul.craig@cds-snc.ca)) came up with a set of minimal criteria that we would need to get started.

1. **It must be optimized for a page-by-page form-based design**

   - Given the intended design, we need to be able to quickly build usable, resilient forms that we can maintain over time

2. **It must be accessible from the beginning**

   - For our form-based flow, [a hard dependency on JavaScript](https://www.gov.uk/service-manual/technology/using-progressive-enhancement) would only make our site harder to build in an accessible way

3. **It needs to allow us to store user data**

   - We need to be able to take user input and output it later (eg, related to language preferences or session data)

Specifically, I wanted to see (1) a start page, (2) a page for users to input information, and then (3) a "result" page with the user-submitted data.

I created two applications, one using server-side rendered Angular and one using [a base express app](https://github.com/pcraig3/expressbase) forked from [@ayoajila](https://github.com/ayoajila)’s "expressbase" application — intended as a demo app for server-side cloud development at CRA.

**App 1: Angular**

- Repository: [https://github.com/pcraig3/angular-ssr-demo](https://github.com/pcraig3/angular-ssr-demo)
- Link: [http://angular-ssr-demo.canadacentral.azurecontainer.io:4000/](http://angular-ssr-demo.canadacentral.azurecontainer.io:4000/)

**App 2: Express**

- Repository: [https://github.com/pcraig3/expressbase](https://github.com/pcraig3/expressbase)
- Link: [http://expressbase.canadacentral.azurecontainer.io:3005/](http://expressbase.canadacentral.azurecontainer.io:3005/start)

While both apps were able to fulfill the above requirements, the difference was clear.

### Angular: the wrong tool for the job

Angular is a client-side JavaScript framework optimized for apps with real-time data requirements and/or dynamic interactions. For our form-based web application, we don’t benefit from the more dynamic features that Angular offers. Our pages are lightweight and don’t require real-time updates. In fact, real-time updates would likely lead to usability issues.

Even where we could use dynamic on-page changes like form validation, we have found [during usability testing in previous projects that users can be discouraged by real-time error messages or miss them altogether](https://github.com/cds-snc/ircc-rescheduler/issues/92), which is supported by [GDS’ guidance on validation messages](https://design-system.service.gov.uk/components/error-message/#when-not-to-use-this-component).

Additionally, building a purely client-side application introduces many [potential issues](https://blog.pope.tech/2018/10/25/angular-accessibility-and-you/) that aren’t present in server-rendered web applications. An example would be when the focus is lost between page transitions. It’s possible to manually correct this, but a server-rendered application wouldn’t have this problem. In general, it is easier to build an accessible form-based service with a server-rendered application.

Unfortunately, building a server-rendered Angular app (using [Angular Universal](https://angular.io/guide/universal)) is not how the framework is intended to be used. In order to server-render the application, the complexity of the configuration increases dramatically, resulting in a less-readable codebase with a terrible development experience.

Indeed, while CRA is looking to develop and support Angular applications in the future, CRA is **not** looking to develop and support _server-side rendered_ (SSR) Angular applications. Better accessibility is a priority for CDS, but not necessarily for CRA. Even if we went through the steep learning curve of an SSR Angular application, it is unlikely that CRA would agree to support it.

### Express and Pug: far better

Meanwhile, using Express with Pug was fast and straightforward after Angular. Express allowed us to get up and running orders of magnitude faster than with Angular. And since this time cost would be paid by every new developer joining the project, picking “the easiest to get started with” meant we could get much further in less time, which was ideal for us during our “Alpha” prototyping phase.

It’s worth mentioning that the higher-overhead cost of a web framework (like Angular) might be well worth it over time — as strong conventions make long-term development more sustainable — but that wasn’t the context for this comparison.

## Conclusion

With our overall goal of building an accessible, performant, form-based application, I worked through a technical spike to test two approaches side-by-side: Angular vs. Express. The resulting technical spike indicated that proceeding with Angular would be the wrong choice. It presented a much steeper learning curve, it would be harder to build for our requirements, and it would be more difficult to keep it fully accessible.

When building form-based applications — often the case in government — a server-side application MVC application is straightforwardly a better choice for delivering a performant, accessible, resilient user-facing service.
