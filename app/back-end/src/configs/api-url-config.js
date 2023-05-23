
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
}