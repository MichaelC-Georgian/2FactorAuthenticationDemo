<h1>2 Factor Authentication with SMS and TTS</h1>
<h4>Must Read:</h4> 
With the free version of nexmo/vonage, only the phone number that is registered to the apiKey can be contacted. 
Once you switch to their paid service it allows for other numbers to be reached. 

<h2>Step by Step Guide:</h2>

<h3>globals.js setup</h3>

**Step 1:** Setup globals.js by registering at https://dashboard.nexmo.com/ and then take include your apiKey, apiSecret, and mongoDB connection string.



<h3>dependancy setup</h3>

**Step 2**: Install the library with "npm install @vonage/server-sdk" and the other dependancies with "npm install".



<h3>smsAuthenticator.js setup</h3>

**Step 3**: Add the require statement for @vonage/server-sdk and for our globals file in smsAuthenticator.js

**Step 4:** Create a Vonage object with your apiKey and apiSecret in smsAuthenticator.js

**Step 5:** Create our /verify POST method in smsAuthenticator.js

**Step 6:** Create our /check POST method in smsAuthenticator.js and set our 2fa session value to true in the event of a successful 2fa login.

**Step 7:** Create our GET methods for /verify and /check in smsAuthenticator.js

**Step 8:** Create our addPhone POST method to handle updating users phone numbers in smsAuthenticator.js



<h3>index.js setup</h3>

**Step 9:** Set our 2fa session value to false in our router.get logout method in index.js 



<h2>Additional Information</h2>

Differences between this and Connor's 2FA method:
<ul>
<li>The above instructions.</li>
<li>Added "cookie: {secure:false}" to our session definition in app.js. Setting it to true is more secure but requires an HTTPS environment.</li>
<li>Comments and HTML content changed to reflect different environment.</li>
<li>Added phonenumber to the users model as phone.</li>
<li>Added phonenumber parameter to registration.</li>
<li>Changed globals config to personal DB from Connors.</li>
<li>Added authRouter to app.js and used it.</li>
</ul>

<h2>References</h2>

Our in class express login lessons

https://github.com/ConnorWatsonGitHub/2FactorAuthenticationDemo

https://codeburst.io/how-to-add-two-factor-authentication-with-node-js-and-express-7cad30aac4c

https://dashboard.nexmo.com/getting-started/verify

