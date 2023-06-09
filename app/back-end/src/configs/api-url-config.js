
module.exports = {
    domain: 'https://localhost:3000/api/',
    auth: {
        login: '/api/auth/login',
        validateToken: '/api/auth/validateToken',
        refreshToken: '/api/auth/refreshToken',
        logout: '/api/auth/logout',
        logoutAll: '/api/auth/logoutAll',
        getRegisterCode: '/api/auth/getRegisterCode',
        register: '/api/auth/register',
        changePassword: '/api/auth/changePassword',
        getForgotPasswordCode: '/api/auth/getForgotPasswordCode',
        forgotPassword: '/api/auth/forgotPassword',
        cancelAccount: '/api/auth/cancelAccount',
        accounts: '/api/auth/accounts'
    },
    profile: {
        update: '/api/profile',
        get: '/api/profile/:email'
    },
    follow: {
        crud: '/api/follow',
        get: '/api/follow/:email/:index'
    },
    knowledge: {
        score: '/api/knowledge/score/:knid',
        comment: '/api/knowledge/comment/:knid',
        updateComment: '/api/knowledge/comment/:commentid',
        setMark: '/api/knowledge/mark/:knid',
        mark: '/api/knowledge/mark',
        image: '/api/image'
    },
    course: {
        create: '/api/courses/',
        update: '/api/courses/:courseid',
        list: '/api/courses/list',
        listRegistered: '/api/courses/listregistered',
        detail: '/api/courses/detail/:courseid',
        lesson: '/api/courses/lesson/:courseid/:lessonid',

        register: '/api/courses/register/:courseid',
        pay: '/api/courses/pay/:courseid',
        request: '/api/courses/request/:courseid',
        listRequest: '/api/courses/request',
        confirmRequest: '/api/courses/request/:requestid',
        listInvite: '/api/courses/invite',
        invite: '/api/courses/invite/:email/:courseid',
        confirmInvite: '/api/courses/invite/:requestid',
        member: '/api/courses/members/:courseid'
    },
    lesson: {
        create: '/api/lesson',
        detail: '/api/lesson/detail/:lessonid',
        list: '/api/lesson/list',
        update: '/api/lesson/:lessonid',
        course: '/api/courses/lesson/:courseid/:lessonid',
        courseList: '/api/courses/listLesson/:courseid',
    },
    search: {
        account: '/api/search/account/:key',
        courses: '/api/search/courses',
        lesson: '/api/search/lesson',
    },
    admin: {
        limit: '/api/admin/limit',
        listAccount: '/api/admin/list-account',
        deleteAccount: '/api/admin/delete-account',
        deleteCourse: '/api/admin/delete-course',
        deleteLesson: '/api/admin/delete-lesson',
        addAdmin: '/api/admin/add-admin'
    }
}