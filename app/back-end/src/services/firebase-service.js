
class Firebase {
    static instance = null;
    static serviceAccount = require('../configs/firebase-config.json');
    static getInstance(){
        if (Firebase.instance == null)
            Firebase.instance = new Firebase();
        return Firebase.instance;
    }
    constructor(){
        // connect firebase
        this.admin = require('firebase-admin');
        this.admin.initializeApp({
            credential: this.admin.credential.cert(Firebase.serviceAccount),
            storageBucket: 'gs://bksnet-e46a7.appspot.com/',
        });
        this.bucket = this.admin.storage().bucket();
    }

    setFileName(fileName){
        this.fileName = "knowledge-sharing/" + fileName;
        return this;
    }

    setFile(file){
        this.file = file;
        return this;
    }

    async save(fileConfig = null){
        try {
            if (fileConfig){
                this.setFileName(fileConfig.fileName)
                    .setFile(fileConfig.file);
            } 
            // console.log(fileConfig);
            let fileUpload = this.bucket.file(this.fileName);

            // Tải lên tệp lên Firebase Storage
            fileUpload.save(this.file.buffer, {
                destination: this.fileName,
                metadata: {
                    contentType: this.file.mimetype
                }
            });

            // Lấy URL của tệp đã tải lên
            [this.fileUrl] = await fileUpload.getSignedUrl({
                action: 'read',
                expires: '2030-01-01' // Ngày hết hạn của URL (tùy chọn)
            });

            return this.fileUrl;

        } catch (e){
            console.log(e);
        }
    }

}

module.exports = Firebase;