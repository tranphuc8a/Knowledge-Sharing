const Comment = require('../models/comment');
const Mark = require('../models/mark');
const Score = require('../models/score');
const CommentDAO = require('../services/dao/comment-dao');
const CoursesDAO = require('../services/dao/courses-dao');
const KnowledgeDAO = require('../services/dao/knowledge-dao');
const LessonDAO = require('../services/dao/lesson-dao');
const MarkDAO = require('../services/dao/mark-dao');
const ScoreDAO = require('../services/dao/score-dao');
const DateTime = require('../utils/datetime');
const Response = require('../utils/response');
const LessonController = require('./lesson-controller');

class KnowledgeController{
    constructor(){
        this.lsnCtrl = new LessonController();
    }

    async checkAccessible(account, knowledge){
        if (knowledge == null) return false;
        if (await CoursesDAO.getInstance().getById(knowledge.id))
            return true;
        return this.lsnCtrl.checkAccessible(account, await LessonDAO.getInstance().getById(knowledge.id));
    }

// middle ware:
    async checkKnowledgeExisted(req, res, next){
        let {knid} = req.params;
        let kn = await KnowledgeDAO.getInstance().getById(knid);
        if (!kn) return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Knowledge is not exist");
        req.knowledge = kn;
        next();
    }

    async checkCommentExisted(req, res, next){
        let {id} = req.params;
        let comment = await CommentDAO.getById(id);
        if (!comment) return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Comment not existed");
        req.comment = comment;
        next();
    }

// endware

    // put api/knowledge/score
    // header: token
    // params: knid
    // body: score
    async scoreKnowledge(req, res, next){
        let {account, knowledge} = req;
        if (await this.checkAccessible(account, knowledge)){
            return Response.response(res, Response.ResponseCode.INFO, "No permission");
        }
        let { score } = req.body;
        let scores = await ScoreDAO.getInstance().select({
            email: account.email,
            knowledge_id: knowledge.id
        });
        let rs = null;

        if (scores.length <= 0){
            // insert
            let score = new Score({
                email: account.email,
                knowledge_id: knowledge.id,
                score: score,
                time: DateTime.now()
            });
            rs = await ScoreDAO.insert(score);
        } else {
            // update
            rs = await ScoreDAO.getInstance().update({
                score: score,
                time: DateTime.now()
            }, {
                email: account.email,
                knowledge_id: knowledge.id
            })
        }

        if (!rs) return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Failed");
        return Response.response(res, Response.ResponseCode.OK, "Success", score);
    }

    // post api/knowledge/comment
    // header: token (authorization)
    // params: knid
    // body: content
    async addComment(req, res, next){
        let { account, knowledge } = req;
        if (await this.checkAccessible(account, knowledge)){
            return Response.response(res, Response.ResponseCode.INFO, "No permission");
        }
        let { content } = req.body;
        let comment = new Comment({
            email: account.email,
            knowledge_id: knowledge.id,
            content: content,
            time: DateTime.now()
        })
        let rs = await CommentDAO.getInstance().insert(comment);
        if (!rs) return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Failed");
        return Response.response(res, Response.ResponseCode.OK, "Success", comment);
    }


    // patch api/knowledge/comment/:id
    // header: token
    // body: newContent
    async updateComment(req, res, next){
        let {account, comment} = req;
        if (comment.email != account.email){
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Not permission");
        }
        let {newContent} = req.body;
        comment.content = new Content;
        comment.time = DateTime.now();

        let rs = await CommentDAO.getInstance().update({
            content: newContent,
            time: comment.time
        }, {
            id: comment.id
        });

        if (!rs) return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Failed");
        return Response.response(res, Response.ResponseCode.OK, "Success", comment);
    }

    // delete api/knowledge/comment/:id
    // header: token
    async deleteComment(req, res, next){
        let { account, comment } = req;
        if (account.email != comment.email)
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Not permission");
        
        let rs = await CommentDAO.delete({
            id: comment.id
        });
        if (!rs) return Response.response(Response.ResponseCode.SERVER_ERROR, "Failed");
        return Response.response(res, Response.ResponseCode.OK, "Success", comment);
    }

    // get api/knowledge/comment/:knid
    // body: offset*, length*
    async getListComments(req, res, next){
        let { knowledge } = req;
        let {offset, length} = req.body;
        let pagination = null;
        if (offset && length){
            pagination = {
                offset: offset,
                length: length
            }
        };

        let comments = await CommentDAO.getInstance().selectDetail({
            knowledge_id: knowledge.id
        }, ["comment.email as email", "avatar", "name", "content", "time"], pagination);

        comments = {
            length: comments.length,
            data: comments
        }
        if (!comments) return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Failed");
        return Response.response(res, Response.ResponseCode.OK, "Success", comments);
    }

    // post api/knowledge/mark/:knid
    // header: token 
    // body: type: 0/1
    async setMark(req, res, next){
        let {account, knowledge} = req;
        let {type} = req.body;
        if (type != 0 && type != 1)
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Type is not valid");
        let marks = await MarkDAO.select({
            email: account.email,
            knowledge_id: knowledge.id
        });
        let mark = marks ? marks[0] : null;
        let rs = null;
        if (type == 0){
            // unmark
            if (mark) { // delete
                rs = await MarkDAO.delete({
                    email: account.email,
                    knowledge_id: knowledge.id
                });
            } else rs = true;
            if (!rs) return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Unmark failed!");
            return Response.response(res, Response.ResponseCode.OK, "Unmark success");
        }
        if (type == 1){
            // mark
            if (!mark){ // insert
                rs = await MarkDAO.insert(new Mark({
                    email: account.email,
                    knowledge_id: knowledge.id,
                    time: DateTime.now()
                }))
            } else rs = true;
            if (!rs) return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Mark failed!");
            return Response.response(res, Response.ResponseCode.OK, "Mark success");
        }
        return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Pass if else");
    }

    // get api/knowledge/mark/:knid*
    // header: token
    // body: offset*, length*
    async getListMark(req, res, next){
        let {account} = req;
        let {knid} = req.params;
        let {offset, length} = req.body;
        let pagination = null;
        if (offset && length) pagination = {
            offset: offset, length: length
        }

        let marks = null;
        let keys = [
            "profile.email as email", "name", "avatar", "time", 
            "id", "id as knid", "thumbnail", "title", "owner_email", 
            "course.knowledge_id as course_id", "lesson.knowledge_id as lesson_id"
        ];
        if (knid == null){
            // get Knowledge be marked
            marks = await MarkDAO.selectDetail({
                email: account.email
            }, keys, pagination);
        } else if (knid != null){
            // get User marked this knowledge
            let marks = await MarkDAO.selectDetail({
                knowledge_id: knid
            }, keys, pagination);
        }
        if (!marks) return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Failed");
        marks.is_course = marks.course_id != null ? 1 : 0;
        marks.is_lesson = marks.lesson_id != null ? 1 : 0;
        marks = {
            length: marks.length,
            data: marks
        }
        return Response.response(res, Response.ResponseCode.OK, "Successs", marks);
    }
}

module.exports = KnowledgeController;