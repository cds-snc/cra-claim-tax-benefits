const answerInfo = [
  { 
    'sectionTitle': 'Personal information',
    'sectionRows': [
      {
        'text': 'Name',
        'infoPath': ['personal.firstName', 'personal.lastName'],
        'urlPath': '/personal/name',
      },
      {
        'text': 'Date of birth',
        'infoPath': ['personal.dateOfBirth'],
      },
      {
        'text': 'Province',
        'infoPath': ['personal.address.province'],
        'urlPath': '/personal/residence',
      },
      {
        'text': 'Mailing address',
        'infoPath': ['personal.address'],
        'urlPath': '/personal/address',
      },
      {
        'text': 'Is your income information correct?',
        'infoPath': ['financial.incomeConfirmed'],
        'urlPath': '/financial/income',
      },
      {
        'text': 'Marital status',
        'infoPath': ['personal.maritalStatus'],
        'urlPath': '/personal/maritalStatus',
      },
    ],
  },
  {
    'sectionTitle': 'Tax claims',
    'sectionRows': [
      {
        'text': 'Did you contribute to an RRSP?',
        'infoPath': ['deductions.rrspClaim'],
        'urlPath': '/deductions/rrsp',
      },
      {
        'text': 'RRSP contribution',
        'infoPath': ['deductions.rrspAmount.amount'],
        'urlPath': '/deductions/rrsp/amount',
        'displayIf': 'deductions.rrspClaim',
      },
      {
        'text': 'Do you have medical expenses?',
        'infoPath': ['deductions.medicalExpenseClaim'],
        'urlPath': '/deductions/medical',
      },
      {
        'text': 'Total medical expense cost',
        'infoPath': ['deductions.medicalExpenseClaimAmount.amount'],
        'urlPath': '/deductions/medical/amount',
        'displayIf': 'deductions.medicalExpenseClaim',
      },
      {
        'text': 'Did you contribute to a political party?',
        'infoPath': ['deductions.politicalContributionClaim'],
        'urlPath': '/deductions/political',
      },
      {
        'text': 'Amount contributed',
        'infoPath': ['deductions.politicalFederalAmount', 'deductions.politicalProvincialAmount'],
        'urlPath': '/deductions/political/amount',
        'displayIf': 'deductions.politicalContributionClaim',
      },
      {
        'text': 'Did you donate to a charity?',
        'infoPath': ['deductions.charitableDonationClaim'],
        'urlPath': '/deductions/donations',
      },
      {
        'text': 'Amount donated',
        'infoPath': ['deductions.charitableDonationAmount'],
        'urlPath': '/deductions/donations/amount',
        'displayIf': 'deductions.charitableDonationClaim',
      },
    ],
  },
  {
    'sectionTitle': 'Tax benefits',
    'sectionRows': [
      {
        'text': 'Did you pay rent?',
        'infoPath': ['deductions.trilliumRentClaim'],
        'urlPath': '/trillium/rent',
      },
      {
        'text': 'Rent paid',
        'infoPath': ['deductions.trilliumRentAmount'],
        'urlPath': '/trillium/rent/amount',
        'displayIf': 'deductions.trilliumRentClaim',
      },
      {
        'text': 'Did you live in a student residence?',
        'infoPath': ['deductions.trilliumStudentResidence'],
        'urlPath': '/trillium/studentResidence',
      },
      {
        'text': 'Did you live on a reserve?',
        'infoPath': ['deductions.trilliumEnergyReserveClaim'],
        'urlPath': '/trillium/energy/reserve',
      },
      {
        'text': 'Did you have home energy costs on a reserve?',
        'infoPath': ['deductions.trilliumEnergyCostClaim'],
        'urlPath': '/trillium/energy/cost',
        'displayIf': 'deductions.trilliumEnergyReserveClaim',
      },
      {
        'text': 'Yearly energy costs on a reserve',
        'infoPath': ['deductions.trilliumEnergyAmount'],
        'urlPath': '/trillium/energy/cost/amount',
        'displayIf': 'deductions.trilliumEnergyCostClaim',
      },
      {
        'text': 'Did you live in a long-term care home?',
        'infoPath': ['deductions.trilliumLongTermCareClaim'],
        'urlPath': '/trillium/longTermCare',
      },
      {
        'text': 'Was it managed by a charity, city, First Nations or similar organization?',
        'displayIf': 'deductions.trilliumLongTermCareClaim',
      },
      {
        'text': 'Long-term care costs',
        'infoPath': ['deductions.trilliumLongTermCareAmount'],
        'urlPath': '/trillium/longTermCare/amount',
        'displayIf': 'deductions.trilliumLongTermCareClaim',
      },
      {
        'text': 'Did you live in a small and rural community?',
        'infoPath': ['deductions.climateActionIncentiveIsRural'],
        'urlPath': '/deductions/climate-action-incentive',
      },
    ],
  },
]

module.exports = {
  answerInfo,
}