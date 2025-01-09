# Specifies a parent image
FROM golang:1.23-alpine

# Adds metadata for the image
LABEL maintainer="Maximilian Dorninger"
LABEL version="1.0"
LABEL description="A Chat app made for Hack Club High Seas in Golang"

# Creates an app directory to hold your app’s source code
WORKDIR /app

# Copies everything from your root directory into /app
COPY go.sum .
COPY go.mod .
COPY main.go .
COPY ./static ./static

# Installs Go dependencies
RUN go mod download

# Builds your app with optional configuration
RUN go build -o /godocker

# Defines a mount point for data persistence
VOLUME ["/app/data"]

# Tells Docker which network port your container listens on
EXPOSE 8080

# Specifies the executable command that runs when the container starts
CMD ["/godocker"]