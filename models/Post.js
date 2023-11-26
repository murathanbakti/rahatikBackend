const mongoose = require("mongoose");

const SecondChildSchema = mongoose.Schema({
    secondChildAcountNumber: {
        type: String,
        required: true,
        unique: true,
    },
    secondChildDebpt: {
        type: Number,
        required: true,
    }
});

const FirstChildSchema = mongoose.Schema({
    firstChildAcountNumber: {
        type: String,
        required: true,
        unique: true,
    },
    firstChildDebpt: {
        type: Number,
        required: true,
    },
    secondChild: [SecondChildSchema]
});

const AmountSchema = mongoose.Schema({
    acountNumber: {
        type: String,
        required: true,
        unique: true,
    },
    debt: {
        type: Number,
        required: true,
    },
    childAcount: [FirstChildSchema]
});

module.exports = mongoose.model("Post", AmountSchema);
