const answerInfo = [
  { 
    'sectionTitle': 'Personal Information',
    'sectionRows': [
      {
        'text': 'Name',
        'infoPath': ['personal.firstName', 'personal.lastName'],
        'urlPath': '/personal/name',
      },
      {
        'text': 'Date of Birth',
        'infoPath': ['personal.dateOfBirth'],
      },
      {
        'text': 'Province of Residence',
        'infoPath': ['personal.address.province'],
        'urlPath': '/personal/residence',
      },
      {
        'text': 'Mailing Address',
        'infoPath': ['personal.address'],
        'urlPath': '/personal/address',
      },
      {
        'text': 'Income Information',
        'infoPath': ['financial.incomeConfirmed'],
        'urlPath': '/financial/income',
      },
      {
        'text': 'Marital Status',
        'infoPath': ['personal.maritalStatus'],
        'urlPath': '/personal/maritalStatus',
      },
    ],
  },
  {
    'sectionTitle': 'Tax Claims',
    'sectionRows': [
      {
        'text': 'Did You Contribute to an RRSP?',
        'infoPath': ['deductions.rrspClaim'],
        'urlPath': '/deductions/rrsp',
      },
      {
        'text': 'RRSP Contribution',
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
        'text': 'Did you contribute to a political party',
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
        'text': 'Did you Donate to a Charity',
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
    'sectionTitle': 'Tax Benefits',
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
        'text': 'Student residence',
        'infoPath': ['deductions.trilliumStudentResidence'],
        'urlPath': '/trillium/studentResidence',
      },
      {
        'text': 'Did you live on a reserve?',
        'infoPath': ['deductions.trilliumEnergyReserveClaim'],
        'urlPath': '/trillium/energy/reserve',
      },
      {
        'text': 'Did you pay home energy costs on a reserve?',
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
        'text': 'Public long-term care home',
        'infoPath': ['deductions.trilliumLongTermCareClaim'],
        'urlPath': '/trillium/longTermCare',
      },
      {
        'text': 'Acommodation cost',
        'infoPath': ['deductions.trilliumLongTermCareAmount'],
        'urlPath': '/trillium/longTermCare/amount',
        'displayIf': 'deductions.trilliumLongTermCareClaim',
      },
      {
        'text': 'Small or rural community',
        'infoPath': ['deductions.climateActionIncentiveIsRural'],
        'urlPath': '/deductions/climate-action-incentive',
      },
    ],
  },
]

module.exports = {
  answerInfo,
}