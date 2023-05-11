const { plainToInstance } = require('class-transformer')

module.exports = class Transformer {
    static instance = null;

    //singleton
    static getInstance() {
        if (this.instance == null) {
            this.instance = new Transformer();
        }
        return this.instance
    }

    jsonToInstance(className, jsonObject) {
        return plainToInstance(className, jsonObject);
    }
} 