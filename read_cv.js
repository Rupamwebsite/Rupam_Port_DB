const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('Public/Rupam Mandal exp cv.pdf');

pdf(dataBuffer).then(function (data) {
    console.log("-----PDF START-----");
    console.log(data.text);
    console.log("-----PDF END-----");
}).catch(err => {
    console.error("Error parsing PDF:", err);
});
