const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const app = require('./app');

//* Load env
dotenv.config();

//* Database connection
(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Successfully connected to MongoDB database : ${conn.connection.host}`);
  } catch (err) {
    //?error catch
    console.log(err);
    process.exit(1);
  }
})();


const port = +process.env.PORT || 3001;

const productionMode = process.env.NODE_ENV === 'development'
app.listen(port, () => {
  console.log(`Server is running in ${productionMode?"production":"development"} mode on port ${port}`);
});
