
/*
 * drea Validation Library
 * Author: Fon Bless Mtoh
 * Version: 1.0.0
 * Description: Lightweight schema-based validation and normalization system for JavaScript and web applications.
 * License: MIT
 */

/**
 * @param {Object} param0
 * @param {any} param0.entry - The value to validate.
 * @param {{ rule: RegExp|Function, errorMsg: string }[]} param0.RuleAndError - Validation rules.
 * @returns {{ status: boolean, error: string|null }}
 */



//VERSION 2
import {
    CheckWithConstraints
   } from './Utilities.js'


class ValidationError extends Error {
    constructor({error_code,error_description}) {
        super(error_description);
        this.name = "ValidationError";
        this.error = error_code;
        Error.captureStackTrace(this,this.constructor);
    }
    
}

class DuplicateKeyError extends Error {
  constructor({ error_code, error_description }) {
    super(error_description);

    this.name = 'DuplicateKeyError';
    this.code = error_code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this,this.constructor);
    }
  }
}


class ArgumentTypeError extends Error {
  constructor({ error_code, error_description }) {
    super(error_description);

    this.name = 'ArgumentTypeError';
    this.code = error_code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class MissingKeyError extends Error {
    constructor({ error_code, error_description }) {
        super(error_description);
        this.name = 'MissingKeyError';
        this.code = error_code;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


class UnknownKeyError extends Error{
    constructor({error_code, error_description}){
        super(error_description)
        this.name = "UnknownKeyError"
        this.code = error_code
        if(Error.captureStackTrace){
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class NullValueError extends Error {
    constructor({ error_code, error_description }) {
        super(error_description);
        this.name = 'NullValueError';
        this.code = error_code
        if(Error.captureStackTrace){
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

//-------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

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
 * URL Pattern Validator
 *
 * Validates a URI / URL against a base regex pattern and optional
 * custom constraints such as protocol, domain, port, path, fragment, and query.
 *
 * Designed for extensible schema-based validation.
 *
 * @example
 * const isValid = new URL(
 *   "http://support.find.com:443///?draz=1#soccer"
 * ).verifyPattern({
 *   allowed_protocols: ["http", "https", "ftp"],
 *   contain_fragment: true,
 *   contain_query: true,
 *   allowed_ports: ["443", "80"],
 *   between: [40],
 *   allowed_domains: ["support.find.com","find.com","google.com","facebook.com"],
 *   contain_path: false
 * });
 *
 * console.log(isValid); // true | false
 *
 * @typedef {Object} URLConstraints
 * @property {string[]} [allowed_protocols] - Allowed URL schemes (e.g., http, https, ftp)
 * @property {boolean} [contain_fragment] - Whether a fragment (#hash) is allowed
 * @property {boolean} [contain_query] - Whether a query string (?key=value) is allowed
 * @property {string[]} [allowed_ports] - Allowed port numbers (URL must include if specified)
 * @property {number[]} [between] - Minimum and optional maximum length of the URL (e.g., [40] or [40,200])
 * @property {string[]} [allowed_domains] - Allowed domain names (case-insensitive)
 * @property {boolean} [contain_path] - Whether the URL may include a path segment
 *
 * @class URL
 */
class URL {
    //class variable
    //match any uri or url regex
     major_url_regex = /\b(?:[a-zA-Z][a-zA-Z0-9+.-]*):\/{2}?(?:[^\s\$.?#].[^\s]*)\b/
    /*
        (?:[a-zA-Z][a-zA-Z0-9+.-]*)--->scheme
        :\/{2}?---> :(required) followed by //(optional ?)
        (?:[^\s\$.?#].[^\s]*) --->domain (or ip) with port(optional) with path,query and fragment
    */

    
  /**
   * Create a new URL validator instance
   * @param {string} url - The URL string to validate
   * @throws {ArgumentTypeError} Throws if input is not a string
   */
    constructor(url){
        //ensures uri is string only
        if(typeof url !== 'string'){
        throw new ArgumentTypeError ({
            error_code:'ERR_INVALID_ARGTYPE',
            error_description:"URL must be a string"
        })
    }

        if(url ===null ||url===undefined){
            throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"URL cannot be null or undefined "
            })
        }
                this.url = url.toLowerCase()
    }

      /**
   * Verify the URL against the base pattern and optional constraints
   * @param {URLConstraints} [extra_constraints={}] - Optional constraints for stricter validation
   * @returns {boolean} True if URL matches the base pattern and all constraints, false otherwise
   */
    verifyPattern(extra_constraints={}){
        //extra constraints not given
        if ((Object.keys(extra_constraints).length<1)){
            return this.major_url_regex.test(this.url)
            //this will match probably any url or uri even fakes ones
        }
            if(this.major_url_regex.test(this.url)){//must be true
            //lets send the extra constraints somewhere else

            try {
                return  CheckWithConstraints(this.url,extra_constraints)
            }
            catch(error){
                //simply throw the errors as they were already crafted in Utilities
                throw(error)
            }
        }

        return false

    }
    
}


//strictier password regex 2 and 1 custom strictier password regex(dev specifies whats allowed and not allowed


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
 
    if(entry === null || entry === undefined){ //prevent unexpected errors
        //null === undefined in JS
             throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"entry cannot be null or undefined"
             })
    }

    //prevent illegal  use of None
    if (entry.__type === "None"){
        throw new ArgumentTypeError ({
            error_code:'ERR_INVALID_ARGTYPE',
            error_description:"entry cannot be of None type."
        })
    }
  

        if (typeof entry === 'string'){
            entry = entry.trim() //trim spaces
        }
       
    for (const {rule,errorMsg} of RuleAndError) {
        let isInputValid = false

        //prevent illegal use of nonetype
        if(errorMsg.__type ==="None"){
            
           throw new ArgumentTypeError ({
            error_code:'ERR_INVALID_ARGTYPE',
            error_description:"errorMsg cannot be of None type."
        })
            
    }

        //if rule is a regexp
        if (rule instanceof RegExp){
            isInputValid = rule.test(entry)
    }

        //if rule is a boolean function
        else if (typeof rule === 'function'){
            //ensuring is  booolean function
            if(typeof rule(entry) === 'boolean'){//rule(entry) instanceof Boolean
            isInputValid = rule(entry)
    }
        else{
            //this means its not a boolean function
           throw new ArgumentTypeError ({
            error_code:'ERR_INVALID_ARGTYPE',
            error_description:"Rule function must return a boolean value."
        })
    
    }    }
        //{Update::>04/11/25}
        //if rule is None this means no validation will be done on that entry
        else if(rule.__type==='None'){
            isInputValid = true
            
    }

        //if rule neither a function or a regexp
        else{
            isInputValid = false
    }



        //checks if input is not validated and stops any other validation
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





/**
 * Checks if the entry matches the built-in username regex
 * @param {string} entry username to be validated
 * @returns {boolean} Returns true if username matches the built-in regex
 */
const isUsernameValid = (entry)=>{
       if(entry===null || entry===undefined){
        throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"entry cannot be null or undefined"
             })
    }
        if(typeof entry ==='string'){
        throw new ArgumentTypeError({
                    error_code:"ERR_INVALID_ARGTYPE",
                    error_description:"entry must be a string"
                })
    }
     const RuleAndError = [
                 {
                    rule:/^[A-Za-z\s-]+$/,
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
       if(entry===null || entry===undefined){
        throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"entry cannot be null or undefined"
             })
    }
        if(typeof entry ==='string'){
        throw new ArgumentTypeError({
                    error_code:"ERR_INVALID_ARGTYPE",
                    error_description:"entry must be a string"
                })
    }
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
       if(entry===null || entry===undefined){
        throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"entry cannot be null or undefined"
             })
    }
        if(typeof entry ==='string'){
        throw new ArgumentTypeError({
                    error_code:"ERR_INVALID_ARGTYPE",
                    error_description:"entry must be a string"
                })
    }
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
       if(entry===null || entry===undefined){
        throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"entry cannot be null or undefined"
             })
    }
        if(typeof entry ==='string'){
        throw new ArgumentTypeError({
                    error_code:"ERR_INVALID_ARGTYPE",
                    error_description:"entry must be a string"
                })
    }
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
                rule:/[a-z]/,
                errorMsg:"Password must contain atleast a lowercase letter"
            },
            {
                rule:/[0-9]/,
                errorMsg:"Password must contain atleast a number"
            },
            {
                rule:/[?@!#$%&*\s]/,
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
      if(entry===null || entry===undefined){
        throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"entry cannot be null or undefined"
             })
    }
        if(typeof entry ==='string'){
        throw new ArgumentTypeError({
                    error_code:"ERR_INVALID_ARGTYPE",
                    error_description:"entry must be a string"
                })
    }

    
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
    if(schema===null || schema===undefined){
        throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"schema cannot be null or undefined"
             })
    }

    if(!Array.isArray(schema)){
        throw new ArgumentTypeError({
                    error_code:"ERR_INVALID_ARGTYPE",
                    error_description:"schema must be an array"
                })
    }
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
        throw new ValidationError({
            error_code:"ERR_VALIDATION",
            error_description:error.message
        })
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
            if(obj===null || obj===undefined){
                throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"Data object cannot be null or undefined"
             })
            }

            if(typeof obj != 'object' && !(obj instanceof Object)){
                throw new ArgumentTypeError({
                    error_code:"ERR_INVALID_ARGTYPE",
                    error_description:"Data object must be an object"
                })
            }
         
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
              //Always resetting error and ok obj on every validate calls
        this.error={}//resetting errors
        this.ok = {}//resetting ok obj
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
          
          else{
        
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
        throw new ValidationError({
            error_code:'ERR_VALIDATION',
            error_description:error.message
        })
    }
} }



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
        if(schema_restr_model===null || schema_restr_model===undefined){
            throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"schema restriction model cannot be null or undefined"
             })
        }
        
        //an array is instanceof an Object and also Array but an object false
        //specific to an array
        if(schema_restr_model instanceof  Array)
        {
            throw new ArgumentTypeError ({
            error_code:'ERR_INVALID_ARGTYPE',
            error_description:"constructor must take an object"
        })
        }
        //checking now against all other types
        if(typeof schema_restr_model !=="object"){
            throw new ArgumentTypeError ({
            error_code:'ERR_INVALID_ARGTYPE',
            error_description:"constructor must take an object"
        })
        }

        //else now schema_restr_model is an object
        this.schema_restr_model = schema_restr_model
    }


/**
 * Validates the data against the schema restriction model
 * @param {object} obj data to be structured by the schema restriction model
 * @returns {object} Returns an object
 */
    validate(obj){
        if(obj===null || obj===undefined){
            throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"Data object cannot be null or undefined"
             })
        }
        //Always resetting error and ok obj on every validate calls
        this.error={}//resetting errors
        this.ok = {}//resetting ok obj

        try{
   

            if(Object.keys(this.schema_restr_model).length === 0){
              throw new ValidationError({
                error_code:"ERR_VALIDATION",
                error_description:"cannot find your schema restriction model"
              })
             
        }
            if(Object.keys(obj).length ===0){
              throw new ValidationError({
                error_code:"ERR_VALIDATION",
                error_description:"Data object to be validated cannot be empty"
              })
                
                
        }

            for(const [key,value] of Object.entries(obj)){
         

                if (!this.schema_restr_model[key]) {
                throw new UnknownKeyError ({
                    error_code:"ER_UNKNOWWN_KEY",
                    error_description: `Unknown key '${key}' not found in schema restriction`
                        })
}

             const {status,error} = validateEntry(
                {
                    entry:value,
                    RuleAndError:[this.schema_restr_model[key]]

                })
              
               
                    if(!status){//if input is not valid
                this.error[key] = {
                    status:status,
                    error:error,
                    value:value
                }

        }
                
            
            }//end of for loop

            //returning

            if ((Object.keys(this.error)).length>0){//if there's any error found
                            return this.error
            }

            else{//if no error was found
                this.ok={
                    status:true,
                    error:null,
                    value:obj
                }
                return this.ok
            }
        
    }
    catch(error){
       throw new ValidationError({
        error_code:"ERR_VALIDATION",
        error_description:error.message
       })
    }
    }

/**
 * Extends the restriction schema model
 * @param {object} ext_restr Extended restriction schema model
 *\
 */
    extend(ext_restr){
        if(ext_restr===null|| ext_restr===undefined){
            throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"restriction model cannot be null or undefined"
             })
        }
        try{
        for (const [key,value] of Object.entries(ext_restr)){

            //prevent duplicate keys
            const all_restr_keys = Object.keys(this.schema_restr_model)//returns an array of restr keys
            if(!(all_restr_keys.includes(key)))//find if any key in ext_restr does not exists inn restr
                {
                    this.schema_restr_model[key]= value //now we can add value obj {rule,errorMsg} to that key name to this.restr

                }
            else{
                 throw new DuplicateKeyError({
                    error_code:"ERR_DUPLICATE_KEY",
                    error_descritpion: `Duplicate key '${key}' already exists in schema`
                    })
                    
            }
        }
              
    }


    catch(error){
        throw new ValidationError({
            error_code:"ERR_VALIDATION",
            error_description:error.message
        })
    }
}

//UPDATE 1.1.7
    remove(Key){
        if(Key===null || Key===undefined){
            throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"key cannot be null or undefined"
             })
        }
        /*
        let keyPresent = Object.keys(this.schema_restr_model).forEach((key)=>{
            return key === Key ? true : false
        })
            if(keyPresent === false)
            //key not found
        {
            throw new Error(`'${Key}' not found`)
        }
        //if found
        delete this.schema_restr_model[Key]
        *///OR

        const keys = Object.keys(this.schema_restr_model)//array

        const keyPresent = keys.find((k)=>Key===k)

        if (keyPresent===undefined)//key not found
        {
            throw new MissingKeyError({
            error_code:"ERR_MISSING_KEY",
            error_description: `key name '${Key}' not found`
            })
        }
        //if found
        delete this.schema_restr_model[Key]
        
    } 
    

    //swap schema restrictions
    swap(new_restr){
        this.schema_restr_model = new_restr
    }

}






export {
    validateEntry,
    isUsernameValid,
    isEmailValid,
    isPhoneNumberValid,
    isPasswordValid,
    isRequired,
    Normalizer,
    validateMany,
    ClassicModel,
    CustomClassicModel,URL,
    ArgumentTypeError,
    MissingKeyError,UnknownKeyError,
    NullValueError,
    DuplicateKeyError,
    ValidationError,
    None
};



               
