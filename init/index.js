const initData = require("./data.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");//.. says first will back up from curent location then search for models
main().then(() => { console.log("connection successful") }).catch((err) => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
initData.data = initData.data.map((obj) => ({ ...obj, owner: "65acbf8b9258fa6f253eaf3c" }));
Listing.insertMany(initData.data).then((res) => { console.log(res) });
