var mongoose = require('mongoose');

const {MONGO_URI} = process.env

exports.connect = () => {
mongoose.connect(MONGO_URI)
.then(()=> {
    console.log(`DataBase Connected...!`);
})
.catch((error) => {
    console.log(`Database Error`);
    console.log(error);
    process.exit(1)
})
}