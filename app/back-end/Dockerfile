# Sử dụng image chứa Node.js phiên bản ổn định
FROM node:18.12.1

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Mở cổng mà ứng dụng sẽ lắng nghe
EXPOSE 3000

# Chạy lệnh để khởi động ứng dụng
CMD [ "npm", "start" ]