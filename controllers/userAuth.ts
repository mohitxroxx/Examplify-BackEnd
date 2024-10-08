import { Request, Response } from "express"
import User from "../models/user"
import { sign } from "jsonwebtoken";
import axios from "axios"

const getUser = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({ msg: 'Hello' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error occured while fetching data' })
    }
}

const register = async (req: Request, res: Response) => {
    try {
        const { email, password, batch, name, contact, token } = req.body
        if (!email || !password || !batch || !name || !contact) // || !token
            return res.status(403).json({ msg: 'All the fields are mandatory' })
        // const response = await axios.post(
        //     `https://www.google.com/recaptcha/api/siteverify?secret=${recaptcha_key}&response=${token}`
        //   )
        //   if (!response.data.success) {
        //     return res.status(400).json({ error: "reCAPTCHA verification failed" });
        //   }
        const existing = await User.findOne({ email })
        if (existing)
            return res.status(406).json({ msg: "User with this email already exists." })
        const userData = {
            ...req.body
        }
        const newUser = await User.create(userData)
        return res.status(201).json({ msg: `Successfully registered ${name}` })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error occured while fetching data' })
    }
}




const login = async (req: Request, res: Response) => {
    try {
        const { email , password } = req.body
        const existing = await User.findOne({email})
        if(!existing)
            return res.status(404).json({msg:`No user exists with the email ${email}`})
        const match = await existing.match(password)
        if(!match)
            return res.status(401).json({msg:"Wrong Credentials"})
        const userData={
            _id:existing._id,
            name:existing.name,
            email:existing.email,
            batch:existing.batch,
            isVerified:existing.isVerified
        }
        const token = sign(
            userData,
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );
        return res.status(200).json({msg:"Successfully Logged in",userData,token});
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error occured while fetching data' })
    }
}

const forgotPass = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({ msg: 'hehe' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error occured while fetching data' })
    }
}

const all_exports = {
    getUser,
    register,
    login,
    forgotPass
}

export default all_exports

