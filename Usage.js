
import {normalizer,
    validateMany,
    validateEntry,
    ClassicModel,
CustomClassicModel} from './Lex.js'

//Passing a regex as the rule
console.log(validateEntry({
    entry:3434,
    RuleAndError:[
        {
            rule:(v)=>typeof v==="string",
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
                return typeof v === 'string'
            },
            errorMsg:"Must be a string"
        }
    ]
}))

//Using validateMany to pass a regex and or a function as the rule
const username2 = "Fonbless"//expected to not be valid
const email = 'blessfonmtoh@gmail.com'
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
    email:"blessfonmtohgmail.com",
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
    description:{
        rule:(v)=>{return v.length<=10},
        errorMsg:"description cannot exceed 10 characters"
    }
}
console.log("=================================================================")

const ccl = new CustomClassicModel(schema_restr_model)
const data = {
    name:null,
    age:"20",
    description:"Testing to see if this custom mades  class works"
}


console.log(ccl.validate(data))