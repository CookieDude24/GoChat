# GoChat

<p align="center">
<img alt="golang gopher - gochat logo" src="src/website/static/favicon.png" width="350"/>
<img alt="Svelte Kit Logo" src="https://github.com/sveltejs/branding/blob/master/svelte-vertical.png" width="400"/>


</p>

GoChat is a web chat application made with Golang (Backend) and SvelteKit (Frontend).

## Features

- **Real-time Messaging:** instant delivery of messages using WebSockets
- **Message History:** stores chat history
- **Custom Profile Pictures:** upload your own .png to use as profile picture
- **beautiful css animations**
- **easily hostable:** I packaged it as a docker container, so it's very easy to selfhost

## Motivation and things I learned

I've always wanted to build something with Go, since some very cool projects like Traefik, K8s or
Dockerare made with it. Also I read that many people like the simplicity of Go and its net/http package.
And aftermaking my first project with Go, I definitively have to say: Go is a very simple language, 
its reminding me of C, also the net/http package is great to use when making an API-Server!

At first made the website with pure JS, not any of these fancy JS Frameworks. Soon did I find my self in
a messy spaghetti-like codebase. Especially state management broke my mind completely. So I started looking
for a _reactive_ JS framework and I found Svelte (-Kit). I immediatly fell in love with it. Developing with
Sveltekit is a really fun and intuitive experience as it's basically just standard HTML, CSS and JS with
some svelte specific things like Runes or transitons added. With my next project I would definitly use
SvelteKit as my backend too, because then I would be able to utilize Server side rendering, which
makes websites load incredibly fast.


## Technologies Used

- **Frontend:**
    - HTML, CSS
    - SvelteKit
    - Built with [BeerCSS](https://beercss.com) CSS-Framework for Material 3 Design

- **Backend:**
    - Built using Go (Golang) for efficient server-side processing.
    - WebSockets
    - Docker
    - SQLite as DB

## Attributions

  The GoChat Logo was created by Takuya Ueda (https://twitter.com/tenntenn). Licensed under the Creative
  Commons 3.0 Attributions license.
