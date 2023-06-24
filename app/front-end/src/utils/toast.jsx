
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';

class Toast{
    static instance = null;
    static getInstance(){
        if (this.instance == null) this.instance = new Toast();
        return this.instance;
    }
    static container = <ToastContainer className="toast-container" />;

    constructor(){
        this.config = {
            autoClose: 3000,                        // Thời gian tự động đóng (3 giây)
            position: toast.POSITION.BOTTOM_RIGHT,  // Vị trí hiển thị toast ở góc trên bên phải
            closeButton: false,                     // Hiển thị nút đóng toast
            hideProgressBar: true,                  // Hiển thị thanh tiến trình
            pauseOnHover: false,                    // Tạm dừng đóng toast khi rê chuột vào
            className: "toast-container",
            toastClassName: "toast"
        }
    }

    setMessage(msg){
        this.msg = msg;
        return this;
    }

    setDuration(duration){
        this.config.autoClose = duration;
        return this;
    }

    setClassName(className){
        // this.config.className = className;
        this.config.toastClassName = className;
        return this;
    }

    show(msg = "This is a toast", duration = 3000){
        this.setMessage(msg);
        this.setDuration(duration);
        toast(this.msg, this.config)
    }

    success(msg = "This is a toast", duration = 3000){
        this.setMessage(msg);
        this.setDuration(duration);
        this.setClassName("toast toast-success");
        toast.success(this.msg, this.config);
    }

    info(msg = "This is a toast", duration = 3000){
        this.setMessage(msg);
        this.setDuration(duration);
        this.setClassName("toast toast-info");
        toast.info(this.msg, this.config);
    }
    
    warning(msg = "This is a toast", duration = 3000){
        this.setMessage(msg);
        this.setDuration(duration);
        this.setClassName("toast toast-warning");
        toast.warning(this.msg, this.co);    
    }

    error(msg = "This is a toast", duration = 3000){
        this.setMessage(msg);
        this.setDuration(duration);
        this.setClassName("toast toast-error");
        toast.error(this.msg, this.config);
    }
}

export default Toast;

