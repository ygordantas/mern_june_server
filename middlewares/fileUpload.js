import multer from "multer";
import {v1 as uuid} from "uuid";

// MIME Types tells us what kinda of files we are dealing with
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${process.cwd()}/uploads/images`);
    },
    filename: (req, file, cb) => {
      const extension = MIME_TYPE_MAP[file.mimetype];
      cb(null, `${uuid()}.${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type.");
    cb(error, isValid);
  },
});

export default fileUpload;
