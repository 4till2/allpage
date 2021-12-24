import { IncomingForm } from 'formidable'
import { v4 as uuidv4 } from 'uuid';
import mv from 'mv'


export const config = {
    api: {
        bodyParser: false,
    }
};

export default async (req, res) => {

    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm()

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            let oldPath = files.file.filepath;
            let filename = uuidv4()
            let newPath = `./public/images/uploads/${filename}`;
            mv(oldPath, newPath, function(err) {
            });
            res.status(200).send({filename: filename})
        })
    })

}
