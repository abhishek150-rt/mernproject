const mongoose = require("mongoose");
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connection Successful"))
    .catch((err) => console.log(err));