const Joi = require('@hapi/joi');

const employeeIdValidator = Joi.object().keys({
	employee_id : Joi.string().alphanum().min(3).max(30).required()
});

const createEmployeeValidator = Joi.object().keys({
	firstname : Joi.string().required(),
	lastname : Joi.string().required(),
	email : Joi.string().required()
});

const filterByValidator = Joi.object().keys({
	sortBy : Joi.string().required(),
	limit : Joi.string().required(),
	skip : Joi.string().required()
});

module.exports = {
	employeeIdValidator,
	createEmployeeValidator,
	filterByValidator
};