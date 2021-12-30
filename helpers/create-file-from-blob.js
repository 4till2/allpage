export default async function createFileFromBlob(url, _type="image/jpeg"){
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
        type: _type
    };
    let file = new File([data], Date.now() + ".jpg", metadata);
    return file
}
