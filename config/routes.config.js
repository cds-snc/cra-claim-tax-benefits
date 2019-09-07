//take edit pages into consideration, skip auth pages
//list our routes in the flow order in the app
const routes = [
  { name: "start", path: "/start" },
  { name: "login code", path: "/login/code" },
  { name: "login sin", path: "/login/sin" },
  { name: "login date of birth", path: "/login/dob" },
  { name: "name", path: "/personal/name" },
  { name: "residence", path: "/residence" },
  { name: "address", path: "/personal/address" },
  { name: "address edit", path: "/personal/address/edit" },
  { name: "income", path: "/financial/income" },
  { name: "rrsp", path: "/deductions/rrsp" },
  { name: "rrsp amount", path: "/deductions/rrsp/amount" },
  { name: "marital status", path: "/personal/maritalStatus" },
  { name: "marital status edit", path: "/personal/maritalStatus/edit" },
  { name: "medical", path: "/deductions/medical" },
  { name: "medical amount", path: "/deductions/medical/amount" },
  { name: "political", path: "/deductions/political" },
  { name: "political amount", path: "/deductions/political/amount" },
  { name: "donations", path: "/deductions/donations" },
  { name: "donations amount", path: "/deductions/donations/amount" },
  { name: "trillium rent", path: "/trillium/rent/amount" },
  { name: "trillium property tax", path: "/deductions/trillium/propertyTax/amount" },
  { name: "trillium student residence", path: "/trillium/studentResidence"},
  { name: "trillium energy amount", path: "/trillium/energy/amount" },
  { name: "trillium long term care amount", path: "/trillium/longTermCare/amount" },
  { name: "climate action incentive", path: "/deductions/climate-action-incentive" },

  { name: "review", path: "/review" },
  { name: "confirmation", path: "/confirmation" },
];

module.exports = {
  routes
};