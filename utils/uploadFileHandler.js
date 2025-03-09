import multer from "multer";
import path from "path";

const FILETYPE = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidFormat = FILETYPE[file.mimetype];

    let uploadError = new Error("Invalid format image! jpeg or png");

    if (isValidFormat) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueFile = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueFile);
  },
});

export const upload = multer({ storage: storage });
