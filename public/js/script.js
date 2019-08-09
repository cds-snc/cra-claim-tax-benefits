/* eslint-disable */

// Add a a polyfill for the 'details' HTML5 element for older browsers
if (typeof Promise !== 'function' && document.querySelector('details') !== null) {
  document.write('<script src="/js/details-element-polyfill.js"></script>')
}

// Find all of the links with the 'button-link' class and add a click event to them
var elements = document.querySelectorAll('a.button-link')
for (var i = 0, len = elements.length; i < len; i++) {
  elements[i].addEventListener('keydown', function(e) {
    if (e.keyCode == 32) {
      e.target.click()
    }
  })
}

// Add aria labels to the revealing/concealing content underneath "yes/no" radios
var noInfoBox = document.getElementsByClassName('no-info')[0]
if (noInfoBox) {
  var yesNoRadios = document.querySelectorAll('div.multiple-choice__item')

  var noInput = yesNoRadios[1].childNodes[0]

  for (var i = 0, len = yesNoRadios.length; i < len; i++) {
    yesNoRadios[i].addEventListener('click', function(e) {
      if (e.target.value === 'No') {
        noInput.setAttribute('aria-expanded', 'true')
      } else {
        noInput.setAttribute('aria-expanded', 'false')
      }
    })
  }
}
