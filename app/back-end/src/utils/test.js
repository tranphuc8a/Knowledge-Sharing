
let visible = '01010101';

let profile = {
    "email": "nhungthisope123@gmail.com",
    "name": "Trịnh Đức Tiệp",
    "avatar": null,
    "dob": "11-11-2001",
    "phone": "0987654321",
    "gender": "male",
    "address": "Ba Bà Trưng, Hà Nộ",
    "job": "huster",
    "social_link": "https://www.youtube.com/",
    "description": "mc và cú ăn 3 lịch sử 2023",
    "visible": "01010101"
};

function getVisibleProfile(profile) {
    let visible = profile.visible;
    let visibleProfile = {
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar
    };
    for (i = 0; i < visible.length; i++) {
        if (visible[i] == 1) {
            switch (i) {
                case 3:
                    visibleProfile.dob = profile.dob;
                    break;
                case 4:
                    visibleProfile.phone = profile.phone;
                    break;
                case 5:
                    visibleProfile.gender = profile.gender;
                    break;
                case 6:
                    visibleProfile.address = profile.address;
                    break;
                case 7:
                    visibleProfile.job = profile.job;
                    break;
                case 8:
                    visibleProfile.social_link = profile.social_link;
                    break;
                case 9:
                    visibleProfile.description = profile.description;
                    break;
                    ;;;;;;;;;;;;;;;
            }
        }
    }

    return visibleProfile;
}
console.log(getVisibleProfile(profile));