# Maven Project
# --- build stage ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# install dependencies
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline
# build
COPY src ./src
RUN mvn -q -DskipTests package

# --- serve stage ---
FROM eclipse-temurin:21-jre
WORKDIR /app
# Copy jar from build stage to serve stage
COPY --from=build /app/target/*.jar app.jar
# Set enviroment variables
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"
# ENV SPRING_PROFILES_ACTIVE=prod
# ENV SPRING_PROFILES_ACTIVE=nodb

EXPOSE 8088
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -jar app.jar" ]


