import express,{Request,Response} from 'express'
import cookieparser from 'cookie-parser'
import cors from "cors";
import connectDB  from './config/db'
import QpRoutes from './router/quesPaper'
import AuthRoutes from './router/user'

connectDB()
const app=express()
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieparser())

app.get('/',(req:Request,res:Response):Response=>{
    return res.send("Server is Live!!🚀")
})

app.use('/api',QpRoutes)
app.use('/auth',AuthRoutes)

const port: number = Number(process.env.PORT)

app.listen(port,()=>{
    console.log(`Server is up and Running at http://localhost:${port}`)
})