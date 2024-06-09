import { Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";


interface IUser {
    name: string,
    email: string,
    password: string,
    batch: string,
    isVerified: boolean,
    isArchived: boolean,
    contact: string,
    created_at: string,
    updated_at: string,
    match: (password: string) => Promise<boolean>
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    contact: {
        type: String,
        default:""
    },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await hash(this.password, 10)
    }
    next();
});

UserSchema.methods.match = async function (password: string) {
    return compare(password, this.password);
}

export default model<IUser>("User", UserSchema);
