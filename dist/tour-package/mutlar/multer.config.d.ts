export declare const multerConfig: {
    storage: import("multer").StorageEngine;
    limits: {
        fileSize: number;
    };
    fileFilter: (req: any, file: any, callback: any) => void;
};
