import { Request, Response } from "express"
import quesPaper from '../models/quesPaper'

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
        const { subject, code, batch, year, exam, branch, course, qp, sol, created_by } = req.body
        if (!subject || !code || !batch || !year || !exam || !branch || !course || !qp || !created_by)
            return res.status(403).json({ error: "All the fields are required!" })
        const existing = await quesPaper.findOne({ qp })
        if (existing)
            return res.status(403).json({ error: `This question paper already exists with the subject name ${existing.subject}` })
        const data = {
            ...req.body
        }
        const saving = await quesPaper.create(data)
        return res.status(201).json({ msg: "Data added successfully" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error occured while fetching data' })
    }
}

const editPaper = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id
        if (!_id)
            return res.status(400).json({ msg: "Object id is required to perform this request" })
        const existing = await quesPaper.findByIdAndUpdate(_id, req.body, { new: true })
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

