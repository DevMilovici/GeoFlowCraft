FROM node:lts-alpine

WORKDIR /app
COPY . .
RUN npm install

# Expose the port that the application listens on.
EXPOSE 5173

# Run the application.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]