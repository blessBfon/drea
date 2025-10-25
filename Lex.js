
/**
 * @param {Object} param0
 * @param {any} param0.entry - The value to validate.
 * @param {{ rule: RegExp|Function, errorMsg: string }[]} param0.RuleAndError - Validation rules.
 * @returns {{ status: boolean, error: string|null }}
 */

/*
 * Lex Validation Library
 * Author: Fon Bless Mtoh
 * Version: 1.0.0
 * Description: Lightweight schema-based validation and normalization system for JavaScript and web applications.
 * License: MIT
 */

//Custom validation

const validateEntry= ({
                       entry,
                       RuleAndError=[]
                    }) =>{

    try{
 
    if(entry == null || entry == undefined){ //prevent unexpected errors
        //null === undefined in JS
                return{
                    status:false,
                    error:"Entry cannot be null"
                        }
    }

        if (typeof entry === 'string'){
            entry = entry.trim() //trim spaces
        }
       
    for (const {rule,errorMsg} of RuleAndError) {
        let isInputValid = false

        //if rule is a regexp
        if (rule instanceof RegExp){
            isInputValid = rule.test(entry)
        }

        //if rule is function
        else if (typeof rule === 'function'){
            isInputValid = rule(entry)
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

//isUsernameValid
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
const  isEmailValid= (entry) =>{
        const RuleAndError=[
            {
                rule:/^(?!\.)[A-Za-z0-9._%+-]{1,64}(?<!\.)@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ 
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
class CustomClassicModel{
    //we need your own restr obj which will model the data and validate it
    //the keys will reflect the keys of your data simply and you can even extend yours
    //This model will be based on schema restrictions provided so we expect data to based on it
    //that's keys of the data should exist in the schema restriction
       
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

                if(!status){
                    //if status is false
                this.error[key] = {
                    status:status,
                    error:error,
                    value:value
                }
        }}

        if(Object.keys(this.error).length>0)
            //number of keys in error is > 1
            return this.error
        
        //else
        this.ok = {
            status:true,
            error:null,
            data:obj
        }
        return this.ok
    }
    catch(error){
        throw(error)
    }
    }

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
