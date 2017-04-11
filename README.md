# User API for Red X test

## Local Development Setup

1. `npm install`
1. `npm run start`
1. Navigate to [http://localhost:3000/api](http://localhost:3000/api)
---

Endpoints:

* '/api/create'
    * Example: /api/create?first=Aaron&last=Ford&username=aaronford&password=Abc123@!321cbA

Create a new user, returns a unique ID. Params: first, last, username, password.
Usernames can't contain an ampersand (&), equal sign (=), brackets (<,>), plus sign (+), comma (,), or periods (.).
Usernames can contain letters (a-z), numbers (0-9), dashes (-), and underscores (_).
Usernames can begin or end with non-alphanumeric characters, with a maximum of 64 characters.
Passwords must contain a minimum of 8 and Maximum of 63 characters with at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character.

'/api/login'
* Example: /api/login?username=aaronford&password=Abc123@!321cbA

Returns a token (in this case the user id, but a specific token could be generated). Params: username, password

'/api/fetch'
*  Example: /api/fetch?username=aaronford

Returns user data (including password, but this could be removed). Params: username

'/api/update'
* Example: /api/update?username=aaronford&first=Ron&last=Chevy&password=newPassword123!

Updates any existing parameters for user. Params: username, any params from create you want to change.

'/api/delete'
* Example: /api/delete?username=aaronford

Deletes an existing user. Params: username