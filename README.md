# Full-Stack

## Exercise 3.10
- Phonebook backend step 10 ask me to create a README.md at the root of your repository, and add a link to your online application to it.
- Here is the link: https://phonebook-0vlg.onrender.

# Notes
```
npm create vite@latest introdemo -- --template react

npm install axios

npm install json-server --save-dev

"server": "json-server -p 3001 db.json"

```

backend

```
npm init
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT"
}

npm install express

npm install morgan

npm install cors
```

deploy
```
"build:ui": "rm -rf dist && cd ../frontend && npm run build && cp -r dist ../backend",
"deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push"
```