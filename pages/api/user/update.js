import {prisma} from "/db-client";
import {getSession} from "next-auth/react";

export default async (req, res) => {
    const session = await getSession({ req })
    const {username, name, image, colors, bio} = req.body
    const user = await prisma.user.update({
        where: { id: session.user.id },
        data: {
            profile: {
                upsert: {
                    create: {
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
                }
            }
        },
    })
    res.status(200).send(user);
}
