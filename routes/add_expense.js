var express = require('express');
var Expense = require('../schema/expense_schema');


var expenseRoutes = express.Router()

//get categories first 
expenseRoutes.get('/getcategories',(req,res,next)=>{
    let values = Expense.schema.path('expenseCategory').enumValues

    return res.status(200).json({
        response:values
    })
})

//this will add your expenses to the database

expenseRoutes.post('/addexpense',(req,res,next)=>{
    // let email = req.query.email; 
    // let category= req.query.category
    // let price = req.query.price
    // let spenton = req.query.spenton
    // let date  = Date.now()

     //let email = req.body.email; 
     let email='sahilarora@live.com'
    let category= req.body.category
    let price = req.body.price
    let spenton = req.body.spenton
    let date  = Date.now()
    console.log(req.body,'data from angular')

    //making the instance of schema to save in the databse
    var exp = new Expense({
        email:email,
        expenseCategory :category,
        price:price,
        spenton:spenton,
        dateOfExpense:date
    })
    // now save the data in mongoose database
    exp.save((err,response)=>{
        if(err){
            console.log(err)
            return res.status(500).json({
                message:'Not able to save the database',
                error:err
            })
        }
        else{
            return res.status(200).json({
                message :'data saved successfully, spent wisely',
                result:response
             })
        }
    })
    

})

//this function will retrieve all your expenses
expenseRoutes.get('/get-expense-list',(req,res,next)=>{
   Expense.find()
   .exec()
   .then((result)=>{
     
        return res.status(200).json({
            message:'Please verify your expenses from the below list',
            response:result
        }) 
   }).catch((err)=>{
    return res.status(500).json({
        message:'error while fetching the list of expenses',
        error:err
    })
   })
})

//this function will delete the particular expense
expenseRoutes.post('/delete-record',(req,res,next)=>{
    let id = req.body.id
    console.log(id)
    Expense.findByIdAndRemove(id)
    .then((response)=>{
        return res.status(200).json({
            message:'Record deleted successfully!!',
            result:response

        })
    }).catch((error)=>{
        return res.status(500).json({
            error:error,
            message:'error while deleting the record'
        })
    })
})

//this function will update the record for your expenses

expenseRoutes.post('/update-expense',(req,res,next)=>{
    let id = req.body._id
   console.log(id,'update record id')
   console.log(req.body , 'data from ui')
    Expense.findByIdAndUpdate(id,{
        email:'sahilarora@live.com',
        expenseCategory: req.body.category,
         price : req.body.price,
        spenton : req.body.spenton,
        dateOfExpense  : Date.now()
    },{new:true})
    .then((response)=>{
        if(!response){
            return res.status(404).json({
                message:'Not able to fetch the record'
            })
        }
        else{
            return res.status(200).json({
                message:'record updated successfully',
                result:response
            })
        }
    })
})
module.exports = expenseRoutes



