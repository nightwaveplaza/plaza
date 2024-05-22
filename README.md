[![Translation status](http://weblate.plaza.one/widget/nightwave-plaza/plaza-app/svg-badge.svg)](http://weblate.plaza.one/engage/nightwave-plaza/)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/9602ea59d4d3486f9e041830761bfe47)](https://app.codacy.com/gh/nightwaveplaza/plaza/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

# Nightwave Plaza 

Monorepo for the web app and the mobile app view.

## Requirements

``` 
nodejs 18
yarn
```

## Project structure

```
src/
  common/  - common code
  desktop/ - website code
  mobile/  - code for mobile view
```

## Compile
#### Website

To compile the website version, you need to make the appropriate changes to the `.env` file.
Example:

```
API_URL=https://api.plaza.one

APP=desktop
BUILD_PATH="/plaza/build"
```

Then run `yarn run build`. As a result, you will get a working copy of Nightwave Plaza website.

#### Mobile

Follow the instruction above. Unlike the website, the mobile version won't work without an Android or iOS application.
