#OpenGameArt README

##Things used
- [node.js](http://nodejs.org)
- [express.js](http://expressjs.com)
- [bootstrap](http://twitter.github.com/bootstrap/) 
- [queryui](http://jqueryui.com)
- [npm](https://npmjs.org)
- [Heroku](https://toolbelt.heroku.com)

##Installation
Make a folder somewhere called opengameart.

	mkdir opengameart

Then open the folder.

	cd opengameart

And clone the repo:

	git clone https://bitbucket.org/JemimaLight/opengameart.git

And then add the remote(change username):

	git remote add origin https://YourUsername@bitbucket.org/JemimaLight/opengameart.git

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

	heroku open