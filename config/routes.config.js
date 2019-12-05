// list the urls for security questions
const securityQuestionUrls = [
  '/login/questions/child',
  '/login/questions/addresses',
  '/login/questions/prison',
  '/login/questions/dateOfResidence',
  '/login/questions/bankruptcy',
  '/login/questions/bank',
  '/login/questions/taxReturn',
  '/login/questions/rrsp',
  '/login/questions/tfsa',
  '/login/questions/ccb',

  // Skip URL
  '/checkAnswers',
]

//list our routes in the flow order in the app
const routes = [
  { path: '/start' },
  { path: '/login/code' },
  { path: '/offramp', editInfo: 'skip' },
  { path: '/login/sin' },
  { path: '/login/dateOfBirth' },
  { path: '/personal/name' },
  { path: '/offramp/name', editInfo: 'skip' },
  { path: '/personal/residence' },
  { path: '/offramp/residence', editInfo: 'skip' },
  { path: '/personal/address' },
  { path: '/offramp/address', editInfo: 'skip' },
  { path: '/personal/maritalStatus' },
  { path: '/offramp/maritalStatus', editInfo: 'skip' },
  { path: '/trillium/rent' },
  { path: '/trillium/rent/amount', editInfo: 'deductions.trilliumRentAmount' },
  { path: '/trillium/propertyTax' },
  { path: '/trillium/propertyTax/amount', editInfo: 'deductions.trilliumPropertyTaxAmount' },
  { path: '/trillium/energy/reserve' },
  { path: '/trillium/energy/cost', editInfo: 'deductions.trilliumEnergyCostClaim' },
  { path: '/trillium/energy/cost/amount', editInfo: 'deductions.trilliumEnergyAmount' },
  { path: '/trillium/longTermCare' },
  { path: '/trillium/longTermCare/type', editInfo: 'deductions.trilliumLongTermCareTypeClaim' },
  { path: '/trillium/longTermCare/type/amount', editInfo: 'deductions.trilliumLongTermCareAmount' },
  { path: '/deductions/climate-action-incentive' },
  { path: '/vote/optIn' },
  { path: '/vote/confirmRegistration', editInfo: 'vote.voterCitizen' },
  { path: '/login/notice' },
  { path: '/login/securityQuestion' },
  { path: '/login/questions', options: ['/login/securityQuestion2'] },
  { path: '/login/questions', options: securityQuestionUrls },
  { path: '/offramp/securityQuestion', editInfo: 'skip' },
  { path: '/financial/income' },
  { path: '/offramp/financial', editInfo: 'skip' },
  { path: '/checkAnswers' },
  { path: '/review' },
  { path: '/confirmation' },
  { path: '/feedback', editInfo: 'skip' },
]

module.exports = {
  routes,
  securityQuestionUrls,
}
