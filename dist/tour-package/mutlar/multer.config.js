"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
exports.multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: './src/AllFile/TourpackageMainImage',
        filename: (req, file, callback) => {
            const nameId = 'MainImage-' + Date.now();
            callback(null, `${nameId}${(0, path_1.extname)(file.originalname)}`);
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new Error('Only image files are allowed!'), false);
        }
    },
};
//# sourceMappingURL=multer.config.js.map