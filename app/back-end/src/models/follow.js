

class Follow{
    constructor(follow){
        if (follow = null) return;
        this.following = follow.following;
        this.followed = follow.followed;
        this.time = follow.time;
    }
}

module.exports = Follow;
