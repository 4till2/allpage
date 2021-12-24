import {prisma} from "/db-client";
import {getSession} from "next-auth/react";

export default async (req, res) => {
    const session = await getSession({req})
    const {username, name, image, colors, bio} = req.body
    const profile = await prisma.profile.upsert({
        where: {userId: session.user.id},
        create: {
            userId: session.user.id,
            username: username || undefined,
            name: name || undefined,
            image: image || undefined,
            colors: colors || undefined,
            bio: bio || undefined,
        },
        update: {
            username: typeof username === "undefined" ? undefined : username,
            name: typeof name === "undefined" ? undefined : name,
            image: typeof image === "undefined" ? undefined : image,
            colors: typeof colors === "undefined" ? undefined : colors,
            bio: typeof bio === "undefined" ? undefined : bio,
        }
    })
    res.status(200).send(profile);
}
