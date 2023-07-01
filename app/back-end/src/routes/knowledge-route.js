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
            this.authCtrl.checkToken.bind(new AuthenController()),
            this.accCtrl.checkUser.bind(new AccountController()),
            this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
            this.knCtrl.checkKnowledgeExisted.bind(new KnowledgeController()),
            this.knCtrl.scoreKnowledge.bind(new KnowledgeController())
            );
        
        // comment knowledge
        this.app.post(this.knUrl.comment,
            this.authCtrl.checkToken.bind(new AuthenController()),
            this.accCtrl.checkUser.bind(new AccountController()),
            this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
            this.knCtrl.checkKnowledgeExisted.bind(new KnowledgeController()),
            this.knCtrl.addComment.bind(new KnowledgeController()));


        // update comment
        this.app.patch(this.knUrl.updateComment,
            this.authCtrl.checkToken.bind(new AuthenController()),
            this.accCtrl.checkUser.bind(new AccountController()),
            this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
            this.knCtrl.checkCommentExisted.bind(new KnowledgeController()),
            this.knCtrl.updateComment.bind(new KnowledgeController()));

        // delete comment
        this.app.delete(this.knUrl.updateComment,
            this.authCtrl.checkToken.bind(new AuthenController()),
            this.accCtrl.checkUser.bind(new AccountController()),
            this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
            this.knCtrl.checkCommentExisted.bind(new KnowledgeController()),
            this.knCtrl.deleteComment.bind(new KnowledgeController()));

        // get List Comments
        this.app.get(this.knUrl.comment,
            this.knCtrl.checkKnowledgeExisted.bind(new KnowledgeController()),
            this.knCtrl.getListComments.bind(new KnowledgeController()));
        
        // set mark knowledge
        this.app.post(this.knUrl.setMark,
            this.authCtrl.checkToken.bind(new AuthenController()),
            this.accCtrl.checkUser.bind(new AccountController()),
            this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
            this.knCtrl.checkKnowledgeExisted.bind(new KnowledgeController()),
            this.knCtrl.setMark.bind(new KnowledgeController()));

        // get List markss
        this.app.get(this.knUrl.mark,
            this.authCtrl.checkToken.bind(new AuthenController()),
            this.accCtrl.checkUser.bind(new AccountController()),
            this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
            this.knCtrl.getListMark.bind(new KnowledgeController())
            )

        const upload = require('multer')();
        
        // post image
        this.app.post(this.knUrl.image, 
            this.authCtrl.checkToken.bind(new AuthenController()),
            this.limitCtrl.checkLimitLevelTwo.bind(new LimitionController()),
            upload.single('image'),
            this.knCtrl.postImage.bind(new KnowledgeController()))
    }
}

module.exports = KnowledgeRoute;
