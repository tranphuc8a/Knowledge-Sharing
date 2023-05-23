
module.exports = {
    domain: 'https://localhost:3000/api/',
    auth: {
        login: '/api/auth/login',
        checkToken: '/api/auth/checkToken',
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
        score: '/api/knowledge/score',
        comment: '/api/knowledge/comment',
        updateComment: '/api/knowledge/comment/:id',
        listComment: '/api/knowledge/comment/:knid',
        mark: '/api/knowledge/mark',
        updateMark: '/api/knowledge/mark/:knid'
    },
    course: {
        create: '/api/courses/',
        update: '/api/courses/:cid',
        list: '/api/courses/list/:email',
        detail: '/api/courses/detail/:cid',
        lesson: '/api/courses/lesson/:cid/:lessonid',
        
        register: '/api/courses/register/:courseid',
        pay: '/api/courses/pay/:courseid',
        request: '/api/courses/request/:courseid',
        updateRequest: '/api/courses/request/:requestid',
        invite: '/api/courses/invite/:courseid',
        updateInvite: '/api/courses/invite/:courseid',
        member: '/api/courses/members/:cid'
    },
    lesson: {
        create: '/api/lesson',
        detail: '/api/lesson/detail/:lessonid/:courseid',
        list: '/api/lesson/list',
        update: '/api/lesson/:lessonid'
    }
}