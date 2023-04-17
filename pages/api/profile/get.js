import {prisma} from "../../../db-client";
import {retrieve} from "../../../helpers/file";

export default async (req, res) => {
    const {username, profileId, userId} = req.query
    const val = username || profileId || userId
    const key = username ? 'username' : profileId ? 'id' : 'userId'
    let profile
    if (key !== "undefined" && val != "undefined") {
        profile = await prisma.profile.findUnique({
            where: {
                [key]: val
            },
            select: {
                userId: true,
                username: true,
                image: true,
                name: true,
                colors: true,
                bio: true,
                blocks: {
                    orderBy: {
                        position: 'asc',
                    },
                    select: {
                        id: true,
                        title: true,
                        profileId: true,
                        url: {
                            select: {
                                href: true,
                                externalUrlData: true
                            }
                        },
                    }
                }
            }
        })
    }
//     if (profile && profile.image) profile.image = await retrieve(profile.image)

    !profile ? res.status(404).send({error: 'user not found'}) : res.status(200).send({...profile})
}
