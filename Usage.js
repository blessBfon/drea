<<<<<<< HEAD
import { isPhoneNumberValid, isUsernameValid } from "./drea.js";
import { ClassicModel, isPasswordValid, isRequired, validateEntry, validateMany,URL } from "./drea.js";

/* 
import {Normalizer,
    isEmailValid,
    validateMany,
    validateEntry,
    ClassicModel,
CustomClassicModel} from './drea.js'
import {URL} from './drea.js'


=======

import {normalizer,
    validateMany,
    validateEntry,
    ClassicModel,
    CustomClassicModel} from './drea.js'
>>>>>>> 430378da2165b2b0040abee842d645349254965f

console.log(validateEntry({
    entry:'3434',
    RuleAndError:[
        {
            rule:None,//None type experimental
            errorMsg:"must contain only letters"
        }
    ]
}))

console.log("========================================================")


//Passing a function as the rule
//function must return boolean
const username = "Fon Bless"
console.log(validateEntry({
    entry:username,
    RuleAndError:[
        {
            rule:(v)=>{
                return "typeof v === 'string"
            },
            errorMsg:"Must be a string"
        }
    ]
}))

//Using validateMany to pass a regex and or a function as the rule
const username2 = "Fonbless"//expected to not be valid
const email = 'blessfonmtoh@gmail..com'
console.log(validateMany([
    {
        entry:username2,
        RuleAndError:[
            {
                rule:(v)=>typeof v === 'string' ,
                errorMsg:"must contain only letters"
            },
            {
                rule:/.{5,}/,
                errorMsg:'Username Too small'
            },
            {
                 rule:/.{5,35}/,
                errorMsg:'Username Too long' 
            }
        ]
    },
    {
        entry:email,
        RuleAndError:[
            {
                rule:/^(?!\.)[A-Za-z0-9._%+-]{1,64}(?<!\.)@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ ,
                errorMsg:"Invalid Email. Email must be of form xyz@domain.tld"
            }
        ]
    }
]))
const obj =   {username:"Fon bless",
    email:"blessfonmtoh@gmail.com"
}
const cl = new ClassicModel({
    email:"blessfonmtoh@gmail.com",
    password:"bless01gG$",
    username:'Fon bless ',
    PhoneNumber:"+237865373165"
})
console.log(cl.validate())

const schema_restr_model = {
    name:{
        rule:(v)=>{return typeof v === 'string'},
        errorMsg:'name must be a string'
    },
    age:{
        rule:(v)=>{return typeof v==='number'},
        errorMsg:"must be an integer"
    },
    descriptio:{
        rule:(v)=>{return v.length<=100},
        errorMsg:"description cannot exceed 10 characters"
    },
     Description:{
        rule:(v)=>{return v.length<=100},
        errorMsg:"description cannot exceed 10 characters"
    }
}
console.log("=================================================================")

const ccl = new CustomClassicModel(schema_restr_model)

const data = {
    name:"null",
    age:20,
    description:"Testing to see if this custom mades  class works"
}


console.log(ccl.validate(data))


*/

console.log((new URL("http://support.find.com:443///?draz=1#soccer")).verifyPattern({
    allowed_protocols:["http","https","ftp"],//protocols url must have
    contain_fragment:true,//url can contain fragment(Not obligatory)
    contain_query:true,//url can contain query(Not obligatory)
    allowed_ports:['443','80'],//if set then ports must be included in url
    between:[40],//length of url from 40,...
    allowed_domains:["Support.find.com","find.com","google.com","facebook.com"],
    contain_path:false,//it should not contain any path   
 
}))

/*
 import { CustomClassicModel } from './drea.js'

const schema = {
  name: { rule: (v)=>typeof v === "string", errorMsg: "Name must be a string" },
  age: { rule: (v)=>typeof v === "number", errorMsg: "Age must be a number" }
};

const ext_schema = {
    bio:{rule:/[\S]{1,100}/,errorMsg:"Bio cannot exceed 100 characters"}
}
const custom = new CustomClassicModel(schema);

custom.extend(ext_schema)

const invalidData = { 
                    name: "null",
                    age: 25,
                    bio:"Bio......"
                    };
console.log(custom.validate(invalidData));


console.log(isPasswordValid("201201@ @#GFw"))

*/