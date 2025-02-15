import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join, extname } from 'path'
import crypto from 'crypto'
import fs from 'fs'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const FILE_SIZE_LIMIT = 10 * 1024 * 1024;
const FILE_MIN_SIZE = 2048;

const uploadPath = process.env.UPLOAD_PATH_TEMP
    ? join(__dirname, `../public/${process.env.UPLOAD_PATH_TEMP}`)
    : join(__dirname, '../public');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(
            null,
            join(
                __dirname,
                process.env.UPLOAD_PATH_TEMP
                    ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                    : '../public'
            )
        )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        const uniqueSuffix = crypto.randomUUID();
        const fileExt = extname(file.originalname);
        const newFileName = `${uniqueSuffix}${fileExt}`;
        console.log('Сохранённое имя файла:', newFileName);
        cb(null, newFileName);
    },
})

const allTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = async (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {

    const fileExt = extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];
    if (!allTypes.includes(file.mimetype) || !allowedExtensions.includes(fileExt)) {
        return cb(null, false);
    }
    const fileSize = Number(_req.headers['content-length'])
    if (fileSize <= FILE_MIN_SIZE) {
        return cb(null, false);
    }

    return cb(null, true)
}

export default multer({ storage, fileFilter, limits: { fileSize: FILE_SIZE_LIMIT } })

