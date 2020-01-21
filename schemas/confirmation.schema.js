const reviewSchema = {
  review: {
    isIn: {
      errorMessage: 'errors.review',
      options: [['review']],
    },
  },
}

const confirmIncomeSchema = {
  confirmIncome: {
    isIn: {
      errorMessage: 'errors.confirmIncome',
      options: [['confirmIncome']],
    },
  },
}

module.exports = {
  reviewSchema,
  confirmIncomeSchema,
}
