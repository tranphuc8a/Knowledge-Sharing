

class RandomGenerator {
    static instance = null; // instance

    static characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // dictionary of random characters 

    static getInstance() {
        if (this.instance == null) {
            this.instance = new RandomGenerator();
        }
        return this.instance;
    }

    generateRandomCode() {
        let code = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * (RandomGenerator.characters.length));
            code += RandomGenerator.characters[randomIndex];
        }
        return code;
    }

}

module.exports = RandomGenerator.getInstance();