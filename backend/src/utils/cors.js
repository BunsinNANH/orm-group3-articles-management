const app = require('express');
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', "*");
//     res.setHeader('Access-Control-Allow-Headers', true);
//     // res.header('Access-Control-Allow-Credentials', true);
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     next();
// });

app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
})

module.exports = app;