//list our routes in the flow order in the app
const routes = [
  { name: 'start', path: '/start' },
  { name: 'login code', path: '/login/code' },
  { name: 'login sin', path: '/login/sin' },
  { name: 'login date of birth', path: '/login/dateOfBirth' },
  { name: 'name', path: '/personal/name' },
  { name: 'residence', path: '/personal/residence' },
  { name: 'address', path: '/personal/address' },
  { name: 'address edit', path: '/personal/address/edit', editInfo: 'personal.addressEdit' },
  { name: 'income', path: '/financial/income' },
  { name: 'rrsp', path: '/deductions/rrsp' },
  { name: 'rrsp amount', path: '/deductions/rrsp/amount', editInfo: 'deductions.rrspClaim' },
  { name: 'marital status', path: '/personal/maritalStatus' },
  { name: 'marital status edit', path: '/personal/maritalStatus/edit', editInfo: 'personal.maritalStatusEdit'},
  { name: 'medical', path: '/deductions/medical' },
  { name: 'medical amount', path: '/deductions/medical/amount', editInfo: 'deductions.medicalExpenseClaim' },
  { name: 'political', path: '/deductions/political' },
  { name: 'political amount', path: '/deductions/political/amount', editInfo:'deductions.politicalContributionClaim' },
  { name: 'donations', path: '/deductions/donations' },
  { name: 'donations amount', path: '/deductions/donations/amount', editInfo:  'deductions.charitableDonationAmount' },
  { name: 'trillium rent', path: '/trillium/rent/amount', editInfo: 'deductions.trilliumRentAmount' },
  { name: 'trillium property tax', path: '/deductions/trillium/propertyTax/amount', editInfo: 'deductions.trilliumPropertyTaxAmount' },
  { name: 'trillium student residence', path: '/trillium/studentResidence'},
  { name: 'trillium energy amount', path: '/trillium/energy/amount', editInfo: 'deductions.trilliumEnergyAmount' },
  { name: 'trillium long term care amount', path: '/trillium/longTermCare/amount', editInfo: 'deductions.trilliumLongTermCareAmount' },
  { name: 'climate action incentive', path: '/deductions/climate-action-incentive' },
  { name: 'review', path: '/review' },
  { name: 'confirmation', path: '/confirmation' },
]

module.exports = {
  routes,
}