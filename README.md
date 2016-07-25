# Middle C by stackol

An interactive, online soundboard.  Built by the NaNCats as SoundBoard: [Jim](https://github.com/logosghost), [Jear](https://github.com/Jearxj), [Ian](https://github.com/ian-culleton) and [Tim](https://github.com/ProductivePerson). Updated by stackol: [Rebecca](https://github.com/RebeccaGray), [Bohee](https://github.com/boheepark), [Deniz](https://github.com/deniztetik) and [Nick](https://github.com/nicholas-zeiss).

## Installation

Middle C uses React on Node.js, which means you will need to compile using Babel.  The server is written using Express. Additionally there is a database for users and songs using Bookshelf with Knex and Postgres.

##Heroku:
https://middlec.herokuapp.com/
### Quick Start

Clone from GitHub, then run

  >npm install

to install your dependency packages.

Our gulpfile is configured with a few builder methods for compiling and deployment. Use as follows:
> gulp babel
* manually compiled all .jsx files in the components folder into .js files. Pipes them into compiled/components
* REMEMBER YOU ARE USING REACT AND NEED TO COMPILE YOUR .JSX FILES OR ELSE NONE OF YOUR CHANGES WILL rendering
> gulp watch
* Use to monitor your .jsx files for changes and automatically compile them into .js files.
* We never properly configured gulp watch to restart upon breaks, so you'll need to monitor your terminal from
time to time to make sure gulp watch is still running.
> gulp heroku
* pushes to heroku. Won't work out of the box, you need to configure your heroku locally first.
> gulp webpack
* Runs webpack.

For local testing start server using Node:

  >node server/server.js

  or

  >nodemon server/server.js

  Then navigate to your localhost, and enjoy yourself.

## Usage

Soundboard binds each alphabetic key to a soundfile (served statically from ./foley).  To play each sound, simply press each key once.  A second press will stop the sound.

To loop a sound, use the shift key.

Change key bindings by holding the ctrl key (on OSX. For windows users, use alt key) and pressing the key you wish to change.  This will trigger a drop-down menu which lists all the target sounds in the library.  Click the desired sound, and your key will be re-bound.  In that menu you can also click on the 'listen' icon to play a sample sound.

## In this repo

This repo contains the following directories:

  * compiled
  * dist
  * foley
  * public
  * server

### compiled

Target directory for Babel to compile into.  Contains compiled version of the public directory. **DO NOT** edit files in this directory directly!

### dist

Target directory for Webpack.  Contains the bundle.js built by Webpack, before web deploy. **DO NOT** edit files in this directory directly!

### foley

Contains all soundfiles Soundboard has access to.  Adding/removing files from this directory will add/remove them from the app's "library" of sounds.  Sounds are organized in .wav format for consistancy but can be .mp3 or .ogg as well.
For usage across platforms you might need .mp3 and .wav versions of every sound file.


### public

Contains source code for the front-end elements of the app.  The components directory includes all the React code which interacts with index.html to produce the final page.  All of this eventually gets compiled into the /compiled directory.  The source files are as follows:
 * app.jsx: The main logic for the page. All data flows down from here and is declared either in initial states or in componentDidMount. Sets a single event listener to moniter all keypresses and react accordingly.
 * client.jsx: our loading screen. Currently our server loads files instantly so we added a setTimeout around some of our logic to simulate a short loading experience.
 * helpers.jsx: Currently stores all setter-objects. This is where the default keybindings are stored, as well as the important qwertyMap object that maps the key-bindings into a qwerty-oriented array.
 * rebindNode.jsx: contains the render model and some logic for rebinding a song to a key.  Take note of what data is passed to it through the app.jsx render function. We pass the this.reRender function from app.jsx down into rebindNode for easy rendering of the DOM after a key-binding event.
 - vKey.jsx: contains the render model and some logic for dispaying and handling key presses.

### server
Contains back-end: routes and database.

Contains all the code for the back-end elements of the app.  All of these files are used as helper files for server.js.  **NOTE** the lib and model directories contain schemas and config files for a Mongoose database.  This database is currently not functional/necessary but may become so during future development.
