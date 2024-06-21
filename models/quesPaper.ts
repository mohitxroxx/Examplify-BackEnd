import { Schema, model } from "mongoose";

interface IQP {
    subject: string,
    code: string,
    batch: string,
    year: string,
    exam: string,
    branch: string,
    course: string,
    key: string,
    qp: string,
    sol: string,
    created_by: string,
    created_at: Date,
    updated_at: Date
}


const quesPaperSchema = new Schema<IQP>({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    batch: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        enum: ["First", "Second", "Third", "Forth"],
        required: true
    },
    exam: {
        type: String,
        required: true,
        enum: ["UT", "PUT", "ST"],
        trim: true
    },
    branch: {
        type: String,
        //can try enum but confused as there's alot of complications
        required: true,
        trim: true
    },
    course: {
        type: String,
        enum: ["BTech", "MCA", "MTech"],
        required: true
    },
    key:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    qp: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    sol: {
        type: String,
        trim: true,
        default:""
    },
    created_by: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });


export default model<IQP>("quesPaper", quesPaperSchema);