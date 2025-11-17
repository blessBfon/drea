
/**
 * @param {Object} param0
 * @param {any} param0.entry - The value to validate.
 * @param {{ rule: RegExp|Function, errorMsg: string }[]} param0.RuleAndError - Validation rules.
 * @returns {{ status: boolean, error: string|null }}
 */



/*
 * drea Validation Library
 * Author: Fon Bless Mtoh
 * Version: 1.0.0
 * Description: Lightweight schema-based validation and normalization system for JavaScript and web applications.
 * License: MIT
 */




//VERSION 1.1.8

/**
 * Special value representing "no-validation"
 * 
 * Use only as a rule in validation. This ensures validation  for that entry is skipped (hence true).
 * None is an immutable object and it carries a clear internal marker 
 */
const None = Object.defineProperty(globalThis,"None",{
    value:Object.freeze({__type:"None"}),
    writable:false,
    configurable:false,
    enumerable:true
})


/**
 * 
 * @param {*} v - The email addr to test
 * @returns {boolean} Returns true if email matches the regex
 */
const StrictEmail = (v) =>
    {
        const reg_ = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,63})+$/
        return reg_.test(v.trim)
    } 
   


/** 
 * Validates a single entry against the provided rule
 * @param {Object} { entry, RuleAndError = [ ] } 
 * @returns Returns an object { status, error }
 */
//Custom validation
const validateEntry= ({
                       entry,
                       RuleAndError=[]
                    }) =>{

  

    try{
 
    if(entry == null || entry == undefined){ //prevent unexpected errors
        //null === undefined in JS
                return  {
                        status:false,
                        error:"Entry cannot be null"
                        }
    }
    //prevent illegal  use of None
    if (entry.__type === "None"){
        throw ({
            code:447,
            error:"entry cannot be of None type."
        })
    }
  

        if (typeof entry === 'string'){
            entry = entry.trim() //trim spaces
        }
       
    for (const {rule,errorMsg} of RuleAndError) {
        let isInputValid = false

        //prevent illegal use of nonetype
        if(errorMsg.__type ==="None"){
            
            throw ({
            code:446,
            error:"errorMsg cannot be of None type."
        })
            
        }

        //if rule is a regexp
        if (rule instanceof RegExp){
            isInputValid = rule.test(entry)
        }

        //if rule is function
        else if (typeof rule === 'function'){
            isInputValid = rule(entry)
        }
        //{Update::>04/11/25}
        //if rule is None this means no validation will be done on that entry
        else if(rule.__type==='None'){
            isInputValid = true
            
        }

        //if rule neither a function or a regexp
        else{
            isInputValid = false
        }



        //checks if input is not validated
        if(isInputValid===false){
            return {
                status:false,
                error:errorMsg
            }
        }

    }

    //if input is valid
    return{
        status:true,
        error:null
    }
} 
        catch(error){
            throw error
}
}


//Builtin functions

/**
 * Checks if the entry matches the built-in username regex
 * @param {string} entry username to be validated
 * @returns {boolean} Returns true if username matches the built-in regex
 */
const isUsernameValid = (entry)=>{
     const RuleAndError = [
                 {
                    rule:/^[A-Za-z]+$/,
                    errorMsg:"Username must contain only letters"
                },
                {
                    rule:/^.{5,}$/,
                    errorMsg:"Username is too small"
                },
                {
                    rule:/^.{5,35}$/,
                    errorMsg:"Username is too long"
                }
            ]
               return validateEntry({
                entry,
                RuleAndError
                })
}


//isEmailValid
/**
 * Checks if the entry matches the built-in email regex
 * @param {string} entry email to be validated
 * @returns {boolean} Returns true if email matches the built-in email regex
 */
const  isEmailValid= (entry) =>{
        const RuleAndError=[
            {
                //v1.0.7 /^(?!\.)[A-Za-z0-9._%+-]{1,64}(?<!\.)@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ 
                rule:StrictEmail
        ,
                errorMsg:"Invalid Email address"
            }
            //will surely add a  rule for validating tlds
        ]
         
        return validateEntry({
                entry,
                RuleAndError
                })
    }


//isPhonenumberValid
/**
 * Checks if entry matches the built-in phonenumber regex
 * @param {string} entry phonenumber to be validated
 * @returns Returns true if phonenumber matches the built-in phonenumber regex
 */
const isPhoneNumberValid = (entry) =>{
           const  RuleAndError=[
                
                   {
                    rule: /^[0-9]+$/,
                    errorMsg:"Phone number must contain only digits"
                },
                {
                    rule:/^.{3,}$/,
                    errorMsg:"Phone number is too small"
                },
                {
                    rule:/^.{3,12}$/,
                    errorMsg:"Phone number is too long"
                }  
                
            ]
            return validateEntry({
                entry,
                RuleAndError
                })
        }


/**
 * Checks if the entry matches the built-in password regex
 * @param {string} entry password to be validated
 * @returns Returns true if password matches the built-in password regex
 */
const isPasswordValid = (entry) =>{
       const  RuleAndError=[
            {
                rule:/^.{8,}$/,
                errorMsg:"Password must be atleast 8 characters long"
            },
            {
                rule:/[A-Z]/,
                errorMsg:"Password must contain atleast an uppercase letter"
            },
            {
                rule:/[0-9]/,
                errorMsg:"Password must contain atleast a number"
            },
            {
                rule:/[?@!#$%&*]/,
                errorMsg:"Password must contain atleast a symbol"
            }

        ]
           return  validateEntry({
                entry,
                RuleAndError
                })

    }


/**
 * Ensures the entry is not null
 * @param {string} entry Required entry
 * @returns Returns true if entry is not null
 */
const  isRequired = (entry)=>{
       const  RuleAndError = [
            {
                rule:val => val != null && String(val).trim() !== "",
                errorMsg:"This field is required"
            }
        ]

       return validateEntry({
            entry,
            RuleAndError})
    }



/**
 * Validates multiple entry at once
 * @param {array} schema takes an array of objects where each object is of the form 
 * { entry, 
 * RuleAndError = [ ] 
 * }
 * @returns Returns an empty array [ ] if no entry was invalid
 */
 const validateMany = (schema=[]) =>{
    const InvalidArray = []
try{
    for (const {entry,RuleAndError=[]} of schema){
       const {status,error} = validateEntry({entry,RuleAndError})
        if (!status){
            InvalidArray.push ({
                value : entry,
                status :status,
                error : error
            })
        }
    }

        return InvalidArray
}
    catch(error){
        throw(error)
    }
} 



/**
 * @typedef {Object} Normalizer normalizes data
 * 
 * @property {string|number} value value to be normalize
 */
class Normalizer {
    constructor(){
//empty
    }
   
    static trim (value){
       return   typeof value === 'string' ?  value.trim() : value
         }
    static lowercase (value){
        return typeof value ==='string' ? value.toLowerCase() : value
        }
   static uppercase(value){
        return typeof value === 'string' ? value.toUpperCase() : value
        }
    static toNumber(value){
       return  Number(value)
        }
    static toString(value){
       return String(value)
        }
    static removeSpaces(value){
        return typeof value === 'string' ? value.replace(/\s+/g,'') : value
        }

}



/**
 * 
 * @typedef {Object} ClassicModel Schema-Based Validation. ClassicModel takes an object that might
 * have any combination of username, email, password, phonenumber as keys
 * 
 ```js
 Example
const cl = new ClassicModel({
  email: "blessfonmtoh@gmail.com",
  password: "Bless01G$",
  username: "Fon Bless",
  phonenumber: "23765373165"
});
console.log(cl.validate());
```
 * 
 */
//Classic data model
class ClassicModel{
    

    //restrictions
    restr = {
        //username
        username:{
        rule:/^[A-Za-z\s'-]{5,40}$/,
        errorMsg:'Username must contain between 5 to 40 letters only'
         },

         //email
        email: {
        rule:/^(?!\.)[A-Za-z0-9._%+-]{1,64}(?<!\.)@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ ,
        errorMsg:"Invalid Email address. Email must be of the form xyz@domain.tld"
        },
        //password
        password:{
        rule:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@?#$%&*])[A-Za-z\d?!@#$%&*]{8,}$/,
        errorMsg:"Password should be 8 characters and above containing atleast an uppercase (A-Z), a lowercase (a-z), a number (0-9), and a special character symbol (!@#$%&*)"
        },
        //phonenumber
        phonenumber:{
        rule:/^[0-9]{4,15}$/,
        errorMsg:"Phonenumber must be between 4 to 15 digits"
        }
    }

    //sample Object obj
        obj = {
            username:'',
            email:'',
            password:'',
            phonenumber:''
        }

        ok = {}
        error = {}

      
        constructor(obj){
            
         
            this.obj.username = obj.username ? obj.username : null
            this.obj.email = obj.email ? obj.email : null
            this.obj.password = obj.password ? obj.password : null
            this.obj.phonenumber = obj.phonenumber ? obj.phonenumber :null 

                    /*
                 for (const key of Object.keys(this.obj)) {
                            this.obj[key] = obj[key] ?? null;
                            }
                        */
         
       
        }

   /**
 * Validates the data against the schema restriction model
 * @returns {object} Returns an object
 */
        validate(){
            try{
              
          for (const [key,value] of Object.entries(this.obj)){ 
         
            if(this.obj[key] != null){//if the field is not null
                
               
               //we validate
               const  {status,error} = validateEntry
               ({
                    entry:this.obj[key],
                    RuleAndError:[this.restr[key]]
                })
                
                //if there's an error is the validated (input is not valid)
                if (!status){
                    //our obj error will store the eror msg and key name will be the key that 
                    //has the invalid input
                        this.error[key]=
                        {
                        status:status,
                        error:error,
                        value:value
                        }
                }

            
                
          }
          
          else{//if the field is null
        
              //deleting the null field
                delete this.obj[key]
          }
           
    }

        //now we can return the model data  or this.error object contains any error
        if(Object.keys(this.error).length > 0 ){//
            return this.error
        }
        //No invalid inputs
        return {
            status:true,
            error:null,
            data:this.obj
        }
    }

    
    catch(error){
        throw(error)
    }
}
}

//creating your own model
/**
 * 
 * @typedef {Object} CustomClassicModel Creating your own schema validation rule
 * ```js
            const schema = {
            name: { rule: (v) => typeof v === "string", errorMsg: "Name must be a string" },
            age: { rule: (v) => typeof v === "number", errorMsg: "Age must be a number" }
            };
            const custom = new CustomClassicModel(schema);
            console.log(custom.validate({ name: "Bless", age: 20 }));
```
*It needs your own restr obj which will model the data and validate it.

*These keys will reflect the keys of your data and can be extended.

*This model will be based on schema restrictions provided so it expects data to based on it.

* **Note**: Keys of the data should exist in the schema restriction model.
 * 
 */
class CustomClassicModel{
    //we need your own restr obj which will model the data and validate it
    //the keys will reflect the keys of your data simply and you can even extend yours
    //This model will be based on schema restrictions provided so we expect data to based on it
    //That is keys of the data should exist in the schema restriction model
       
        error = {}
        ok  = {}
    constructor(schema_restr_model){
        
        if(typeof schema_restr_model === "object")
        {
        this.schema_restr_model = schema_restr_model
        }
        else{
            throw ({
                    code:469,
                    Error:"Constructor must take an object"
                })
        }
    }


/**
 * Validates the data against the schema restriction model
 * @param {object} obj data to be structured by the schema restriction model
 * @returns {object} Returns an object
 */
    validate(obj={}){
        try{

            if(Object.keys(this.schema_restr_model).length === 0){
                return{
                    code:470,
                    error:"Schema restriction model cannot be empty"
                }
        }
            if(Object.keys(obj).length ===0){
                return{
                    code:471,
                    error:"Data object to be validated cannot be empty"
                }
        }

            for(const [key,value] of Object.entries(obj)){
         

                if (!this.schema_restr_model[key]) {
                throw { code: 472, error: `Unknown key '${key}' not found in schema restrictions` };
                        }


             const {status,error} = validateEntry(
                {
                    entry:value,
                    RuleAndError:[this.schema_restr_model[key]]

                })

            
                this.error[key] = {
                    status:status,
                    error:error,
                    value:value
                }
            }

    return error
    }
    catch(error){
        throw(error)
    }
    }

/**
 * Extends the restriction schema model
 * @param {object} ext_restr Extended restriction schema model
 * 
 */
    extend(ext_restr){
        try{
        for (const [key,value] of Object.entries(ext_restr)){

            //prevent duplicate keys
            const all_restr_keys = Object.keys(this.schema_restr_model)//returns an array of restr keys
            if(!(all_restr_keys.includes(key)))//find if any key in ext_restr does not exists inn restr
                {
                    this.schema_restr_model[key]= value //now we can add value obj {rule,errorMsg} to that key name to this.restr

                }
            else{
                throw ({ 
                        code: 442, 
                        error: `Duplicate key '${key}' already exists in schema`
                     });
            }
        }
    }


    catch(error){
        throw(error)
    }
}

    /* remove(key){
        delete this.schema_restr_model[key]
    } */

    //swap schema restrictions
    swap(new_restr){
        this.schema_restr_model = new_restr
    }

}






export  {
    validateEntry,
    isUsernameValid,
    isEmailValid,
    isPhoneNumberValid,
    isPasswordValid,
    isRequired,
    Normalizer,
    validateMany,
    ClassicModel,
    CustomClassicModel
};
