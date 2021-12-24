import {prisma} from "../../../db-client";
import {getSession, useSession} from "next-auth/react";

export default async function handler(req, res) {
    const session = await getSession({ req })
    const {username} = req.query
    let isAvailable = true;
    if (username && username.length >= 3) {
        isAvailable = await prisma.profile.findUnique({
            where: {
                username: req.query.username,
            }
        })
    }
    res.send({result: !isAvailable || (session?.user?.profileId && isAvailable && isAvailable.id == session?.user?.profileId)})
}

