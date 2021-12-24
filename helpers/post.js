export default async function post(endpoint, body) {
    const result = await fetch(`api/${endpoint}`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }),
        body: JSON.stringify({
            ...body
        })
    })
        .then(async res => {
            const json = await res.json()
            return json
        })
        .catch(error => {
            return error
        })
    return result
}
