const mongoose = require("mongoose");

exports.connectDatabase = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then((con) => {
      console.log(`Database Connected Successfully ${con.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
