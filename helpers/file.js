import {v4 as uuidv4} from 'uuid';
import {server} from '../config';

const REMOTE = true

const uploadFileRemote = async (file) => {
    const res = await fetch('/api/utils/upload-remote');
    const {url, fields} = await res.json();
    const formData = new FormData();
    Object.entries({...fields, file}).forEach(([key, value]) => {
        formData.append(key, value);

    });
    const upload = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    if (upload.ok) {
        return fields.key
    } else {
        console.error('Upload failed.');
    }
};

const uploadFileLocal = async (file) => {
    const key = uuidv4()
    const body = new FormData();
    body.append("file", key,);
    const response = await fetch("/api/utils/upload", {
        method: "POST",
        body
    });
    return key
};

const retrieveFileRemote = async (filename) => {
    const {url} = await fetch(`${server}/api/utils/download-remote?file=${filename}`).then(res => res.json())
    return url
}

const retrieveFileLocal = async (filename) => {
    return `/public/images/uploads/${filename}`
}


export async function store(file) {
    return REMOTE ? await uploadFileRemote(file) : await uploadFileLocal(file)
}

export async function retrieve(filename) {
    return REMOTE ? await retrieveFileRemote(filename) : await retrieveFileLocal(filename)
}
