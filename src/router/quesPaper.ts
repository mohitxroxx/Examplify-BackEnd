import { Router } from "express";
import ctrl from '../controllers/quesPaper'
const app: Router = Router();


app.get('/view/:id',ctrl.getPapers)
app.post('/add',ctrl.addPaper)
app.patch('/edit/:id',ctrl.updatePaper)
app.delete('/del/:id',ctrl.delPaper)

export default app