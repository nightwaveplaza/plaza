[![Crowdin](https://badges.crowdin.net/nightwave-plaza/localized.svg)](https://crowdin.com/project/nightwave-plaza)
![Node](https://img.shields.io/badge/node-%3E%3D18.x-339933?logo=node.js&logoColor=white)
![Vue](https://img.shields.io/badge/vue-3.x-42b883?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/vite-7.x-646cff?logo=vite&logoColor=white)

#  🌃 Nightwave Plaza

Nightwave Plaza is a continuously running online radio station focused on vaporwave and future funk.

This repository contains the frontend monorepo powering the Nightwave Plaza web interface and mobile app view.

🌐 https://plaza.one  

---

## 📦 Repo Structure
```
src/
  app/ # Shared application code
  mobile/ # Mobile-specific code
```

## 🏗 Build
### Web

Configure .env:
```
VITE_API_URL=https://api.plaza.one
VITE_APP=app
VITE_BUILD_PATH=/plaza/build
```

Then build:
```bash
yarn build
```

The output directory will contain the production-ready bundle.

### Mobile View
The mobile build uses the same configuration, but you need to set `VITE_APP=mobile` in your env. 

It is intended to be embedded inside the native Android / iOS applications and does not function as a standalone mobile application.

## 🌍 Translations

Localization is managed via Crowdin. You can help translate the application into your language here:
https://crowdin.com/project/nightwave-plaza