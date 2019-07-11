// haven't used this elsewhere yet, but the idea of keeping it here is so we can pull these values in wherever we're using them, and have one source of truth for these values (instead of updating copy in multiple files)
const maritalStatusOptions = {
    en: [
      {
        value: 'Single',
        label: 'Single',
      },
      {
        value: 'Married',
        label: 'Married',
      },
      {
        value: 'Separated',
        label: 'Separated',
      }, 
      {
        value: 'Divorced',
        label: 'Divorced',
      }, 
      {
        value: 'Widowed',
        label: 'Widowed',
      }
    ]
}
module.exports = {
  maritalStatusOptions
}
