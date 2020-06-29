
## Table of Contents
- [Introduction](#introduction)
- [The Entscheidomat](#the-entscheidomat)
    - [Additional Settings](#additional-settings)
    - [List features](#list-features)
- [Available Scripts](#available-scripts)
    - [npm start](#npm-start)
    - [npm test](#npm-test)
    - [npm run build](#npm-run-build)

## Introduction
Everyone knows the problem of not being able to make a decision.
Whether it's about where to go to have lunch, a person that should be your 
team mate or just which book you want to read next.
The solution is pretty simple: It's the Entscheidomat, that will make the decision for you!

## The Entscheidomat
The Entscheidomat is very simples. It's a list, where you can insert options you have to decide for.
One option is one line.
After clicking on `Start` the options will be used and every few milliseconds a random option
is selected an shown below. When you click now on `Stop`, the selecting gets slower and slower
and shows the selected option in the end.
Also the current list is saved in the local storage, when you start the randomizing.
So don't have to enter the options the next time you visit the page!


### Additional Settings
Below the Entscheidomat is a control bar. There you can configure some settings.

#### Music
While the Entscheidomat goes through the options, you can play a selected
music track or disable the music.

#### Firework
Enable or disable firework when an option has been selected.

### List features
You can mark options of the list as good or bad options.
To mark one option as good, write a `+` before the option.
For a bad option, write a `-` before the option.
Good or bad options will be play a corresponding sound when selected.
Example:<br/>
```
+Good 1
+Good 2
-Bad 1
-Bad 2
+Good 3
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!