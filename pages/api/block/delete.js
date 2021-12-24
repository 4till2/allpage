import {prisma} from "/db-client";
import {getSession} from "next-auth/react";

export default async (req, res) => {
    const session = await getSession({req})
    const {id, title, href} = req.body
    let deleted = false
    const block = await prisma.block.findUnique({
        where: {
            id: id
        },
        select: {
            profileId: true,
            position: true
        }
    })
    if (session && (block.profileId === session.user.profileId)) {
        deleted = await prisma.block.delete({
            where: {
                id: id
            }
        })
       deleted && await prisma.block.updateMany({
            where: {
                profileId: session.user.profileId,
                position:{
                    gt: block.position
                }
            },
            data: {
                position: {
                    decrement: 1
                }
            }
        })
    }
    deleted ? res.status(200).send({success: true}) : res.status(400).send({error: "Unable to delete block"})

}
