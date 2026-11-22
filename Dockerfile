# 1. Base Image: Use a lightweight Alpine Linux image with Node.js pre-installed
FROM node:20-alpine

# 2. Set the active folder inside the container
WORKDIR /app

# 3. Copy package files first and install dependencies (enables Docker layer caching)
COPY package*.json ./
RUN npm install

# 4. Copy your remaining source code (app.js, test.js) from your PC into the container
COPY . .

# 5. Tell Docker which port your Node.js server listens on
EXPOSE 3000

# 6. Define the command that runs when the container boots up
CMD ["node", "app.js"]