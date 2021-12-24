import {prisma} from "/db-client";
import {getSession} from "next-auth/react";

async function updatePositions(profileId, blockId, oldPos, newPos) {
    if (oldPos < 0 || newPos < 0) return false;
    if (oldPos === newPos) return true
    //Move back (shift blocks between newPos and oldPos forward)
    if (newPos < oldPos) {
        return true && await prisma.block.updateMany({
            where: {
                profileId: profileId,
                position: {
                    gte: newPos,
                    lte: oldPos
                }
            },
            data: {
                position: {
                    increment: 1
                }
            }
        })
    }
    //Move forward (shift blocks between newPos and oldPos backward)
    else if (newPos > oldPos){
        return true && await prisma.block.updateMany({
            where: {
                profileId: profileId,
                position:{
                    lte: newPos,
                    gte: oldPos
                }
            },
            data: {
                position: {
                    decrement: 1
                }
            }
        })
    }
    return false
}
export default async (req, res) => {
    const session = await getSession({req})
    const {id, title, href, position} = req.body
    let content = undefined
    const block = await prisma.block.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            profileId: true,
            position: true
        }
    })
    if (session && (block.profileId === session.user.profileId)) {
        position >= 0 && await updatePositions(session.user.profileId, block.id, block.position, position)
        content = await prisma.block.update({
            where: {
                id: id
            },
            data: {
                title: typeof title === "undefined" ? undefined : title,
                position: position >= 0 ? position : undefined,
                url: {
                    update: {
                        href: typeof href === "undefined" ? undefined : href
                    }
                }
            },
            select: {
                title: true,
                id: true,
                profileId: true,
                url: {
                    select: {
                        href: true,
                        externalUrlData: true
                    }
                }
            }
        })
    }
    
    content ? res.status(200).send({content: content}) : res.status(400).send({error: "Unable to update block"})
}

