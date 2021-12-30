import {prisma} from "/db-client";
import {retrieve} from "../../../helpers/file";

export default async (req, res) => {
    const {id} = req.query

    if (!id) res.status(404).send({error: 'user not found'})


    const user = await prisma.user.findUnique({
            where:{
                id: id
            }
        })

    if (!user) res.status(404).send({error: 'user not found'})
    if (user.profile && user.profile.image) user.profile.image = await retrieve(user.profile.image)
    res.status(200).send({...user})
}
