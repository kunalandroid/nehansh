require('jshint')
/* jshint strict: true */
// const Joi = require('joi') // For INput Validation
const express = require('express')
const app = express()
app.use(express.json())//Otherwise JSON is not supported

//Third party middleware to log each http request
const morgan = require('morgan');
app.use(morgan('short'));

//FIREBASE
const fs = require('firebase-admin');
const crypto= require('crypto');

const serviceAccount = require('./credentials/privateKey.json');

fs.initializeApp({
 credential: fs.credential.cert(serviceAccount)
});

var reportId = 001;
const db=fs.firestore(); 
const reports = db.collection('reports');
reports.doc(reportId.toString()).set({
    reportid: reportId,
    nameOfMissingPerson: 'Name',
    photoUrl: 'https://domp.ml/',
    address: '133 5th St., San Francisco, CA',
    dob: '05/13/1990',
    age: '30',
    status: "Missing",
    mutationHistory: [],
    lastUpdate: Date.now(),
    aadharID: "AAAA6666",
   });

++reportId;

reports.doc(reportId.toString()).set({
    reportid: reportId,
    nameOfMissingPerson: 'Name',
    photoUrl: 'https://domp.ml/',
    address: '133 5th St., San Francisco, CA',
    dob: '05/13/1990',
    age: '30',
    status: "Missing",
    mutationHistory: [],
    lastUpdate: Date.now(),
    aadharID: "AAAA6666",
   });

++reportId;
++reportId;

//HOME
app.get('/', (req, res) => res.send('Welcome to DOMP Node.js Server'));

//GET new Report ID
app.get('/api/create', (req, res) => {
    res.send((reportId++).toString());
});

//GET all reports
app.get('/api/reports/', async (req,res)=>{
    const rep = db.collection('reports');
    const reps = await rep.get();
    const report=[];
    var i =0;
    reps.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        report[i]=doc.data();
        ++i;
      });
      res.send(report);
});

//GET by Report id
app.get('/api/reports/:id', async (req,res)=>{
    console.log(req.params.id + " needs to be fetched!");
    const rep = db.collection('reports').doc(req.params.id);
    const reps = await rep.get();
    
    if(reps==null)
    console.log("NULLLLL");
    else
    res.send(reps.data());

    console.log(reps.data());
});

//POST a new report
app.post('/api/add/:id', async(req,res)=>{
    //generate new hash

var current_date = (new Date()).valueOf().toString();
var random = Math.random().toString();

   await reports.doc(req.params.id.toString()).set({
    reportid: req.params.id,
    nameOfMissingPerson: req.body.nameOfMissingPerson,
    photoUrl: req.body.photoUrl,
    address: req.body.address,
    dob: req.body.dob,
    age: req.body.age,
    status: req.body.status,
    mutationHistory: 
    // openchain.encoding.encodeString(req.body.nameOfMissingPerson),
    fs.firestore.FieldValue.arrayUnion(
        crypto.createHash('sha1').update(current_date + random).digest('hex')
      ),
    createdAt:fs.firestore.FieldValue.serverTimestamp(),
    lastUpdate: fs.firestore.FieldValue.serverTimestamp(),
    aadharID: req.body.aadharID,
   });
   res.send(req.params.id+ " ADDED SUCCESSFULLY!");
})

//update status of a specific Report
app.put('/api/update/:id/', async(req,res)=>{
   console.log(req.params.id + " " + req.query.status);
   await reports.doc(req.params.id.toString()).update({
     status: req.query.status,
     mutationHistory: fs.firestore.FieldValue.arrayUnion(crypto.randomBytes(20).toString('hex')),
     lastUpdate: fs.firestore.FieldValue.serverTimestamp()
    });
    res.send(req.params.id+ "'s Status updated SUCCESSFULLY!");
 })

//__________________________________________________________________________________________________________________________
//==========================================================================================================================
//__________________________________________________________________________________________________________________________
 //OPENCHAIN
 var openchain = require("openchain");
 var bitcore = require("bitcore-lib");
 
//  var seed = "7c84db626389ab1edba9025e4e392433";
 
//  // Load a private key from a seed
//  var privateKey = bitcore.HDPrivateKey.fromSeed(seed, "openchain");
//  var address ="XqHptwPBqyGH5XZQJBWXQ2Gw9a5UJR3d78";
//  //privateKey.publicKey.toAddress();
 


//  // Calculate the accounts corresponding to the private key
//  var dataPath = "/asset/p2pkh/" + address+ "/metadata/";
//  var recordName = "datarecord";
//  var storedData = "This is the data to store in the chain";
 
//  console.log("Account path: " + dataPath);
//  console.log("Record name: " + recordName);
 
//  // Create an Openchain client and signer
//  var client = new openchain.ApiClient("http://192.168.29.219:8080/");
//  var signer = new openchain.MutationSigner(privateKey);
 
//  client.getAccountRecord(
//     // Account path
//     "/p2pkh/XemY9P5tkxcnX9USc46jjHoZz6PiBdmcpz/",
//     // Asset path
//     "/asset/p2pkh/XjMCCjXtUP9uQWGAzs3K6RWhLPigH2Dwtv/asdef")
// .then(function (result) {
//     const buffer = result.key.toBuffer();

//     console.log(Buffer.isBuffer(buffer));
//     console.log(buffer.toString());
//     // console.log("Balance: "+ result.value.toBuffer());
// });

//  // Initialize the client
//  client.initialize()
//  .then(function () {
//      // Retrieve the record being modified
//      return client.getDataRecord(dataPath, recordName)
//  })
//  .then(function (dataRecord) {

//      // Encode the data into a ByteBuffer
//      var newValue = openchain.encoding.encodeString(storedData);
 
//      // Create a new transaction builder
// return new openchain.TransactionBuilder(client)
//          // Add the key to the transaction builder
//          .addSigningKey(signer)
//          // Modify the record
//          .addRecord(dataRecord.key, newValue, dataRecord.version)
//          // Submit the transaction
//          .submit();
//  })
//  .then(
//      function (result) {
//         console.log(result); 
//     });

//  client.getAccountRecord(
//     // Account path
//     "/p2pkh/XemY9P5tkxcnX9USc46jjHoZz6PiBdmcpz/",
//     // Asset path
//     "/asset/p2pkh/XqHptwPBqyGH5XZQJBWXQ2Gw9a5UJR3d78/")
// .then(function (result) {
//     console.log("Balance after transaction: " + result.key + result.value + result.balance);
// });


// app.get('/api/courses/:id',(req,res)=>{
//     const cr = Courses.find(c => c.id === parseInt(req.params.id));
//     console.log(cr);
//     if(!cr) res.status(404).send("Requested Course Not Found")
//     else res.send(cr)
// })

// app.get('/test',(req,res)=> res.send('Testing on port '+ port))

// app.post('/api/courses',(req,res)=>{
// //     const {error} =ValidateCourseName(req.body);

// // if(error){
// //     res.status(400).send(error.details[0].message);
// //     return;
// // }
//     const course={
//         id: Courses.length + 1,
//         name: req.body.name
//     };
//     Courses.push(course);
//     res.send(course);
// })

// app.put('/api/courses/:id',(req,res)=>{
//     const cr = Courses.find(c => c.id === parseInt(req.params.id));
//     if(!cr) res.status(404).send("Requested Course Not Found")
//     else {
//         const {error} =ValidateCourseName(req.body);


//         if(error){
//             res.status(400).send(error.details[0].message);
//             return;
//         }
//             cr.name=req.body.name;
//             res.send(cr);
//         }
// })

// app.delete('/api/courses/:id',(req,res)=>{
//     const cr = Courses.find(c => c.id === parseInt(req.params.id));
//     if(!cr) res.status(404).send("The course you want to Delete is NOT FOUND");
//     else{
//     const index =Courses.indexOf(cr);
//     Courses.splice(index,1);

//     res.send(cr);
//     }
// })
// function ValidateCourseName(body){
//     const schema = Joi.object({
//         name: Joi.string().min(4).required()
//     })
//     return schema.validate(body);
// }

const port = process.env.port || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`))