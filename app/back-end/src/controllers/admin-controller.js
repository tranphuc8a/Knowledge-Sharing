const Account = require("../models/account");
const Profile = require("../models/profile");
const AccountDAO = require("../services/dao/account-dao");
const CategoriesDAO = require("../services/dao/categories-dao");
const CommentDAO = require("../services/dao/comment-dao");
const CoursesDAO = require("../services/dao/courses-dao");
const CoursesLessonDAO = require("../services/dao/courses-lesson-dao");
const LearnDAO = require("../services/dao/learn-dao");
const LessonDAO = require("../services/dao/lesson-dao");
const MarkDAO = require("../services/dao/mark-dao");
const PaymentDAO = require("../services/dao/payment-dao");
const ProfileDAO = require("../services/dao/profile-dao");
const RequestDAO = require("../services/dao/request-dao");
const ScoreDAO = require("../services/dao/score-dao");
const DateTime = require("../utils/datetime");
const BaseController = require("./base-controller");

class AdminController extends BaseController{
    constructor(){
        super();
    }

// middle ware:
    async checkAccountExisted(req, res, next){
        try {
            this.updateMiddleWare(req, res, next);
            let {email} = req.body;
            if (email == null) return this.badRequest("Email is not valid");
            let account = await AccountDAO.getInstance().getById(email);
            if (account == null) return this.badRequest("Email is not existed");
            req.account = account;
            return next();
        } catch (e){
            console.log(e);
            return this.serverError(e);
        }
    }

    async checkCourseExisted(req, res, next){
        try {
            this.updateMiddleWare(req, res, next);
            let {courseid} = req.body;
            if (courseid == null) return this.badRequest("courseid is not valid");
            let course = await CoursesDAO.getInstance().getById(courseid);
            if (course == null) return this.badRequest("Courses is not existed");
            req.course = course;
            return next();
        } catch (e){
            console.log(e);
            return this.serverError(e);
        }
    }

    async checkLessonExisted(req, res, next){
        try {
            this.updateMiddleWare(req, res, next);
            let {lessonid} = req.body;
            if (lessonid == null) return this.badRequest("lessonid is not valid");
            let lesson = await LessonDAO.getInstance().getById(lessonid);
            if (lesson == null) return this.badRequest("Lesson is not existed");
            req.lesson = lesson;
            return next();
        } catch (e){
            console.log(e);
            return this.serverError(e);
        }
    }

// end 

    // patch /api/admin/limit
    // header: token
    // body: email, warning
    async limitAccount(req, res, next){
        try{
            this.updateMiddleWare(req, res, next);
            let {account} = req;
            let {warning, email} = req.body; 
            if (warning != 0 && warning != 1 && warning != 2 && warning != 3)
                return this.badRequest("warning is not valid");
            if (account.role == 'admin') return this.info("Cannot limit admin");
            account.warning = warning;
            
            // update limit:
            let rs = await AccountDAO.getInstance().update({
                warning: account.warning,
                time: DateTime.now()
            }, {
                email: account.email
            });

            if (!rs) return this.serverError();
            return this.success("Success", account);
        } catch (e){
            console.log(e);
            return this.serverError(e);
        }

    }

    // get api/admin/account
    // header: token
    async getListAccount(req, res, next){
        try{
            this.updateMiddleWare(req, res, next);
            let {account, pagination} = req;
            let accounts = await AccountDAO.getInstance().selectDetail({
                "1" : 1
            }, ["account.*", "profile.name", "profile.avatar"], pagination);
            if (!accounts) return this.badRequest(this.serverError);
            return this.success("Success", {
                length: accounts.length,
                data: accounts
            });
        } catch (e){
            console.log(e);
            return this.serverError(e);
        }

    }

    // delete /api/admin/account
    // header: token, body: email
    // ========== BỎ API NÀY =============
    async deleteAccount(req, res, next){
        try{
            this.updateMiddleWare(req, res, next);
            let {account} = req;
            if (account.role == 'admin') return this.info("Cannot delete admin");
            if (account.warning != 3) 
                return this.info("Only can delete user at 3rd warning limition");
            let deltaTimeStamp = DateTime.deltaTimestamp(DateTime.now(), account.DateTime)
            if (deltaTimeStamp < 7*24*3600) // 7 days to seconds
                return this.info("Please wait for " + (deltaTimeStamp / (24*3600) + " days."));
            
            // delete account: Login, Profile, Code,  
            // update Account to 
            let rs1
        } catch (e){
            console.log(e);
            return this.serverError(e);
        }

    }

    // delete api/admin/course
    // header: token, body: courseid
    async deleteCourse(req, res, next){
        try{
            this.updateMiddleWare(req, res, next);
            let {account, course} = req;

            // delete course: Payment, Learn, CourseLesson, Request, Comment, Mark, Score, Courses, Categories
			let rs1 = PaymentDAO.getInstance().delete({courses_id: course.knowledge_id});
			let rs2 = LearnDAO.getInstance().delete({courses_id: course.knowledge_id});
			let rs3 = CoursesLessonDAO.getInstance().delete({courses_id: course.knowledge_id});
			let rs4 = RequestDAO.getInstance().delete({courses_id: course.knowledge_id});
			let rs5 = CommentDAO.getInstance().delete({knowledge_id: course.knowledge_id});
			let rs6 = MarkDAO.getInstance().delete({knowledge_id: course.knowledge_id});
			let rs7 = ScoreDAO.getInstance().delete({knowledge_id: course.knowledge_id});
			let rs8 = CategoriesDAO.getInstance().delete({knowledge_id: course.knowledge_id});
			// ...
			[rs1, rs2, rs3, rs4, rs5, rs6, rs7] =
				await Promise.all([rs1, rs2, rs3, rs4, rs5, rs6, rs7]);
			let rs = await CoursesDAO.getInstance().delete({knowledge_id: course.knowledge_id});

			if (!rs || !rs1 || !rs2 || !rs3 || !rs4 || !rs5 || !rs6 || !rs7 || !rs8) 
                return this.serverError("Delete course failed");
			return this.success("Xóa bài học thành công");

        } catch (e){
            console.log(e);
            return this.serverError(e);
        }

    }

    // delete api/admin/lesson
    // header: token, body: lessonid
    async deleteLesson(req, res, next){
        try{
            this.updateMiddleWare(req, res, next);
            let {account, lesson} = req;

            // delete lesson: Comment, Mark, Score, CourseLesson, Lesson, Categories
			let rs1 = CommentDAO.getInstance().delete({knowledge_id: lesson.knowledge_id});
			let rs2 = MarkDAO.getInstance().delete({knowledge_id: lesson.knowledge_id});
			let rs3 = ScoreDAO.getInstance().delete({knowledge_id: lesson.knowledge_id});
			let rs4 = CoursesLessonDAO.getInstance().delete({lesson_id: lesson.knowledge_id});
			let rs5 = CategoriesDAO.getInstance().delete({knowledge_id: lesson.knowledge_id});
			[rs1, rs2, rs3, rs4] = await Promise.all([rs1, rs2, rs3, rs4]);
			let rs = await LessonDAO.getInstance().delete({knowledge_id: lesson.knowledge_id});
	
			if (! (rs && rs1 && rs2 && rs3 && rs4 && rs5)) return this.serverError("Delete lesson failed");
			return this.success("Success", lesson);
        } catch (e){
            console.log(e);
            return this.serverError(e);
        }

    }

    // post /api/admin/add-admin/
    // header: token
    // body: username, password, name
    async addAdmin(req, res, next){
        try{
            this.updateMiddleWare(req, res, next);
            let {email, password, name} = req.body;
            if (! (email && password && name)) return this.badRequest("Params are invalid");

            if (password.length < 4) return this.badRequest("Password is invalid");

            let account = await AccountDAO.getInstance().getById(email);
            if (account != null) return this.info("Email is existed");

            account = new Account({
                email: email, password: password,
                warning: 0, role: 'admin', time: DateTime.now()
            });
            let profile = new Profile({
                email: email, name: name,
                gender: 'other', visible: '0'
            });
            let rs1 = await AccountDAO.getInstance().insert(account);
            let rs2 = await ProfileDAO.getInstance().insert(profile);
            if (! (rs1 && rs2)) return this.serverError("Create account failed");
            rs1 = {...rs1, ...rs2};
            return this.success("Success", rs1);
        } catch (e){
            console.log(e);
            return this.serverError(e);
        }
    }
}

module.exports = AdminController;