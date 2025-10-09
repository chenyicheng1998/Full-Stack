# Full-Stack

## Exercise 3.10
- Phonebook backend step 10 ask me to create a README.md at the root of your repository, and add a link to your online application to it.
- Here is the link: https://phonebook-backend-96q9.onrender.com




---



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

```
npm install mongoose
npm install dotenv
```

backend:
```
npm install eslint @eslint/js --save-dev
```
```shell
(base) yicheng@surface:~/Desktop/Full-Stack/part3/phonebook_backend$ npx eslint --init
You can also run this command directly using 'npm init @eslint/config@latest'.

> phonebook_backend@1.0.0 npx
> create-config

@eslint/create-config: v1.10.0

✔ What do you want to lint? · javascript
✔ How would you like to use ESLint? · syntax
✔ What type of modules does your project use? · commonjs
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
The config that you've selected requires the following dependencies:

eslint, globals
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · npm
☕️Installing...

added 1 package, changed 1 package, and audited 177 packages in 606ms

41 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Successfully created /home/yicheng/Desktop/Full-Stack/part3/phonebook_backend/eslint.config.mjs file.
```
```
npm install --save-dev @stylistic/eslint-plugin-js
```
```mjs
import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**'],
  },
]
```

```
npm install cross-env
npm install --save-dev supertest
```