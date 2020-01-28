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
        text: 'Mailing address',
        infoPath: ['personal.address'],
        urlPath: '/personal/address',
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
        text: 'Did you use public transit in 2019?',
        infoPath: ['deductions.seniorTransitClaim'],
        urlPath: '/deductions/senior-public-transit',
        displayIf: 'deductions.seniorTransitClaim',
      },
      {
        text: 'Total amount spent on public transit',
        infoPath: ['deductions.seniorTransitAmount'],
        urlPath: '/deductions/senior-public-transit/amount',
        displayIf: 'deductions.seniorTransitClaim',
      },
      {
        text: 'Did you live in a small and rural community?',
        infoPath: ['deductions.climateActionIncentiveIsRural'],
        urlPath: '/deductions/climate-action-incentive',
      },
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
        text: 'Long-term care room and board costs',
        infoPath: ['deductions.trilliumLongTermCareRoomAndBoardAmount'],
        urlPath: '/trillium/longTermCare/type/roomAndBoard',
        displayIf: 'deductions.trilliumLongTermCareCost',
      },
      {
        text: 'Long-term care costs',
        infoPath: ['deductions.trilliumLongTermCareAmount'],
        urlPath: '/trillium/longTermCare/type/amount',
        displayIf: 'deductions.trilliumLongTermCareAmountIsFull',
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
    ],
  },
  {
    sectionTitle: 'Voter registration',
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
  {
    sectionTitle: 'Income',
    sectionRows: [
      {
        text: 'Do you confirm that your income was less than $12,070?',
        infoPath: ['financial.incomeConfirmed'],
        urlPath: '/confirm-income',
      },
    ],
  },
]

module.exports = {
  answerInfo,
}
