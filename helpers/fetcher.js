export default async function fetcher(...args) {
    return await fetch(...args).then(async res => {
        return res ? await res.json() : null
    })
}


