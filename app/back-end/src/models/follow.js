

class Follow {
    static Type = {
        UNKNOWN: 0,
        FOLLOWING: 1,
        FOLLOWED: 2,
        BOTH: 3
    }

    constructor(follow) {
        if (follow == null) return;
        this.following = follow.following;
        this.followed = follow.followed;
        this.time = follow.time;
    }
}

module.exports = Follow;
