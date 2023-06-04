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
            this.knCtrl.checkKnowledgeExisted.bind(this.knCtrl),
            this.knCtrl.scoreKnowledge.bind(this.knCtrl)
            );
        
        // comment knowledge
        this.app.post(this.knUrl.comment,
            this.authCtrl.checkToken,
            this.accCtrl.checkUser,
            this.limitCtrl.checkLimitLevelOne,
            this.knCtrl.checkKnowledgeExisted.bind(this.knCtrl),
            this.knCtrl.addComment.bind(this.knCtrl));


        // update comment
        this.app.patch(this.knUrl.updateComment,
            this.authCtrl.checkToken,
            this.accCtrl.checkUser,
            this.limitCtrl.checkLimitLevelOne,
            this.knCtrl.checkCommentExisted.bind(this.knCtrl),
            this.knCtrl.updateComment.bind(this.knCtrl));

        // delete comment
        this.app.delete(this.knUrl.updateComment,
            this.authCtrl.checkToken,
            this.accCtrl.checkUser,
            this.limitCtrl.checkLimitLevelOne,
            this.knCtrl.checkCommentExisted.bind(this.knCtrl),
            this.knCtrl.deleteComment.bind(this.knCtrl));

        // get List Comments
        this.app.get(this.knUrl.comment,
            this.knCtrl.checkKnowledgeExisted.bind(this.knCtrl),
            this.knCtrl.getListComments.bind(this.knCtrl));
        
        // set mark knowledge
        this.app.post(this.knUrl.setMark,
            this.authCtrl.checkToken,
            this.accCtrl.checkUser,
            this.limitCtrl.checkLimitLevelOne,
            this.knCtrl.checkKnowledgeExisted.bind(this.knCtrl),
            this.knCtrl.setMark.bind(this.knCtrl));

        // get List marks
        this.app.get(this.knUrl.mark,
            this.authCtrl.checkToken,
            this.accCtrl.checkUser,
            this.limitCtrl.checkLimitLevelOne,
            this.knCtrl.getListMark.bind(this.knCtrl)
            )
    }
}

module.exports = KnowledgeRoute;
