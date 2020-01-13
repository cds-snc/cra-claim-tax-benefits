/* eslint-disable */

var elementIsNative = typeof HTMLDetailsElement != "undefined" && document.createElement("details") instanceof HTMLDetailsElement;
if (!elementIsNative) {
  // Add a polyfill for the 'details' HTML5 element for older browsers if there is a 'details' tag on the page
  if (document.querySelector('details') !== null) {
    document.write('<script src="/js/details-element-polyfill.js"></script>');
  }
}

// Find all of the links with the 'button' role and add a click event to them
var elements = document.querySelectorAll('a[role="button"]');

for (var i = 0, len = elements.length; i < len; i++) {
  elements[i].addEventListener('keydown', function (e) {
    if (e.keyCode == 32) {
      e.target.click();
    }
  });
}

var form = document.querySelector('#content form');
if (form) {
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    // remove the #hash component of the url (ie, the last part of /login/code#code)
    if ('pushState' in history) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }

    form.submit();
  });
}
