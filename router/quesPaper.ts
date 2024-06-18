import { Router } from "express";
import ctrl from '../controllers/quesPaper'
const app: Router = Router();
import multer, { memoryStorage } from "multer";
const upload = multer({ storage: memoryStorage() });

app.get('/view', ctrl.getPapers)

app.post('/add',upload.fields([
    { name: "qp", maxCount: 1 },
    { name: "sol", maxCount: 1 }]),
    ctrl.addPaper)

app.patch('/edit/:id', ctrl.editPaper)

app.delete('/del/:id', ctrl.delPaper)

export default app