const validator = require('validator')
const { validationResult } = require('express-validator')
const API = require('./../api')
const { routes: defaultRoutes } = require('../config/routes.config')
const cookieConfig = require('../config/cookie.config')

/*
  original format is an array of error objects: https://express-validator.github.io/docs/validation-result-api.html
  convert that to an object where the key is the parameter name and value is the error object
  ie,
  [
    { param: 'name', msg: 'Cannot be empty', ... },
    { param: 'number', msg: 'Cannot be empty', ... }
  ]
  to
  {
    name: { param: 'name', msg: 'Cannot be empty', ... },
    number: { param: 'number', msg: 'Cannot be empty', ... }
  }
*/
const errorArray2ErrorObject = (errors = []) => {
  return errors.array({ onlyFirstError: true }).reduce((map, obj) => {
    map[obj.param] = obj
    return map
  }, {})
}

/* Middleware */
/**
 * This request middleware checks for the "lang" query.
 * If it finds a query parameter "lang=fr" or "lang=en", it will set a "lang" cookie to whichever value.
 *
 * From this point onwards, all of the site's content will be in the user's preferred language.
 */
const checkLangQuery = function(req, res, next) {
  let lang = req.query.lang

  if (lang === 'en' || lang === 'fr') {
    res.cookie('lang', lang, cookieConfig)
  }

  return next()
}

/**
 * This request middleware checks if we are visiting a public path
 * For most of the pages in our app, we expect to have user data in the session
 * If we're visiting one of the non-public paths, it will load user data into the session
 *
 * We _could_ redirect people to the "/start" page if they're on the wrong URL,
 * but since this app is for demo purposes at this point, we should just ensure
 * that a user session exists whatever page you end up on.
 */
const checkPublic = function(req, res, next) {
  const publicPaths = ['/', '/clear', '/start', '/login/code', '/login/sin', '/login/dateOfBirth']
  if (publicPaths.includes(req.path)) {
    return next()
  }

  // check if user exists in session (ie, by checking for firstName)
  const { personal: { firstName = null } = {} } = req.session
  if (!firstName) {
    const user = API.getUser('A5G98S4K1')

    // setting req.session = {obj} causes an error, so assign the keys one at a time
    Object.keys(user).map(key => (req.session[key] = user[key]))
  }

  return next()
}

/**
 * Middleware function that runs our error validation
 *
 * Since returning our errors is looking like a lot of boilerplate code, this function:
 *
 * - checks if the request parameters match the schema
 * - checks if there are errors
 * - if no errors, "next()"
 * - if there are errors,
 *   - send back a 422 status
 *   - add the session data to the template
 *   - put the request parameters into the template (except for the redirect)
 *   - render the passed-in template string
 *
 * By including this function, we can cut down our post functions by about half
 *
 * @param string template The template string to render if errors are found (should match the one used for the GET request)
 */
const checkErrors = template => {
  return (req, res, next) => {
    const errors = validationResult(req)

    // copy all posted parameters, but remove the redirect
    let body = Object.assign({}, req.body)
    delete body.redirect

    if (!errors.isEmpty()) {
      return res.status(422).render(template, {
        prevRoute: getPreviousRoute(req),
        data: req.session,
        body,
        errors: errorArray2ErrorObject(errors),
      })
    }

    return next()
  }
}

// POST functions that handle setting the login data in the session and will redirecting to the next page or send back an error to the client.
// Note that this is not the only error validation, see routes defined above.
const doRedirect = (req, res) => {
  const redirect = req.body.redirect || null
  if (!redirect) {
    throw new Error(`[POST ${req.path}] 'redirect' parameter missing`)
  }

  if (req.query.ref && req.query.ref === 'checkAnswers') {
    return returnToCheckAnswers(req, res)
  }

  const { route: { path } = {} } = getRouteWithIndexByPath(redirect)

  if (!path) {
    throw new Error(
      `[POST ${req.path}] 'redirect' parameter ${path} not a whitelisted URL. Check the routes config.`,
    )
  }

  return res.redirect(path)
}

// Render a passed-in template and pass in session data under the "data" key
const renderWithData = (template, { errorsKey } = {}) => {
  return (req, res) => {
    let errors = undefined

    // if there are errors in the session under the specified key, add them to the template
    if (errorsKey && req.session && req.session[errorsKey] && req.session[errorsKey].errors) {
      errors = req.session[errorsKey].errors
      // means we only see the error once
      delete req.session[errorsKey].errors
    }

    // send a 422 response if errors exist
    res.status(errors ? 422 : 200).render(template, {
      data: req.session,
      prevRoute: getPreviousRoute(req),
      errors,
    })
  }
}

/**
 * Middleware to handle our yes/no question routing logic.
 * If the yesNo page comes back "Yes"
 * - set the session variable to "true"
 * - redirect to the "/amount" url
 *
 * If the yesNo page comes back "No"
 * - set the session variable to "false"
 * - reset dependent fields to 0 or "null"
 * - continue
 *
 * @param string claim the variable name with the claim
 * @param array fields an array of fields to reset (if the claim is "no")
 */
const doYesNo = (claim, fields) => {
  return (req, res, next) => {
    const claimVal = req.body[claim]

    if (claimVal === 'Yes') {
      req.session.deductions[claim] = true

      if (req.query.ref && req.query.ref === 'checkAnswers') {
        return returnToCheckAnswers(req, res, true)
      }

      const currentRoute = getRouteWithIndexByPath(req.path)
      return res.redirect(defaultRoutes[currentRoute.index + 1].path)
    }

    req.session.deductions[claim] = false

    // fields is an array
    fields.map(field => {
      // if the field is truthy
      if (req.session.deductions[field]) {
        // "Amount" fields are zeroed -- others are nulled
        if (field.endsWith('Amount')) {
          if (Object.keys(req.session.deductions[field]).includes('amount')) {
            req.session.deductions[field].amount = 0.0
          } else {
            req.session.deductions[field] = 0
          }
        } else {
          req.session.deductions[field] = null
        }
      }
    })

    next()
  }
}

const postAmount = (amount, locale) => {
  if (!amount || amount === '') {
    return amount
  }

  if (locale === 'fr') {
    const formattedAmount = amount.replace(',', '.').replace(/\s/g, '')

    return formattedAmount
  }

  //remove commas for English format inputs, just for consistency of storing
  return amount.replace(/,/g, '')
}

/**
 * Cleans a string of hyphens and spaces
 *
 * ie, "8-4-7339 2 8 3 " => "847 339 283"
 *
 * @param string sin a string assumed to be a SIN
 */
const cleanSIN = sin => {
  return sin ? sin.replace(/-|\s/g, '') : sin
}

/* Pug filters */
/**
 * Accepts a string (assumed to be a SIN)
 * If it is 9 characters long, this function returns a string with
 * a space inserted after the 3rd character and the 6th character
 *
 * ie, "847339283" => "847 339 283"
 *
 * @param string text a 9-character string assumed to be a social insurance number
 */
const SINFilter = text => {
  return text.length === 9 ? `${text.slice(0, 3)} ${text.slice(3, 6)} ${text.slice(6)}` : text
}

/**
 * @param {Object} obj the obj we're passing, most often 'data'
 * @param {String} key the key we're trying to access, passed as a string, not including the obj ref itself
 * ex. if we're trying to get to data.personal.maritalStatus
 * pass as hasData(data, 'personal.maritalStatus')
 */
const hasData = (obj, key, returnVal = false) => {
  let copyObj = Object.assign({}, obj)
  /*
    Get value from nested object using a stirng

    Examples:
    - resolvePath(window,'document.body') => <body>
    - resolvePath(window,'document.body.xyz') => undefined
    - resolvePath(window,'document.body.xyz', null) => null
    - resolvePath(window,'document.body.xyz', 1) => 1
    Source: https://stackoverflow.com/a/43849204
  */
  const _resolvePath = (object, path, defaultValue) =>
    path.split('.').reduce((o, p) => (o ? o[p] : defaultValue), object)

  const bool = key.split('.').every(x => {
    if (
      typeof copyObj != 'object' ||
      copyObj === null ||
      !copyObj.hasOwnProperty(x) || // eslint-disable-line no-prototype-builtins
      copyObj[x] === null ||
      copyObj[x] === ''
    ) {
      return false
    }
    copyObj = copyObj[x]

    return true
  })

  if (returnVal) {
    return _resolvePath(obj, key, bool)
  }

  return bool
}

/**
 * @param {String} locale the locale we would like to format for, passed either as 'fr' or 'en' in our case
 *
 * @param {String|Number} amount the number we're passing to format, which is passed either explicitly as a number or a string (we cast it as a number in currencyFilter, regardless)
 *
 * Essentially calls currencyFilter, but removes the dollar sign unit
 */
const currencyWithoutUnit = (locale = 'en', amount = 0) => {
  return amount !== '' ? currencyFilter(amount, locale).replace(/\$/g, '') : ''
}

/**
 * @param {String|Number} number the number we're passing to format, which is passed either explicitly as a number or a string (we cast it as a number first thing, regardless)
 * @param {String} locale the locale we would like to format for, passed either as 'fr' or 'en' in our case
 */
const currencyFilter = (number, locale = 'en') => {
  const amount = Number(number)

  const localeSetting = locale === 'en' ? 'en-US' : 'fr-CA'

  const filteredAmount = amount.toLocaleString(localeSetting, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  if (locale === 'fr') {
    return `${filteredAmount}$`
  }

  return `$${filteredAmount}`
}

/*
 * Accepts an ISO-format date (1999-09-30)
 * and returns a string formatted "dd mm yyyy" (30 09 1999)
 *
 * @param {*} date a string ISO-format date
 */
const isoDateHintText = date => {
  if (!validator.isISO8601(date)) {
    throw new Error(`[GET /login/dateOfBirth] Bad date "${date}": must be a valid ISO date`)
  }

  const dateParts = date.split('-')

  if (dateParts.length !== 3 || dateParts[2].length > 2) {
    throw new Error(`[GET /login/dateOfBirth] Bad date "${date}": must be formatted yyyy-mm-dd`)
  }

  return `${dateParts[2]} ${dateParts[1]} ${dateParts[0]}`
}

const sortByLineNumber = (...objToSort) => {
  //take all the objects, make them into one big object
  const superObj = Object.assign({}, ...objToSort)

  //filter down the object into an array of objects,
  //but only the objects with the line property
  const filteredObj = Object.entries(superObj).filter(obj => {
    return (
      typeof obj[1] === 'object' &&
      obj[1] !== null &&
      obj[1] !== undefined &&
      obj[1].hasOwnProperty('line') // eslint-disable-line no-prototype-builtins
    )
  })

  //sort the array of objects according to the line value
  const sortedArrayObj = filteredObj.map(obj => obj[1]).sort((a, b) => a.line - b.line)

  return sortedArrayObj
}

/* Routing functions */

/**
 * @param {String} name route name
 * @param {Array} routes array of route objects { path: "/start" },
 * @returns { path: "" }
 */
const getPreviousRoute = (req, routes = defaultRoutes) => {
  const { path, session } = req
  const route = getRouteWithIndexByPath(path, routes)

  if (!route || (!('index' in route) && process.env.NODE_ENV !== 'production')) {
    throw new Error('Previous route error.  \n Are your route paths correct in route.config?')
  }

  const prevRoute = () => {
    /**
     * filter to the only possible previous routes (so all routes before this one)
     * reverse the order so when we look over them, we go "backward"
     */
    const allPreviousRoutes = routes.slice(0, route.index).reverse()

    const previousRoute = allPreviousRoutes.find(route => {
      /**
       * essentially check if the page before
       * - is an edit page, that has been edited
       * - or is not an edit page, and is the next logical page
       */
      if (
        ('editInfo' in route && hasData(session, route.editInfo, true)) ||
        !('editInfo' in route)
      ) {
        return route
      }
    })

    return previousRoute || false
  }

  if (req.query && req.query.ref) {
    return routes.find(routeFound => routeFound.path === '/checkAnswers')
  }

  return prevRoute()
}

const returnToCheckAnswers = (req, res, claimYes = false) => {
  const currentRoute = getRouteWithIndexByPath(req.path)
  const nextRoute = defaultRoutes[currentRoute.index + 1]

  if ('editInfo' in nextRoute && 'editInfo' !== 'skip' && claimYes) {
    return res.redirect(`${nextRoute.path}?ref=checkAnswers`)
  }

  return res.redirect('/checkAnswers')
}

/**
 * @param {String} path the current path being visited
 * @param {Array} routes array of route objects { path: "/start" }
 * @returns {Object} { index: "1", route: { path: "/start" } }
 */
const getRouteWithIndexByPath = (path, routes = defaultRoutes) => {
  let routeWithIndex = null

  routes.find((route, index) => {
    let { path: routePath } = route

    // if one of the "options" urls is round, match current route
    // note: this will still return the base "path", not any of the "options" urls
    if (routePath === path) {
      routeWithIndex = { index, route }
    }
  })

  return routeWithIndex
}

module.exports = {
  errorArray2ErrorObject,
  checkErrors,
  getPreviousRoute,
  renderWithData,
  cleanSIN,
  SINFilter,
  hasData,
  checkPublic,
  currencyFilter,
  sortByLineNumber,
  checkLangQuery,
  doRedirect,
  doYesNo,
  isoDateHintText,
  getRouteWithIndexByPath,
  returnToCheckAnswers,
  postAmount,
  currencyWithoutUnit,
}
