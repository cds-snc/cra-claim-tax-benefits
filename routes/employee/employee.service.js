// import environment variables.
require('dotenv').config();

const 
  MongoClient = require('mongodb').MongoClient,
  EmployeeModel = require('./employee.model'),
  logger = require('../../config/winston.config'),
  uniqid = require('uniqid'),
  Joi = require('@hapi/joi'),
  { employeeIdValidator, createEmployeeValidator } = require('../employee/employee.validator');

// Connection URL
const url = process.env.mongoclient_url;

// Database Name
const dbName = process.env.mongoclient_db_name;

let client;

module.exports = {
  get,
  getFiltered,
  getAll,
  create,
  update,
  _delete
};
  
async function get (param) {
  
  logger.debug('[Employee Service] get()');

  let validationResult = Joi.validate({employee_id : param}, employeeIdValidator);

  logger.debug(`[Employee Service] get() validationResult : ${validationResult}`);
  
  if (validationResult != null) throw "validation error";

  let document;

  try {
    client = await MongoClient.connect(url, {useNewUrlParser: true});
    document = await (client.db(dbName)).collection('employee').findOne({employee_id : param});
  } 
  catch (err) {
    logger.debug(`[Mongo Client] : ${err}`);
    throw err;
  } 

  client.close();
  return document;
}

async function getFiltered (sortBy, limit, skip) {

  logger.debug('[Employee Service] getFiltered()');

  let validationResult = Joi.validate({
    sortBy : sortBy,
    limit: limit,
    skip : skip
  }, 
  filterByValidator);

  logger.debug(`[Employee Service] get() validationResult : ${validationResult}`);
  
  if (validationResult != null) throw "validation error";
  
  let document;

  try {
    client = await MongoClient.connect(url, {useNewUrlParser: true});
    document = await (client.db(dbName)).collection('employee').find({}, 
      {
        "limit" : parseInt(limit),
        "skip"  : parseInt(skip),
        "sort"  : sortBy
      }
    ).toArray();
  } 
  catch (err) {
    logger.debug(`[Mongo Client] : ${err}`);
    throw err;
  } 

  client.close();
  return document;	
}

async function getAll () {

  logger.debug('[Employee Service] getAll()');

  let document;

  try {
    client = await MongoClient.connect(url, {useNewUrlParser: true});
    document = await (client.db(dbName)).collection('employee').find({}).toArray();
  } 
  catch (err) {
    logger.debug(`[Mongo Client] : ${err}`);
    throw err;
  } 
    
  client.close();
  return document;
}

async function create (params) {

  logger.debug('[Employee Service] create()');

  let validationResult = Joi.validate({ 
    firstname : params.firstname, 
    lastname : params.lastname,
    email : params.email
  }, 
  createEmployeeValidator);

  logger.debug(validationResult);

  if (validationResult != null) throw "validation error";

  let document;

  try {
    client = await MongoClient.connect(url, {useNewUrlParser: true});

    let employee = new EmployeeModel();

    employee.firstname = params.firstname;
    employee.lastname = params.lastname;
    employee.email = params.email;
    employee.employee_id = uniqid();

    document = await (client.db(dbName)).collection('employee').insertOne(employee);
  } 
  catch (err) {
    logger.debug(`[Mongo Client] : ${err}`);
    throw err;
  } 
    
  client.close();
  return document.ops;
}

async function update (param, params) {

  logger.debug('[Employee Service] update()');

  let validationResult = Joi.validate({employee_id : param}, employeeIdValidator);

  logger.debug(`[Employee Service] update() validationResult : ${validationResult}`);

  if (validationResult != null || params === undefined) throw "validation error";

  let document;

  try {
    client = await MongoClient.connect(url, {useNewUrlParser: true});

    document = await (client.db(dbName)).collection('employee').updateOne(
      {"employee_id" : param}, 
      {
        $set : {
          firstname : params.firstname,
          lastname : params.lastname,
          email : params.email
        }
      },
      {upsert: true}
    );
  } 
  catch (err) {
    logger.debug(`[Mongo Client] : ${err}`);
    throw err;
  } 

  client.close();
  return document;
}

async function _delete (param) {

  logger.debug('[Employee Service] _delete()');

  let validationResult = Joi.validate({employee_id : param}, employeeIdValidator);

  logger.debug(`[Employee Service] _delete() validationResult : ${validationResult}`);
  
  if (validationResult != null) throw "validation error";

  let document;
  
  try {
    client = await MongoClient.connect(url, {useNewUrlParser: true});
    document = await (client.db(dbName)).collection('employee').deleteOne({employee_id : param});
  } 
  catch (err) {
    logger.debug(`[Mongo Client] : ${err}`);
    throw err;
  } 

  client.close();
  return document;
}
