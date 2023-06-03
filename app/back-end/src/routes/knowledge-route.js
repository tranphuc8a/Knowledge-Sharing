const apiUrlConfig = require("../configs/api-url-config");
const AuthenController = require('../controllers/auth-controller')
const AccountController = require('../controllers/account-controller')
const LimitionController = require('../controllers/limition-controller')
const KnowledgeController = require('../controllers/knowledge-controller')

class KnowledgeRoute{
    constructor(app){
        this.app = app;
        this.knUrl = apiUrlConfig.knowledge;
        this.authCtrl = new AuthenController();
        this.accCtrl = new AccountController();
        this.limitCtrl = new LimitionController();
        this.knCtrl = new KnowledgeController();
    }

    route(){
        // score knowledge
        this.app.put(this.knUrl.score,
            this.authCtrl.checkToken,
            this.accCtrl.checkUser,
            this.limitCtrl.checkLimitLevelOne,
            this.knCtrl.checkKnowledgeExisted,
            this.knCtrl.scoreKnowledge
            );
        
        // comment knowledge
        this.app.post(this.knUrl.comment,
            this.authCtrl.checkToken,
            this.accCtrl.checkUser,
            this.limitCtrl.checkLimitLevelOne,
            this.knCtrl.checkKnowledgeExisted,
            this.knCtrl.addComment);


        // update comment
        this.app.patch(this.knUrl.updateComment,
            this.authCtrl.checkToken,
            this.accCtrl.checkUser,
            this.limitCtrl.checkLimitLevelOne,
            this.knCtrl.checkCommentExisted,
            this.knCtrl.updateComment);

        // delete comment
        this.app.delete(this.knUrl.updateComment,
            this.authCtrl.checkToken,
            this.accCtrl.checkUser,
            this.limitCtrl.checkLimitLevelOne,
            this.knCtrl.checkCommentExisted,
            this.knCtrl.deleteComment);

        // get List Comments
        this.app.get(this.knUrl.comment,
            this.knCtrl.checkKnowledgeExisted,
            this.knCtrl.getListComments)
    }
}

module.exports = KnowledgeRoute;
