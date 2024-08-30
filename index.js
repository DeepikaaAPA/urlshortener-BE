const app = require("./app");
const { MONGODB_URI, PORT } = require("./utils/config");

const mongoose = require("mongoose");
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to db");
    app.listen(PORT, () => console.log("Sever listening on port" + PORT));
  })
  .catch((err) => console.log(err));
