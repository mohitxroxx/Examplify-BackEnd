import { Request, Response, application } from "express"
import quesPaper from '../models/quesPaper'
import uploadFile from "../config/aws";
import { Buffer } from 'buffer';

interface payLoad {
    subject: string,
    code: string,
    batch: string,
    year: string,
    exam: string,
    branch: string,
    course: string,
    key: string
    qp: string,
    sol: string,
    created_by: string
}

const awsUpload = async (key: string, buffer: Buffer) : Promise<number> => {
    try {
        await Promise.all([
            uploadFile({
                name: key,
                body: buffer
            })
        ])
        return 1
    } catch (error) {
        return 0
    }
}

const getPapers = async (req: Request, res: Response) => {
    try {
        const existing = await quesPaper.findById(req.params.id)
        if (!existing)
            return res.status(404).json({ msg: "No data found corresponding to this id" })
        return res.status(200).json(existing)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error occured while fetching data' })
    }
}

const addPaper = async (req: Request, res: Response) => {
    try {
        if (!req.files)
            return res.status(403).json({ msg: "Can't proceed without uploading the file" })
        const questionPaper = req.files['qp']
        if (!questionPaper)
            return res.status(403).json({ msg: "Uploading question paper is mandatory" })
        let qpBuffer = questionPaper[0].buffer
        if (!qpBuffer)
            return res.status(403).json({ msg: "Invalid file buffer for question paper" })
        const { subject, code, batch, year, exam, branch, course, created_by }: payLoad = req.body
        if (!subject || !code || !batch || !year || !exam || !branch || !course || !created_by)
            return res.status(403).json({ error: "All the fields are required!" })
        const solution = req.files['sol']
        const qpKey = `${code}-${exam}-${batch}`
        const existing = await quesPaper.findOne({ key: qpKey })
        if (existing)
            return res.status(403).json({ error: `This question paper already exists with the ${qpKey} detail.` })
        let solLink = ''
        if (solution) {
            const solBuffer = solution[0].buffer
            const chk = await awsUpload(`${qpKey}-sol`,solBuffer)
            if(chk==0)
                return res.status(401).json({msg:"solution file uploading failed"})
            solLink=`${process.env.R2_ENDPOINT}/${qpKey}-sol`
        }
        // if (!req.file.originalname.endsWith('.pdf'))
        //     return res.status(403).json({ msg: "As of now only pdf files are allowed" })
        const chk = await awsUpload(`${qpKey}`,qpBuffer)
            if(chk==0)
                return res.status(401).json({msg:"Question paper file uploading failed"})
        const data: payLoad = {
            subject,
            code,
            batch,
            year,
            exam,
            branch,
            course,
            key: qpKey,
            qp: `${process.env.R2_ENDPOINT}/${qpKey}`,
            sol: solLink,
            created_by
        }
        const saving = await quesPaper.create(data)
        return res.status(201).json({ msg: "Data added successfully" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const editPaper = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id
        if (!_id)
            return res.status(400).json({ msg: "Object id is required to perform this request" })
        const newData: payLoad = req.body
        const existing = await quesPaper.findByIdAndUpdate(_id, newData, { new: true })
        if (!existing)
            return res.status(404).json({ msg: "No data found corresponding to this id" })
        return res.status(201).json({ msg: "Data updated successfully" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error occured while updating data' })
    }
}

const delPaper = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id
        const existing = await quesPaper.findByIdAndDelete(_id)
        if (!existing)
            return res.status(404).json({ msg: "No data found corresponding to this id" })
        return res.status(201).json({ msg: "Data deleted successfully" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error occured while deleting data' })
    }
}

const all_exports = {
    getPapers,
    addPaper,
    editPaper,
    delPaper
}

export default all_exports

