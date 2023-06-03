
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
    knowledge: {
        score: '/api/knowledge/score/:knid',
        comment: '/api/knowledge/comment/:knid',
        updateComment: '/api/knowledge/comment/:id',
        mark: '/api/knowledge/mark/:knid'
    },
    course: {
        create: '/api/courses/',
        update: '/api/courses/:cid',
        list: '/api/courses/list/:email',
        listRegistered: 'api/courses/list-registered',
        detail: '/api/courses/detail/:cid',
        lesson: '/api/courses/lesson/:cid/:lessonid',

        register: '/api/courses/register/:courseid',
        pay: '/api/courses/pay/:courseid',
        request: '/api/courses/request',
        confirmRequest: '/api/courses/request/:requestid',
        listInvite: '/api/courses/invite',
        invite: '/api/courses/invite/:email/:courseid',
        confirmInvite: '/api/courses/invite/:requestid',
        member: '/api/courses/members/:cid'
    },
    lesson: {
        create: '/api/lesson',
        detail: '/api/lesson/detail/:lessonid/:courseid',
        list: '/api/lesson/list',
        update: '/api/lesson/:lessonid'
    }
}