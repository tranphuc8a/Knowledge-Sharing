# Sử dụng image node v14.x.x
FROM node:18.12.1

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và package-lock.json vào thư mục làm việc
COPY package.json ./

# Cài đặt các dependencies từ file package.json
RUN npm install

# Sao chép các file nguồn của ứng dụng vào thư mục làm việc
COPY . .

# Mở cổng mà ứng dụng sẽ lắng nghe
EXPOSE 3001

# Thiết lập biến môi trường cho quá trình chạy ứng dụng
ENV NODE_ENV=development

# Chạy ứng dụng
CMD [ "npm", "run", "dev", "--", "--host" ]