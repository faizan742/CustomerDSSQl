const express = require('express');
const { where } = require('sequelize');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const path=require('path');
const quene1=require('../Quene/uploaddata'); 
const downloadquene=require('../Quene/senddata'); 
const products=require("../Models/products");
const orders=require("../Models/orders");
const orderdetails=require('../Models/orderdetails');
const { log } = require('console');
const customers = require('../Models/customers');
const payments = require('../Models/payements');
const employees = require('../Models/employees');
const offices = require('../Models/offices');
const pdfmodel=require('../makepdf');

require("dotenv").config();

const Router = express.Router();
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));



Router
.route('/fillterData')
.get((req,res)=>{
  try {
    products.findAll({where:{ 
      MSRP: {
      [Op.between]: [req.body.value, req.body.value1],
    },
  }})
        .then((result) => {
          const uuid = uuidv4();
          quene1.saveData(uuid,result);
          res.json(uuid);
        })
      
  } catch (error) {
   res.send(401);
   console.log(error);
  }
});

Router
.route('/downloadCSV')
.get((req, res) => {
downloadquene.DownloadData(req.query.uuid); 
res.json({
 'FILE DOWNLOADED':'FILE HAS BEEN DOWNLOADED' 
});
});

Router
.route('/MAKEINVOICE')
.get((req,res)=>{
  orders.findAll({
    attributes:['orderNumber','status','shippedDate'],
    include:[{
      model: orderdetails,

      include:[{
        model:products,
        attributes:['productCode','productName','MSRP']
      }],
    },{
      model:customers,
      attributes:['customerName'],
      include:[
        {
          
          model:employees,
          attributes:['firstName','lastName'],
          include:[
            {
              model:offices
            }
          ]
        },{
          model:payments,
        }
      ]
    }
  ],
    where:{
     orderNumber:parseInt(req.query.orderNumber) 
    }
  }).then((result) => {
    res.json(result);
    pdfmodel(result);
    
  }).catch((err) => {
    
  });

});



module.exports=Router;