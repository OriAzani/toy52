const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors') 
const path = require('path')
const cookieParser = require('cookie-parser');

const app = express()
// const http = require('http').createServer(app);

const toyService = require('./services/toy.service');
const port = process.env.PORT || 3030;

const VIEW_DIR = `${__dirname}/public`;

// Express Config
app.use(cors());  
app.use(bodyParser.json())
app.use(cookieParser())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    };
    app.use(cors(corsOptions));
}



const toyRoutes = require('./api/toy/toy.routes')

// routes
app.use('/api/toy', toyRoutes)


app.listen(port,
    () => console.log(`Example app listening at http://localhost:${port}`))