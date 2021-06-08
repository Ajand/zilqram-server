import mongoose from "mongoose";

// TODO db connector must refactored

const DB_NAME = "ziliqist"

mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,

}, (err) => {
    if(err) console.log(err)
    console.log('db connected', DB_NAME)
});
