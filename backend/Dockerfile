FROM node:20.19-alpine

WORKDIR /app
COPY . .
RUN npm i

# Expose the port that the application listens on.
EXPOSE 5555

# Run the application.
CMD ["node", "server.js"]