//list our routes in the flow order in the app
const routes = [
  { path: '/start' },
  { path: '/eligibility/age' },
  { path: '/eligibility/taxable-income' },
  { path: '/offramp/taxable-income', editInfo: 'skip' },
  { path: '/eligibility/residence' },
  { path: '/offramp/residence', editInfo: 'skip' },
  { path: '/eligibility/children' },
  { path: '/offramp/children', editInfo: 'skip' },
  { path: '/eligibility/dependants' },
  { path: '/eligibility/dependants-claim', editInfo: 'login.eligibleDependentsClaim' },
  { path: '/offramp/dependants', editInfo: 'skip' },
  { path: '/eligibility/tuition' },
  { path: '/eligibility/tuition-claim', editInfo: 'login.tuitionClaim' },
  { path: '/offramp/tuition', editInfo: 'skip' },
  { path: '/eligibility/income-sources' },
  { path: '/offramp/income-sources', editInfo: 'skip' },
  { path: '/eligibility/foreign-income' },
  { path: '/offramp/foreign-income', editInfo: 'skip' },
  { path: '/eligibility/success' },
  { path: '/login/code' },
  { path: '/offramp', editInfo: 'skip' },
  { path: '/login/sin' },
  { path: '/login/dateOfBirth' },
  { path: '/login/error/doesNotMatch', editInfo: 'skip' },
  { path: '/personal/name' },
  { path: '/offramp/name', editInfo: 'skip' },
  { path: '/personal/address' },
  { path: '/offramp/address', editInfo: 'skip' },
  { path: '/personal/maritalStatus' },
  { path: '/offramp/maritalStatus', editInfo: 'skip' },
  { path: '/deductions/senior-public-transit', editInfo: 'deductions.seniorTransitClaim' },
  { path: '/deductions/senior-public-transit/amount', editInfo: 'deductions.seniorTransitAmount' },
  { path: '/deductions/climate-action-incentive' },
  { path: '/trillium/rent' },
  { path: '/trillium/rent/ontario', editInfo: 'deductions.trilliumRentOntario' },
  { path: '/trillium/rent/amount', editInfo: 'deductions.trilliumRentAmount' },
  { path: '/trillium/propertyTax' },
  { path: '/trillium/propertyTax/ontario', editInfo: 'deductions.trilliumPropertyTaxOntario' },
  { path: '/trillium/propertyTax/amount', editInfo: 'deductions.trilliumPropertyTaxAmount' },
  { path: '/trillium/longTermCare' },
  { path: '/trillium/longTermCare/ontario', editInfo: 'deductions.trilliumLongTermCareOntario' },
  { path: '/trillium/longTermCare/type', editInfo: 'deductions.trilliumLongTermCareTypeClaim' },
  { path: '/trillium/longTermCare/cost', editInfo: 'deductions.trilliumLongTermCareCost' },
  {
    path: '/trillium/longTermCare/type/roomAndBoard',
    editInfo: 'deductions.trilliumLongTermCareRoomAndBoardAmount',
  },
  { path: '/trillium/longTermCare/type/amount', editInfo: 'deductions.trilliumLongTermCareAmount' },
  { path: '/trillium/energy/reserve' },
  { path: '/trillium/energy/reserve/ontario', editInfo: 'deductions.trilliumEnergyReserveOntario' },
  { path: '/trillium/energy/cost', editInfo: 'deductions.trilliumEnergyCostClaim' },
  { path: '/trillium/energy/cost/amount', editInfo: 'deductions.trilliumEnergyAmount' },
  { path: '/vote/optIn' },
  { path: '/vote/confirmRegistration', editInfo: 'vote.voterCitizen' },
  { path: '/confirm-income' },
  { path: '/checkAnswers' },
  { path: '/confirmation' },
  { path: '/feedback', editInfo: 'skip' },
]

module.exports = {
  routes,
}
