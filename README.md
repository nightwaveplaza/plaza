# Nightwave Plaza UI module

This repository contains UI part for both the website and the mobile app shared common parts of the code.

## Requirements
``` 
nodejs 16+
yarn
```

## Project structure
```
app/
  base/    - common code
  desktop/ - website code
  mobile/  - code for mobile view
assets
  base/    - common assets (images, styles, etc)
  desktop/ - website assets
  mobile/  - mobile assets
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
Then run `yarn run prod`. As a result, you will get a working copy of Nightwave Plaza website.

#### Mobile
Follow the instruction above. Unlike the website, the mobile version won't work without an Android or iOS application.
