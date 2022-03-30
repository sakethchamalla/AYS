
const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customer')
const Employee = require('./models/employee')
const Mycart = require('./models/mycart')
const Contactus = require('./models/contactus')
const Request = require('./models/request');


// const bodyparser = require('body-parser');
//express app
const app = express();

const dburi ='mongodb+srv://prabhash:prabhash@ays.ilkbu.mongodb.net/AYS?retryWrites=true&w=majority';

mongoose.connect(dburi)
    .then((result) => app.listen(3000));

   

//register view engine
app.set('view engine', 'ejs');

//listen for requests

// middleware and static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));


    var cus1 = {};


    //signup

app.post('/', (req, res) => {
    const customer = new Customer(req.body);
    console.log("Sign up process started");
   console.log(customer);
    Customer.find()
        .then((result) => {     
           var count =0 ;
            result.forEach(element => {
                if (element.email == customer.email) {

                    count += 1;
                }
            })
            console.log(count)
            if (count == 0) {
               customer.save()
                .then((result) => {
                    console.log("new result"+result);
                    cus1 = result;
                    res.render('home',{result});
                })
                .catch((err) => {
                    console.log(err);
                })
            }
            else
            res.send(" <h1>   AN USER  ALREADY  EXISTS  WITH  THIS  EMAIL <h1>");
        })
});


// login
app.post('/home', (req, res) => {
    const customer = new Customer(req.body);
    Customer.find()
        .then((result) => {  
           var found =0 ;
            result.forEach(element => {
                if (element.email == customer.email) {
                    found += 1;
                    result = element;
                    cus1 = element;
                }
            })
            console.log(found)
            if (found == 0) {
                res.send('No defined user ! Login Again')
            }
            else
            {
                console.log( "data is "+cus1);
                res.render('home',{result:cus1});
            }
        })
});

 



//cart
var cart =[];
Mycart.find()
.then((result)=>{
    console.log("bye");
    cart =result;
});

app.post('/packdm', (req, res) => {
     const mycart = new Mycart(req.body);
     mycart.assigned = '0';
     mycart.customerid = cus1._id;
     
     mycart.save()
     .then((result)=>{
         cart.push(result);
         res.render('home');
     });

});

app.post('/packcm', (req, res) => {
    const mycart = new Mycart(req.body);
    mycart.assigned = '0';
    mycart.customerid = cus1._id;
    mycart.save()
    .then((result)=>{
        cart.push(result);
        res.render('home');
    });

});


app.post('/packom', (req, res) => {
    const mycart = new Mycart(req.body);
    mycart.assigned = '0';
    mycart.customerid = cus1._id;
    mycart.save()
    .then((result)=>
    {
        cart.push(result);
        res.render('home');
    });

});


app.post('/packcom', (req, res) => {
    const mycart = new Mycart(req.body);
    mycart.assigned = '0';
    mycart.customerid = cus1._id;
    mycart.save()
    .then((result)=>{
        cart.push(result);
        res.render('home');
    });

});







//employee

app.post('/home/employee', (req, res) => {
    const employee = new Employee(req.body);
    console.log("hii");
   console.log(employee);
    Employee.find()
        .then((result) => {     
           var count =0 ;
            result.forEach(element => {
                if (element.email == employee.email) {

                    count += 1;
                }
            })
            console.log(count)
            if (count == 0) {
               employee.save()
                .then((result) => {
                    console.log("new result"+result);
                    res.render('employee',{result});
                })
                .catch((err) => {
                    console.log(err);
                })
            }
            else
            res.send(" <h1>AN employee  ALREADY  EXISTS  WITH  THIS  EMAIL <h1>");
        })
});

var emp={}
//employee login
app.post('/home/employeepage', (req, res) => {
    const employee = new Employee(req.body);
    Employee.find()
        .then((result) => {  
           var found =0 ;
            result.forEach(element => {
                if (element.email == employee.email) {
                    found += 1;
                    result = element;
                    emp = element;
                }
            })
            console.log(found)
            if (found == 0) {
                res.send(err)
            }
            else
            {
                // console.log( "data is "+cus1);
                res.render('employee',{result:emp});
            }
        })
});




//request
app.post('/myorders', (req, res) => {
    cart.forEach(x=>{
            var d = x._id ;
            console.log("i am in"+ d);
            const  request = new Request (req.body);
            request.served = '0';
            request.customerid = cus1._id;
    
             Employee.find()
              .then((result)=>{
               result.forEach(element => {
               
                   

               if (element.profession == x.servicename)
                   {
                     request.employeeid = element._id ;   
                     // here mycart should be deleted ,asssgined = 0  use find by id and delete  
                     console.log(d);
                     Mycart.deleteOne(d)
                     .then(()=>{
                         console.log("deleted");
                     }
                             );
                     request.save();      
                     Mycart.find()
                     .then((result)=>{
                         console.log("changed");
                         cart =result;
                     });  
                       
                   
                    }
                })
              });
     })
res.render('home');
});






//contact us 

app.post('/home/contactus',(req, res)=>{

    const contactus = new Contactus(req.body)
    contactus.save()

    res.render('contactus',{res:1})
   


})






app.get('/', (req, res) => {
    res.render('index')
})

app.get('/home', (req, res) => {
    res.render('home',{result:cus1});
})





// Our services
app.get('/home/services/packersandmovers', (req, res) => {
    res.render('packersandmovers')
})

app.get('/home/services/vehicleservices', (req, res) => {
    res.render('vehicleservices')
})

app.get('/home/services/homecleaning', (req, res) => {
    res.render('homecleaning')
})

app.get('/home/services/pestcontrol', (req, res) => {
    res.render('pestcontrol')
})


//About page
app.get('/home/about', (req, res) => {
    res.render('about')
})

//Contact Us
app.get('/home/contactus', (req, res) => {
    res.render('contactus')
})

//login/SignUp
app.get('/login-signup', (req, res) => {
    res.render('login')
})

//register as professional
app.get('/register', (req, res) => {
    res.render('register')
})

//profile
app.get('/home/account/profile', (req, res) => {
    res.render('profile',{result:cus1})
})

//cart
app.get('/home/account/cart', (req, res) => {
    res.render('cart',{result:cus1,val:cart})
})

//settings
app.get('/home/account/settings', (req, res) => {
    res.render('settings')
})


//employee login
app.get('/employee-login', (req, res) => {
    res.render('employeelogin')
})

//employee home
app.get('/home/employee', (req, res) => {
    res.render('employee')
})

//employee home
app.get('/home/employeepage', (req, res) => {
    res.render('employee')
})



//404 page
app.use((req, res) => {
    res.status(404).render('404')
});

