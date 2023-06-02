

class Profile {
    constructor(profile) {
        if (profile == null) return;

        this.email = profile.email;
        this.name = profile.name;
        this.avatar = profile.avatar;
        this.dob = profile.dob;
        this.phone = profile.phone;
        this.gender = profile.gender;
        this.address = profile.address;
        this.job = profile.job;
        this.social_link = profile.social_link;
        this.description = profile.description;
        this.visible = profile.visible;
    }
}

module.exports = Profile;