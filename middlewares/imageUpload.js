import multer from "multer";
import { v1 as uuid } from "uuid";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const diskStorageOptions = {
  destination: (_req, _file, callback) => {
    callback(null, `${process.cwd()}/uploads/images`);
  },
  filename: (_req, file, callback) => {
    const fileExtension = MIME_TYPE_MAP[file.mimetype];
    callback(null, `${uuid()}.${fileExtension}`);
  },
  fileFilter: (_req, file, callback) => {
    const isValid = Boolean(MIME_TYPE_MAP[file.mimetype]);
    const error = isValid ? null : new Error("Invalid mime type.");
    callback(error, isValid);
  },
};

const multerOptions = {
  storage: multer.diskStorage(diskStorageOptions),
};

const imageUpload = multer(multerOptions);

export default imageUpload;
