const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/dbConnection');

connectDb()
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles:true
}))


//Routes
app.use('/user',require('./routers/userRouter'));
app.use('/api',require('./routers/categoryRouter'));
app.use('/api',require('./routers/productRouter'));
app.use('/api',require('./routers/upload'));




const PORT = process.env.PORT || 9090
app.listen(PORT, ()=>{
    console.log('Servidor corriendo en el puerto:', PORT)
});

