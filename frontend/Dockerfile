# 1. Grab a small Linux computer with Node.js 18 installed
FROM node:18-alpine

# 2. Make a folder inside the container called /app
WORKDIR /app

# 3. Copy our package list into the container
COPY package.json .

# 4. Install all the React.js packages
RUN npm install

# 5. Copy the rest of our frontend code into the container
COPY . .

# 6. Expose port 3000 so the outside world can connect
EXPOSE 3000

# 7. Start the React.js development server!
CMD ["npm", "start"]
