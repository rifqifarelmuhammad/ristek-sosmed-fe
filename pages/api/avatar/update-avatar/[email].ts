import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.query;
    axios.patch(`https://ristek-sosmed-backend.vercel.app/avatar/${email}`, req.body).then((response) => {
        res.status(200).json(response.data)
    }).catch((error) => {
        res.status(500).send(error)
    })
}

export const config = {
    api: {
        externalResolver: true,
    },
}