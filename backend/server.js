require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const authRoutes = require('./routes/authRoutes.js')
const taskRoutes = require('./routes/taskRoutes.js')

app.use(express.json());

const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGODB_URL

app.use('/api/auth',authRoutes);
app.use('/api/task',taskRoutes)

async function mongooseConnect() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error in mongodb connection!', error);
    process.exit(1);
  }
}

mongooseConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});



