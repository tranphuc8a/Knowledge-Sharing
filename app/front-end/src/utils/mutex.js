
import { Mutex } from "async-mutex";

class MyMutex {
    constructor() {
        // this.mutex = new Mutex();
        this.is_locked = false;
    }

    isLocked(){
        // return this.mutex.isLocked();
        return this.is_locked;
    }
  
    async lock() {
        // if (this.mutex.isLocked()) return false;
        // this.release = await this.mutex.acquire();
        // return true;
        if (this.is_locked) return false;
        this.is_locked = true;
        return true;
    }
  
    unlock() {
        // this.mutex.release();
        this.is_locked = false;
    }
}

export default MyMutex;

