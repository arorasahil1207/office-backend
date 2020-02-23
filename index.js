var express = require('express');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var config = require('./database/database');
var userRoutes = require('./routes/user_routes');
var addExpenseRoute = require('./routes/add_expense');
var searchExpense = require('./routes/fetch_expenseWRTDate');
var cors = require('cors');

var app =express();

//handling middleware like cors or body-parser json..
app.use(cors())
app.use(bodyParser.json())
//importing user routes here 
app.use(userRoutes);
//importing expense routes here 
app.use(addExpenseRoute)
//search data based on dates
app.use(searchExpense)

//connect with mongoose here...
mongoose.connect(config.database).then(()=>{
    console.log('connection eastablished..')
})

mongoose.connection.on('open',()=>{
    console.log('connection eastablished successfully')
}).catch((err)=>{
    console.log('error while eastbalishing the connection',err)
})

// app is running on the below port..
var ports = process.env.PORT || 3000;

app.listen(ports,()=>{
    console.log('app is running on',ports)
})
