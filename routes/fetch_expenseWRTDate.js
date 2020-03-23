var express = require('express');

var Expense = require('../schema/expense_schema');

var nodemailer = require('nodemailer');
var json2xls = require('json2xls');
const fs = require('fs')

var Expense = require('../schema/expense_schema');
var searchExpense = express.Router();

searchExpense.get('/month-expense',(req,res,next)=>{
    var date = new Date()
    var dt = new Date(date.getFullYear(), date.getMonth() ,2).toISOString();
    var firstDateOfMonth = dt.split('T')[0]

    // Expense.aggregate([ { $match: {
        
    //         expenseCategory:{$gte:firstDateOfMonth}
        
    // } }, { $group:
    //     { _id : null, sum : { $sum: "$price" } }
    //   }])
    Expense.find(
        {  expenseCategory:{$gt:dt}}
    )
      .exec()
      .then((response)=>{
          return res.status(200).json({
              message:'total expenditure for month '+ dt + ' is',
              Amount :response
          })
      }).catch((error)=>{
          console.log(error)
      })
})



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

searchExpense.get('/sendmail',(req,res,next)=>{
    var data =""
    Expense.find()
    .exec()
    .then((response)=>{
        console.log(response)

        for(var i =0; i < response.length; i ++){
            data = data +  response[i].email + '\t' + response[i].expenseCategory + '\t' + response[i].spenton + '\t' + response[i].price + '\t' + response[i].dateOfExpense + '\n'
        }
        var header = "Email" + '\t' + 'Category' + '\t' + 'Money Spent On' + '\t' + 'Price' + '\t' + 'Expenditure Date' + '\n'
        var excelData = header + data
        fs.writeFile('Expense.xls', excelData, (err) => {
            if (err) throw err;
            console.log('File created');
         });
       
    })
    .catch((error)=>{
        console.log(error)
    })
    // let transporter = nodemailer.createTransport({
    //     service:'gmail',
    //     auth: {
    //         user: 'livesahilarora@gmail.com', // generated ethereal user
    //         pass: 'Anj@li1207' // generated ethereal password
    //     }
    // });
    // let info =  transporter.sendMail({
    //     from: '`Expense Report👻` <livesahilarora@gmail.com>', // sender address
    //     to: 'livesahilarora@gmail.com', // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>" // html body
    // });

    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // return res.status(200).json({
    //     message:'Email is sent to your Id'
    // })

})
module.exports= searchExpense;