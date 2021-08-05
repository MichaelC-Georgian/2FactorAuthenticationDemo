<h1>The 2 Factor Authentication Demo</h1>
<label>These are the NPM commands to install all of the NPM Modules and create the HandleBars Template</label>
<ul>
    <li>npm i express</li>
    <li>npm i express-generator</li>
    <li>npx express-generator --view=hbs</li>
    <li>npm install</li>
    <li>npm i mongoose</li>
    <li>npm i passport passport-local passport-local-mongoose express-session</li>
</ul>
<h2>Step Locations</h2>
<p>Steps 1 and 2 are in app.js</p>
<p>Steps 3 - 7 are in twoFactorAuth.js router </p>
<p>There new files used are: in routes twoFactorAuth.js, in new folder twoFactorAuth: index.hbs, twoFactorSuccess.hsb, validateCode.hbs</p>
<p>There are two new NPM modules used: 
npm i speakeasy
npm i node-qrcode</p>