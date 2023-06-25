
import { Mutex } from "async-mutex";

class MyMutex {
    constructor() {
        this.mutex = new Mutex();
    }

    isLocked(){
        return this.mutex.isLocked();
    }
  
    async lock() {
        if (this.mutex.isLocked()) return false;
        this.release = await this.mutex.acquire();
        return true;
    }
  
    unlock() {
        this.mutex.release();
    }
}

export default MyMutex;

