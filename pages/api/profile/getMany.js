import {prisma} from "../../../db-client";
import {retrieve} from "../../../helpers/file";

export default async (req, res) => {
    const {take, skip} = req.query
    const profiles = await prisma.profile.findMany({
        skip: skip || 0,
        take: take || 20,
        select: {
            username: true,
            image: true,
            name: true,
            colors: true,
            bio: true,
        }
    })
    !profiles ? res.status(404).send({error: 'user not found'}) : res.status(200).send(profiles)
}
