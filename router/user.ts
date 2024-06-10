import { Router } from "express";
import ctrl from '../controllers/userAuth'
const app: Router = Router();


app.get('/dashboard',ctrl.getUser)
app.post('/register',ctrl.register)
app.post('/login',ctrl.login)
app.patch('/changepass',ctrl.forgotPass)

export default app