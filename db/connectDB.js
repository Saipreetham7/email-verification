const mongoose = require('mongoose');

//connect to database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser : true,
}).then(() => console.log("DB Connection Established"))
.catch(err=>console.log("DB Connection error ", err));