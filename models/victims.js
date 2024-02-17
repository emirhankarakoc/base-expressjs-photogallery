const mongoose = require('mongoose');

const victimSchema = new mongoose.Schema({
    desktopName: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: false,
        default: () => Date.now(),  // Fonksiyonu burada kullanarak hatayı giderin
    }
});

module.exports = mongoose.model("Victim", victimSchema);
