const reviewSchema = {
  review: {
    isIn: {
      errorMessage: 'errors.review',
      options: [['review']],
    },
  },
}

module.exports = {
  reviewSchema
}