import mongoose from "mongoose";

// TODO db connector must refactored

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,

}, (err) => {
    if(err) console.log(err)
    //console.log('db connected')
});
