const maritalStatusForm = {
    common: { 
        name: 'maritalStatus', 
        dataKey: (data && data.personal && data.personal.maritalStatus ? data.personal.maritalStatus : null) 
    }, 
    values: ['Single','Married','Separated', 'Divorced', 'Widowed']
}
module.exports = {
  maritalStatus
}
