const Busboy = require('busboy'),
    logger = require('../config/logger'),
    fs = require('fs'),
    uploadPath = require('../config/config').imagePath,
    limit = require('../config/config').imageLimit;

class ImagesService {
    upload(req, res, next) {
        let fname = req.userID;

        let is_limit = false;

        let busboy = new Busboy({ headers: req.headers, limits: {fileSize: limit}});
        busboy.on('file', (fieldname, file, filename) => {

            file.fileRead = [];
            let size = 0;

            let extension = filename.split('.')[filename.split('.').length - 1];

            if(['jpg', 'png'].indexOf(extension) === -1)
                return res.status(409).json({message: 'Wrong image extension, we support only jpg & png files'});

            file.on('data', function(data) {
                size += data.length;
                file.fileRead.push(data);
            });

            file.on('end', function() {
                if(is_limit)
                    return res.status(409).json({message: 'File is to big'});
                else {
                    let data = Buffer.concat(file.fileRead, size);
                    fs.writeFile(uploadPath + '/' + fname + "." + extension, data, null, (err) => {
                        if(err) {
                            logger.error(err);
                            return res.status(500).json({message: 'Error while saving file'});
                        }
                        req.body.image = fname + "." + extension;
                        next();
                    });
                }
            });
            file.on('limit', () => {
                is_limit = true;
            })
        });

        req.pipe(busboy);


    }
}

module.exports = new ImagesService();