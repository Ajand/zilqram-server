import mongoose from "mongoose";

// TODO db connector must refactored

mongoose.connect("mongodb://localhost:27017/game", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
    if(err) console.log(err)
    //console.log('db connected')
});
