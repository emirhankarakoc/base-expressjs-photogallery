const mongoose = require('mongoose');

const victimdatas = new mongoose.Schema({
    data:{
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: false,
        default: () => Date.now(),  // Fonksiyonu burada kullanarak hatayı giderin
    },
    username:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("VictimDatas", victimdatas);
