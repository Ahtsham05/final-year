import app from './src/app.js';
import dotenv from 'dotenv';
import connectDB from './src/db/index.js';

dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 3000;

connectDB().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((err)=>{
  console.log("Connection Failed ! ",err)
})

app.get('/',(req,res)=>{
    res.send("Welcome")
})
