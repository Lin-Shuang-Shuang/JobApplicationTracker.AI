# ====== 1. Build the frontend (Vite React) ======
FROM node:18 AS frontend-builder

#Every command I run from now on, pretend I’m inside the /app folder.
WORKDIR /app
#Copies package.json and package-lock.json and they list all the npm packages my frontend needs
COPY frontend/package*.json ./
RUN npm install  # Installs front end dependencies and generates node_modules folder
# Copies frontend code to container
COPY frontend/ ./
#Builds the React app into static files (HTML, JS, CSS) and outputs them to a dist/ folder. These static files are production-ready version of my website
RUN npm run build

#/app/
#├── package.json
#├── package-lock.json
#├── node_modules/
#├── src/
#├── public/
#├── index.html
#├── vite.config.ts
#├── tsconfig.json
#└── dist/ ← FRESHLY BUILT WEBSITE FILES!
#    ├── index.html
#    ├── assets/
#    │   ├── index-eRVZWm_3.js
#    │   └── index-XYZ123.css
#    └── vite.svg

# ====== 2. Build the backend (Spring Boot) ======
FROM azul/zulu-openjdk:21 AS backend-builder

WORKDIR /app
COPY . ./

# Copy frontend build output from the frontend-builder stage into Spring Boot static folder
COPY --from=frontend-builder /app/dist backend/src/main/resources/static

# Builds spring boot app
RUN ./mvnw clean package -DskipTests

#/app/
#├── Dockerfile
#├── pom.xml
#├── mvnw
#├── backend
#│   └── src/
#│      └── main/
#│          ├── java/
#│          └── resources/
#│             └── static/ ← NOW HAS FRESH FRONTEND FILES!
#│                   ├── index.html
#│                   ├── assets/
#│                   │   ├── index-eRVZWm_3.js
#│                   │   └── index-XYZ123.css
#│                   └── other files...
#├── frontend/
#│   ├── package.json
#│   ├── src/
#│   ├── dist/ (old build, if any)
#│   └── node_modules/ (if they existed locally)
#└── target/
#    └── jobtrackerai-backend-0.0.1-SNAPSHOT.jar ← THE MAGIC FILE!
#        (contains both backend code AND frontend files)

# ====== 3. Run the backend JAR ======
#Start with a fresh, clean computer that only has Java installed.
FROM azul/zulu-openjdk:21

WORKDIR /app

# Copies the compiled spring boot jar from the build stage to the final image (app.jar)
COPY --from=backend-builder /app/target/*.jar app.jar

# Tell Docker to listen on port 8080
EXPOSE 8080
# Tell Docker to run java -jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]


#/app/
#└── app.jar ← Complete application (frontend + backend in one file!)