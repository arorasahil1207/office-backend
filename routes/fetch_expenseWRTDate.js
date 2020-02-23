var express = require('express');

var Expense = require('../schema/expense_schema');

var searchExpense = express.Router();

searchExpense.post('/find-expense',(req,res,next)=>{
    let fromdate = req.body.fromDate
    let enddate = req.body.endDate

    console.log(req.body)
    console.log(fromdate,'this is from date')
    console.log(enddate ,'this is enddate')
    Expense.find({

        "dateOfExpense":{
            "$gte":new Date(fromdate),
            "$lte":new Date(enddate)
        }
    })
    .exec()
    .then((result)=>{
        return res.status(200).json({
            message:'Found the below data for the mentioned date',
            response:result
        })
    })
    .catch((error)=>{
        return res.status(500).json({
            message:'Not able to fetch the record',
            error:error
        })
    })
})
module.exports= searchExpense;