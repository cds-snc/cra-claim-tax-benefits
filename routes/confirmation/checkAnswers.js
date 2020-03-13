const answerInfo = [
  {
    sectionTitle: 'Personal information',
    sectionRows: [
      {
        text: 'What is your name?',
        infoPath: ['personal.firstName', 'personal.lastName'],
        urlPath: '/personal/name',
      },
      {
        text: 'What is your date of birth?',
        infoPath: ['personal.dateOfBirth'],
      },
      {
        text: 'What is your mailing address?',
        infoPath: ['personal.address'],
        urlPath: '/personal/address',
      },
      {
        text: 'What is your marital status?',
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
        text: 'What total amount did you spend on public transit in 2019?',
        infoPath: ['deductions.seniorTransitAmount'],
        urlPath: '/deductions/senior-public-transit/amount',
        displayIf: 'deductions.seniorTransitClaim',
      },
      {
        text: 'Did you live in a census metropolitan area?',
        infoPath: ['deductions.climateActionIncentiveIsRural'],
        urlPath: '/deductions/climate-action-incentive',
      },
      {
        text: 'Did you pay rent?',
        infoPath: ['deductions.trilliumRentClaim'],
        urlPath: '/trillium/rent',
      },
      {
        text: 'How much total rent did you pay for your principal residence in 2019?',
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
        text: 'How much total property tax did you pay for your principal residence in 2019?',
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
        text: 'Was it a public or non-profit long-term care home?',
        infoPath: ['deductions.trilliumLongTermCareTypeClaim'],
        urlPath: '/trillium/longTermCare/type',
        displayIf: 'deductions.trilliumLongTermCareClaim',
      },
      {
        text: 'What were your total long-term care room and board costs in 2019?',
        infoPath: ['deductions.trilliumLongTermCareRoomAndBoardAmount'],
        urlPath: '/trillium/longTermCare/type/roomAndBoard',
        displayIf: 'deductions.trilliumLongTermCareCost',
      },
      {
        text: 'What were your total long-term care costs in 2019?',
        infoPath: ['deductions.trilliumLongTermCareAmount'],
        urlPath: '/trillium/longTermCare/type/amount',
        displayIf: 'deductions.trilliumLongTermCareAmountIsFull',
      },
      {
        text:
          'At any time in 2019, was your principal residence on reserve land under the Indian Act?',
        infoPath: ['deductions.trilliumEnergyReserveClaim'],
        urlPath: '/trillium/energy/reserve',
      },
      {
        text: 'Did you have home energy costs on reserve?',
        infoPath: ['deductions.trilliumEnergyCostClaim'],
        urlPath: '/trillium/energy/cost',
        displayIf: 'deductions.trilliumEnergyReserveClaim',
      },
      {
        text: 'How much were your total 2019 home energy costs on reserve?',
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
        text: 'Do you want to vote?',
        infoPath: ['vote.confirmOptIn'],
        urlPath: '/vote/optIn',
      },
      {
        text: 'Are you a Canadian citizen?',
        infoPath: ['vote.citizen'],
        urlPath: '/vote/citizen',
        displayIf: 'vote.confirmOptIn',
      },
      {
        text: 'Do you allow CRA to give your information to Elections Canada?',
        infoPath: ['vote.register'],
        urlPath: '/vote/register',
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
