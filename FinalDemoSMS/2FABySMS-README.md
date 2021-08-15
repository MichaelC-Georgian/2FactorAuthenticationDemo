Based on the tutorial here: https://codeburst.io/how-to-add-two-factor-authentication-with-node-js-and-express-7cad30aac4c
and here: https://dashboard.nexmo.com/getting-started/verify 

Step 1: Setup globals.js by registering at https://dashboard.nexmo.com/ and then take note of apiKey and apiSecret

Step 2: Install the library with "npm install @vonage/server-sdk" to our starter code.

Step 3: Add the require statement for @vonage/server-sdk and for our globals file in smsAuthenticator.js

Step 4: create a Vonage object with your apiKey and apiSecret in smsAuthenticator.js

Step 5: create our /verify post method in smsAuthenticator.js

Step 6: create our /check post method in smsAuthenticator.js

Step 7: create our Router.GET methods for /verify and /check

Step 8: Create an addPhone post method to handle updating users phone numbers

Step 9: Set our 2fa session value to false in our router.get logout method in index.js 


***Steps to do: Add verify, check, and cancel post handlers


Changes:
Added phonenumber to the users model.
Changed globals config to personal DB
Added phonenumber parameter to registration
Added authRouter to app.js

