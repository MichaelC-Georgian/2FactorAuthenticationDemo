Must Read: With the free version of nexmo, only the phone number that is registered to the apiKey can be contacted. 
Once you switch to their paid service it allows for other numbers to be reached.

------- Step by Step Guide: ------- 
GLOBALS.js SETUP
Step 1: Setup globals.js by registering at https://dashboard.nexmo.com/ and then take include your apiKey, apiSecret, and mongoDB connection string.

DEPENDENCY SETUP
Step 2: Install the library with "npm install @vonage/server-sdk".

SMSAUTHENTICATOR.js SETUP
Step 3: Add the require statement for @vonage/server-sdk and for our globals file in smsAuthenticator.js

Step 4: Create a Vonage object with your apiKey and apiSecret in smsAuthenticator.js

Step 5: Create our /verify POST method in smsAuthenticator.js

Step 6: Create our /check POST method in smsAuthenticator.js and set our 2fa session value to true in the event of a successful 2fa login.

Step 7: Create our GET methods for /verify and /check in smsAuthenticator.js

Step 8: Create our addPhone POST method to handle updating users phone numbers in smsAuthenticator.js

INDEX.js SETUP
Step 9: Set our 2fa session value to false in our router.get logout method in index.js 




------- Additional Information: -------
Differences between this and Connor's 2FA method:

Added cookie: {secure:false} to our session definition in app.js. Setting it to true is more secure but requires an HTTPS environment.
Comments and HTML content changed to reflect different environment.
Added phonenumber to the users model as phone.
Added phonenumber parameter to registration.
Changed globals config to personal DB from Connors.
Added authRouter to app.js and used it.


------- References: ------- 
Our in class express login lessons:
https://codeburst.io/how-to-add-two-factor-authentication-with-node-js-and-express-7cad30aac4c
https://dashboard.nexmo.com/getting-started/verify

