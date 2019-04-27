//Requires
const express = require('express');

//Initialize express app
const app = express();

app.get('/', (req, res)=>{
  //Hardcoded array of users, change this to use mongoDB later
  const users = [
    {id: 1, firstName: 'Janis', lastName: 'Suonperä', admin: true},
    {id: 2, firstName: 'Tibe', lastName: 'Stöö', admin: false},
    {id: 3, firstName: 'Teme', lastName: 'The SaliBeast', admin: false}
  ];

  res.json(users);
});

//Using port 5000 because create-react-app uses port 3000
const port = 5000;
app.listen(port, ()=>console.log(`Server running on port ${port}`));
