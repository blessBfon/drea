/*
 * drea Validation Library
   Author::
 * Version:2.1.0
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
    CheckWithConstraints,
    CheckForDuplicates,
    removeK,
    CheckForRuleAndError,
    StrictEmail
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
if (!globalThis.None) {
  Object.defineProperty(globalThis, "None", {
    // Use Object.create(null) to ensure it has no prototype, just like null
    value: Object.freeze(Object.create(null, {
      [Symbol.toStringTag]: { value: "None" },
      "__type": { value: "None", enumerable: true }
    })),
    writable: false,
    configurable: false,
    enumerable: true
  });
}

const None = globalThis.None
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
 * @property {number[]} [between] - Maximum and optional minimum length of the URL (e.g., [40] or [40,200])
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
                this.url = url.toLowerCase().trim()
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
        if(this.major_url_regex.test(this.url)){
        //must be true
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

  //entry can be object,array,string,number, a function that returns object, array, string or number

    try{

    //prevent illegal  use of None
    if (entry===None){
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
        if(errorMsg===None){
           throw new ArgumentTypeError ({
            error_code:'ERR_INVALID_ARGTYPE',
            error_description:"errorMsg cannot be of None type."
        }) 
    }
            
    //Lets check the rules 

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
                    error_description:`Rule '${rule}' function must return a boolean value.`
                }) 
            }    
        }
        //if rule is None this means no validation will be done on that entry
         else if(rule===None){
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

        if(typeof entry !=='string'){
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

        if(typeof entry !=='string'){
            throw new ArgumentTypeError({
                        error_code:"ERR_INVALID_ARGTYPE",
                        error_description:"entry must be a string"
                    })
            }

        const RuleAndError=[
            {
                rule:StrictEmail,
                errorMsg:"Invalid Email address"
            }
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
        if(typeof entry !=='string'){
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
        if(typeof entry !=='string'){
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
        if(typeof entry !=='string'){
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
          if(error.code==="ERR_UNKNOWN_KEY" ||error.code ==="ERR_INVALID_ARGTYPE" || error.code ==="ERR_NULL_VALUE")
            throw (error)
        else{
            throw new ValidationError({
                error_code:"ERR_VALIDATION",
                error_description:error.message
            })}
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
    
/** 
*   Normalizing URL to a specific pattern protocol://domain.tld and also takes protocol
*   if user wants to normalize url to a protocol when no protocol was given
* 
* @param {string} url Required
* @param {string} protocol Optional
* @returns Returns true if entry is not null
*  
*/
    static URL(url,protocol=undefined){
        /*
            For now this normalizer cannot resolve dots segment, collapse multiple slashes,
            and normalize % or touch user:pass@...
            
        */

        //Runtime safe guard
        //Must be a string
         if(typeof url !='string') {
            throw new ArgumentTypeError({
                error_code:"ERR_INVALID_ARGTYPE",
                error_description:"URL must be a string"
            })
        }

        if(protocol !=undefined){
            if(typeof protocol != 'string'){
                throw new ArgumentTypeError({
                    error_code:"ERR_INVALID_ARGTYPE",
                    error_description:"Protocol must be a string"
                })
            }
        }

         //To Lowercase and trimmed
         url  = url.toLowerCase().trim()
         protocol = protocol?.toLowerCase().trim()

        //If any Port number is found it will be extracted first

        let splitted_value = url.split(":")//We split at : where after it a port number might follow
        //If a Port number existed then splitted_value length will be 3 else 2
        if(splitted_value.length === 3 || splitted_value.length === 2){

            //If splitted_value's length is 3 then concatenate the first two element of that array
            //and store back as value if 2 then store just the fisrt element as value [As Port value will always be the last element in that array]
            url = splitted_value.length===3?splitted_value[0]+':'+splitted_value[1]:splitted_value[0]

            //If query params , fragments and even path exit after port number a / must be there fisrt
            let indexOf_first_slash_after_port = null 
            if(splitted_value.length ===3){
                indexOf_first_slash_after_port = splitted_value[2].indexOf("/")
                url = url + splitted_value[2].slice(indexOf_first_slash_after_port)
            }
            else{
                indexOf_first_slash_after_port = splitted_value[1].indexOf("/")
                url = url + splitted_value[1].slice(indexOf_first_slash_after_port)
            }

            //Value will a suppose url without port hence it should have one : after protocol only or none
            //if no protocol was introduced and it started either with www. or just the domain.tld { or subdomain.domain.tld}
            splitted_value = url.split(":")//This becomes our new splitted value possibly 2 or 1 element(s)
            
        }

        //If splitted_value length is 2 probably because it starts with protocol://www. or protocol://
        //Thus the array will either be [protocol,//www.] or [protocol,//]
        if(splitted_value.length === 2){ 

            //If it started with protocol://www. We will replace that portion with protocol:// 
            //Protocol is the fisrt element in splitted_value
            if(url.startsWith(splitted_value[0]+"://www.",0)){
                //Replace it with prot://
                url = url.replace(`${splitted_value[0]}://www.`,`${splitted_value[0]}://`)
                //URL class above ensures its pattern is valid
                return (new URL(url)).verifyPattern()?{status:true,url:url}:{status:false,url:"Url pattern not valid"}
            }

            //If it started with protocol://  No need of replacement 
            //Protocol is the fisrt element in splitted_value
            else if(url.startsWith(splitted_value[0]+"://",0)){
                //Has to be OK
                return (new URL(url)).verifyPattern()?{status:true,url:url}:{status:false,url:"Url pattern not valid"}
            }
            
            //else None matches then the pattern has to be incorrect
            else{
                return {
                    status:false,
                    error:"Url pattern not valid"
                }
            }
        }

        //If splitted_value.length  is 1 then no protocol was provided which means it could either be
        //www.domain.tld [or www.subdomain.domain.tld] ,domain.tld[or subdomain.domain.tld]
        //therefore splitted_value will be it 
        else if(splitted_value.length===1){
            
            //If splitted_value starts with www.
            if(url.startsWith("www.",0)){
                //Replace it with protocol:// 
                // [ default to https if no protocol wa given by the user...]
                url = url.replace(`www.`, protocol ? `${protocol}://` : `https://`)
                //Has to be OK
                return (new URL(url)).verifyPattern()?{status:true,url:url}:{status:false,url:"Url pattern not valid"}
            }

            else {
                //Value has to be domain.tld or subdomain.domain.tld even if its ww.domain.com
                //then the ww is considered a subdomain
                url = protocol?`${protocol}://` + url : `https://` + url //We default to https if no protocol was given by the user
                //Has to be ok after the return 
                return (new URL(url)).verifyPattern()?{status:true,url:url}:{status:false,url:"Url pattern not valid"}

            }

        }

        //If none of this stands then 
        return {    
            status:false,
            error:"Url pattern not valid"
        }
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

        error = {}

      
        constructor(obj){
               if (obj === null || obj === undefined) {
                throw new NullValueError({
                    error_code: "ERR_NULL_VALUE",
                    error_description: "Data object cannot be null or undefined"
                })
            }
            // ...existing code...

            if (typeof obj !== 'object') {
                throw new ArgumentTypeError({
                    error_code: "ERR_INVALID_ARGTYPE",
                    error_description: "Data object must be an object"
                })
            }
            
            if (Object.values(obj).some(value => typeof value != "string" && value != null)) {
                throw new MissingKeyError({
                    error_code: "ERR_MISSING_KEY",
                    error_description: "All required fields must be provided as strings"
                })
            }
            
            this.obj.username = obj.username 
            this.obj.email = obj.email 
            this.obj.password = obj.password 
            this.obj.phonenumber = obj.phonenumber 
         }



   /**
 * Validates the data against the schema restriction model
 * @returns {object} Returns an object
 */
        validate(){
              //Always resetting error and ok obj on every validate calls
        this.error={}//resetting errors
  
            try{
              
                for (const [key,value] of Object.entries(this.obj)){ 
                
                    if(this.obj[key] != null){//if the field's value is not null
                    
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
                if(Object.keys(this.error).length > 0 ){
                    this.error.status = false
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
        if(error.code==="ERR_UNKNOWN_KEY" ||error.code ==="ERR_INVALID_ARGTYPE" || error.code ==="ERR_NULL_VALUE")
            throw (error)
        else{
            throw new ValidationError({
                error_code:"ERR_VALIDATION",
                error_description:error.message
            })}
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
                        error_code:"ERR_UNKNOWN_KEY",
                        error_description: `key '${key}' not found in schema restriction`
                            })
                        }

                   
                //if schema_restr_model[key] contains keys that {rule,errorMsg} or
                //even if its an array(RuleAndError) of it {rule,errorMsg}
                if(CheckForRuleAndError(this.schema_restr_model[key]).status){
                    const {status,error} = validateEntry({
                        entry:value,
                        //if restr model is an array then send it like that else (its an object)
                        //send it enclose with square brackets
                        RuleAndError:Array.isArray(this.schema_restr_model[key])?this.schema_restr_model[key]:[this.schema_restr_model[key]]
                    })
                    if(!status){//if input is not valid
                     
                        this.error[key] = {
                            status:status,
                            error:error,
                            value:value
                            }
                        }
                    }
                }//end of for loop

            //Returning the error object if there's any error found else return the ok object with the validated data
            
            //If errors (invalid entries) were found
            if ((Object.keys(this.error)).length>0)
                {
                        this.error.status = false
                        return this.error
                }

            else{
                return {
                    status:true,
                    error:null,
                    value:obj
                }

            }
        }

        catch(error){
            //there are only 3 possible errors or exceptions to be thrown here 
            // unknownkeyerror,argumentypeerror,nullvalueerror we might someother error we dont know of but 
            //as the are not yet classified we will placed them as validationErrors
            if(error.code!=='ERR_VALIDATION')
                throw (error)
            else
            {
                throw new ValidationError({
                    error_code:"ERR_VALIDATION",
                    error_description:error.message
                })
            }
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
                    error_description: `Duplicate key '${key}' already exists in schema`
                    })
                    
            }
        }
              
    }


    catch(error){
           if(error.code==="ERR_DUPLICATE_KEY" ||error.code ==="ERR_INVALID_ARGTYPE" || error.code ==="ERR_NULL_VALUE")
            throw (error)
        else{
            throw new ValidationError({
                error_code:"ERR_VALIDATION",
                error_description:error.message
            })}
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
         if(new_restr===null || new_restr===undefined){
            throw new NullValueError({
                error_code:"ERR_NULL_VALUE",
                error_description:"new_restr model cannot be null or undefined"
             })
        }
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

