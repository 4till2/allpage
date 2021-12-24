import {prisma} from "/db-client";
import {getSession} from "next-auth/react";

//If using local iframely instance hydrateUrl
const hydrateUrl = async (url) => {
    return await fetch(`http://localhost:8061/iframely?url=${encodeURIComponent(url)}`).then(res => res.json());
}

const createWithIframely = async (user, json) => {
    const block = await prisma.block.create({
            data: {
                profileId: user.id,
                url: {
                    create: {
                        href: json.url,
                        externalUrlData: {
                            create: {
                                source: 'IFRAMELY',
                                externalId: json.id,
                                data: json,
                            }
                        }
                    }
                }
            },
            include: {
                url: {
                    select: {
                        externalUrlData: true
                    }
                },
            }
        }
    )
    return block
}

const createDefault = async (profileId, href, position) => {
    const block = await prisma.block.create({
        data: {
            profileId: profileId,
            url: {
                create: {
                    href: href,
                }
            },
            position: position
        },
        include: {
            url: true,
        }
    })


    return block
}
export default async (req, res) => {
    const session = await getSession({req})
    let url = req.query.url
    const position = 0;
    const valid = url.match(/^https?:\/\//i)
    let content = undefined
    if (valid && url) {
        // fetch(`https://iframe.ly/api/iframely?url=${encodeURIComponent(url)}&api_key=${process.env.IFRAMELY_KEY}&iframe=1&id=1&omit_script=1&id=1`)
        //     fetch(`http://localhost:8061/iframely?url=${encodeURIComponent(url)}`)
        //     .then(
        //         async (res) => {
        //             const json = await res.json()
        //             if (res.status !== 200 || !json) return
        //             // content = await createWithIframely(user, json)
        //             content = await createDefault(user, json)
        //         }
        //     )
        //     .catch(error => {
        //         
        //         res.status(400).send({error: error})
        //     })
        await prisma.block.updateMany({
            where: {
                profileId: session.user.profileId,
                position:{
                    gte: position
                }
            },
            data: {
                position: {
                    increment: 1
                }
            }
        })
        content = await createDefault(session.user.profileId, url, position)
    }
    content ? res.status(200).send({content: content}) : res.status(400).send({error: 'Issues happened with creating the block.'});
}

