const 
  express = require('express'),
  router  = express.Router(),
  logger  = require('../../config/winston.config'),
  employeeService  = require('./employee.service');

// employee api routes.
router.get('/:employee_id', get);
router.get('/:sortBy/:limit-:skip', getFiltered);
router.get('/', getAll);
router.post('/', create);
router.patch('/:employee_id', update);
router.delete('/:employee_id', _delete);

// export employee api module.
module.exports = router;

function get (req, res, next) {
  logger.debug('[Employee Route] get()');
  employeeService.get(req.params.ref_id)
  .then(employee => employee ? res.status(200).json(employee) : res.status(404).json({ message : "employees not found." }))
  .catch(err => {
    logger.debug(`[Employee Route] get() ... ${err}`);
    next(err)
  });
}

function getFiltered (req, res, next) {
  logger.debug('[Employee Route] getFiltered()');
  employeeService.getFiltered(req.params.sortBy, req.params.limit, req.params.skip)
  .then(employeeArray => employeeArray ? res.status(200).json(employeeArray) : res.status(404).json({ message : "employees not found." }))
  .catch(err => {
    logger.debug(`[Employee Route] getFiltered() ... ${err}`);
    next(err)
  });
}

function getAll (req, res, next) {
  logger.debug('[Employee Route] getAll()');
  employeeService.getAll()
  .then(employeeArray => employeeArray ? res.status(200).json(employeeArray) : res.status(404).json({ message : "employees not found." }))
  .catch(err => {
    logger.debug(`[Employee Route] getAll() ... ${err}`);
    next(err)
  });
}

function create (req, res, next) {
  logger.debug('[Employee Route] create()');
  employeeService.create(req.body)
  .then(employee => employee ? res.status(201).json(employee) : res.status(404).json({ message : "employee was not created." })) 
  .catch(err => {
    logger.debug(`[Employee Route] create() ... ${err}`);
    next(err)
  });
}

function update (req, res, next) {
  logger.debug('[Employee Route] update()');
  employeeService.update(req.params.ref_id, req.body)
  .then(employee =>  employee ? res.status(204).json(employee) : res.status(404).json({ message : "employee was not updated." }))
  .catch(err => {
    logger.debug(`[Employee Route] update() ... ${err}`);
    next(err)
  });
}

function _delete (req, res, next) {
  logger.debug('[Employee Route] _delete()');
  employeeService._delete(req.params.ref_id)
  .then(() => res.status(204))
  .catch(err => {
    logger.debug(`[Employee Route] _delete() ... ${err}`);
    next(err)
  });
}