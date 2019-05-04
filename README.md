# Change history (descending order from newest to oldest):
- Ran into a problem with vagrant ports. Need to connect to host 192.168.33.10 instead of localhost for server
- OR connect to vagrant using: vagrant ssh -- -L 5000:localhost:5000
- 
- System will now remind users if they have not payed their membership fee.
- Admins can now delete users from the database
- Admins can now rename users and change their roles
- User info page works completely. Users can update their username, password and can unregister.
- Users can now unregister
- Added roles to DB and views. Menu now only shows certain things according to your role
- MVC structure and MongoDB somewhat working. Template engine also in use.
- "npm run client-install" installs react dependencies in client folder from its package.json file
- Use npm run dev to run client and server concurrently
- Added port 5000 as proxy to react app's package.json
- Used create-react-app to create front end in folder 'client'
- Created server.js as driver file
- Initialized git and npm

#Note-to-self:
- Check that not just anyone can use get routes to delete things from db!!!!!