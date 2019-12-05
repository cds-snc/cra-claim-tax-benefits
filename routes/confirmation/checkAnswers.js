const answerInfo = [
  {
    sectionTitle: 'Personal information',
    sectionRows: [
      {
        text: 'Name',
        infoPath: ['personal.firstName', 'personal.lastName'],
        urlPath: '/personal/name',
      },
      {
        text: 'Date of birth',
        infoPath: ['personal.dateOfBirth'],
      },
      {
        text: 'Province',
        infoPath: ['personal.address.province'],
        urlPath: '/personal/residence',
      },
      {
        text: 'Mailing address',
        infoPath: ['personal.address'],
        urlPath: '/personal/address',
      },
      {
        text: 'Is your income information correct?',
        infoPath: ['financial.incomeConfirmed'],
        urlPath: '/financial/income',
        displayIf: 'login.securityQuestion',
      },
      {
        text: 'Marital status',
        infoPath: ['personal.maritalStatus'],
        urlPath: '/personal/maritalStatus',
      },
    ],
  },
  {
    sectionTitle: 'Tax benefits',
    sectionRows: [
      {
        text: 'Did you pay rent?',
        infoPath: ['deductions.trilliumRentClaim'],
        urlPath: '/trillium/rent',
      },
      {
        text: 'Rent paid',
        infoPath: ['deductions.trilliumRentAmount'],
        urlPath: '/trillium/rent/amount',
        displayIf: 'deductions.trilliumRentClaim',
      },
      {
        text: 'Did you pay property tax?',
        infoPath: ['deductions.trilliumPropertyTaxClaim'],
        urlPath: '/trillium/propertyTax',
      },
      {
        text: 'Property tax paid',
        infoPath: ['deductions.trilliumPropertyTaxAmount'],
        urlPath: '/trillium/propertyTax/amount',
        displayIf: 'deductions.trilliumPropertyTaxClaim',
      },
      {
        text: 'Did you live on a reserve?',
        infoPath: ['deductions.trilliumEnergyReserveClaim'],
        urlPath: '/trillium/energy/reserve',
      },
      {
        text: 'Did you have home energy costs on a reserve?',
        infoPath: ['deductions.trilliumEnergyCostClaim'],
        urlPath: '/trillium/energy/cost',
        displayIf: 'deductions.trilliumEnergyReserveClaim',
      },
      {
        text: 'Yearly energy costs on a reserve',
        infoPath: ['deductions.trilliumEnergyAmount'],
        urlPath: '/trillium/energy/cost/amount',
        displayIf: 'deductions.trilliumEnergyCostClaim',
      },
      {
        text: 'Did you live in a long-term care home?',
        infoPath: ['deductions.trilliumLongTermCareClaim'],
        urlPath: '/trillium/longTermCare',
      },
      {
        text: 'Public or non-profit long-term care home?',
        infoPath: ['deductions.trilliumLongTermCareTypeClaim'],
        urlPath: '/trillium/longTermCare/type',
        displayIf: 'deductions.trilliumLongTermCareClaim',
      },
      {
        text: 'Long-term care costs',
        infoPath: ['deductions.trilliumLongTermCareAmount'],
        urlPath: '/trillium/longTermCare/type/amount',
        displayIf: 'deductions.trilliumLongTermCareTypeClaim',
      },
      {
        text: 'Did you live in a small and rural community?',
        infoPath: ['deductions.climateActionIncentiveIsRural'],
        urlPath: '/deductions/climate-action-incentive',
      },
    ],
  },
  {
    sectionTitle: 'Voter Registration',
    sectionRows: [
      {
        text: 'Registered to vote',
        infoPath: ['vote.confirmOptIn'],
        urlPath: '/vote/optIn',
      },
      {
        text: 'Canadian citizen',
        infoPath: ['vote.voterCitizen'],
        urlPath: '/vote/confirmRegistration',
        displayIf: 'vote.confirmOptIn',
      },
      {
        text: 'Elections Canada will update voter record',
        infoPath: ['vote.voterConsent'],
        urlPath: '/vote/confirmRegistration',
        displayIf: 'vote.confirmOptIn',
      },
    ],
  },
]

module.exports = {
  answerInfo,
}
