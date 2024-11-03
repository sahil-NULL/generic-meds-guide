const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('./config.js')
const autocompleteRoute = require('./routes/autocomplete.js')
const substituteRoute = require('./routes/substitute.js')
const cors = require('cors')

const app = express();

const port = process.env.PORT || 3000;

connectDB()

app.use(cors())

app.use('/autocomplete', autocompleteRoute)
app.use('/substitute', substituteRoute)

app.listen(port, () => console.log(`It's live on http://localhost:${port}`));