var mongoose = require('mongoose');

var Schema =mongoose.Schema;

var expenseSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    expenseCategory:{
        type:String,
        enum:['Food','Travel','Miscellaneous',
        'Automobile','Wine','Petrol','Cng',
        'Mobile','Education','Training','saving','FD','Mutual Funds'],
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    spenton:{
        type:String,
        required:true
    },
    dateOfExpense:{
        type:Date,
        required:true
    }
})

var Expense = mongoose.model('expense',expenseSchema)
module.exports=Expense