LINK TO LIVE APP: https://blogapi-client-stalloyde.fly.dev/posts

This is the content management system for Blog API Client. It is for the author to create, edit or delete posts/comments. It is not for public use.

The project was developed using the following technologies:
Front-end: React + Typescript
Back-end: NodeJS + Express
Database: MongoDB

Here are the links to repos associated to this project:
- API: https://github.com/Stalloyde/blog-api
- CMS: https://github.com/Stalloyde/blogapi-cms

All users are able to read blog posts. Login is required to post comments.

This project highlights the following skills: 
- Jam-stack approach of back and front-end
- Building a RESTful API 
- User authentication with JSON Web Tokens (JWT)
- Mobile responsivity

Photo Credits: [Add on to this list on each new post]
Photo by <a href="https://unsplash.com/@ilvagabiondo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Il Vagabiondo</a> on <a href="https://unsplash.com/photos/city-with-high-rise-buildings-during-night-time-Jy7wD-TiJ2A?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  
Photo by <a href="https://unsplash.com/@anik3t?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Aniket Deole</a> on <a href="https://unsplash.com/photos/cityscape-photography-of-lighted-city-with-bridge-HWK1zd0OxUU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

Photo by <a href="https://unsplash.com/@htn_films?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Hubert Neufeld</a> on <a href="https://unsplash.com/photos/black-animal-lying-on-ground-TWe4tUsLot8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

Photo by <a href="https://unsplash.com/@zmachacek?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Zdeněk Macháček</a> on <a href="https://unsplash.com/photos/black-eagle-flying-above-snow-field-during-daytime-hxXtAZXqGWs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
