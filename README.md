#OpenGameArt README

##Things used
- [node.js](http://nodejs.org) Backend Server
- [express.js](http://expressjs.com) Backend Server 
- [bootstrap](http://twitter.github.com/bootstrap/) Frontend structure
- [jqueryui](http://jqueryui.com) Frontend JS
- [npm](https://npmjs.org) Installer
- [Heroku](https://toolbelt.heroku.com) Live tests
- [Postgresql](http://www.postgresql.org) Backend Database
- [Ejs](http://embeddedjs.com) Backend view engine
- [gm](http://aheckmann.github.com/gm/) Image manipulation
- [imagemagick](http://www.imagemagick.org) gm is based of this.
- [fs](http://nodejs.org/api/fs.html) Middleware File system
- [toobusy](https://github.com/lloyd/node-toobusy) Middleware Backend load failure handler;
- [connect-cachify](https://github.com/mozilla/connect-cachify/) Middleware caching and concatenating
- [client-sessions](https://github.com/benadida/node-client-sessions)
- [bcrypt](https://github.com/ncb000gt/node.bcrypt.js/)

##Security
Why bcrypt?
[Here](http://codahale.com/how-to-safely-store-a-password/)
and [more](http://en.wikipedia.org/wiki/Crypt_(Unix)#Blowfish-based_scheme)
and a [Paper by provos](http://static.usenix.org/events/usenix99/provos/provos.pdf)

##Toobusy
This lets us timeout a client connection if we can't handle it at. This is better then letting the client hang.

##Connect-cachify
This makes 'for production' js min files and css files(concatenating). It also caches them for faster access.

##client-sessions
Why use this? This stores session info on the client browser instead server-side. Faster + scalablity.
Downside is trusting the client not to edit the sessions but this library is secure and tamper-free!

##gm
Image stuff. Useful for image effects and indirectly useful for thumbnailing things.

##Installation
Make a folder somewhere called opengameart.

	mkdir opengameart

Then open the folder.

	cd opengameart

And clone the repo:

	git clone https://bitbucket.org/JemimaLight/opengameart.git

And then add the remote(change username):

	git remote add origin https://YourUsername@bitbucket.org/JemimaLight/opengameart.git

When working on new things make a git branch(for example it is called 'hotfix'): [more from bitbucket](https://bitbucket.org/JemimaLight/opengameart/commits/featurebranches)

	git checkout -b hotfix

	git add .

	git commit -m "Changes made"

	git push origin hotfix

If you want to add it back into the main branch submit a pull request from your browser.

To update you repo with the remote repo do:[more from bitbucket](https://bitbucket.org/JemimaLight/opengameart/pull-requests)

	git pull

If you are using the GUI version of Git lots of these are easy button presses.

##Heroku
We can use Heroku for live testing.

Download from above, install and make an account. 
Then you can login.

	heroku login

	heroku create

You can test it before uploading it to Heroku by using

	foreman start

Foreman comes installed with Heroku.

Once ready for a live test:

	git push heroku master

And to check it out:

	heroku ps:scale web=1

	heroku open