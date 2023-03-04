const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require("./utils/config")
const authRoutes = require('./routes/authRoutes');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', authRoutes);

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
});
