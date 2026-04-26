
//version::: 1.1.8
//Utility functions
/*  */


//import error instances
import {
    ArgumentTypeError,
    MissingKeyError,
    UnknownKeyError,
    ValidationError,
    NullValueError
} from './drea.js'

//strict email validation
/**
 * 
 * @param {*} v - The email addr to test
 * @returns {boolean} Returns true if email matches the regex
 */
const StrictEmail = (v) =>

    {
        if(typeof v != 'string'){
            throw new ArgumentTypeError({
                error_code:"ERR_INVALID_ARGTYPE",
                error_description:'Email must be a string'
            })
        }
        
        const reg_ = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,63})+$/
        return reg_.test(v.trim())
    } 




//Handling extra constrainst 
//1 when protocol(s) is given
const ALLOWED_KEYS = ["allowed_protocols",
                        "allowed_ports",
                        "allowed_domains",
                        "contain_fragment",
                        "contain_path",
                        "contain_query",
                        "between"]
const CheckWithConstraints = (url,xtra_constr)=>{
    
    let count = 0;//keeps a record of all successful condition passed by incrementing
    
 
    //return false as one restriction in the xtra_constr fails (if the url doesn't meet one of it )
    //switch everything to use switches if possible//
    for(const [key,value]  of Object.entries(xtra_constr)){



   //lets check if the key exist fisrt 
         //key does'nt exist
        if(!(ALLOWED_KEYS.includes(key.toLowerCase())))
                throw new UnknownKeyError ({
                    error_code:"ERR_UNKNOWN_KEY",
                    error_description: `${key}`+ ` is not defined as a restriction`
                })


        //PROTOCOLS----------------------------------------------------------
            if(key.toLowerCase()==='allowed_protocols'){
                //ensuring valus here is an array of strings
                if (Array.isArray(value)&&value.every(i=>typeof i === "string")){ 
                    //takes an array and calls check protocol
                   if (!checkProtocols(url,value))
                        return false //protocol was'nt found
                   
                }
              
            else{  
            throw new ArgumentTypeError({
                error_code:"ERR_INVALID_ARGTYPE",
                error_description:`'${key}' must be an array of strings`
            })
        }
        
}

    //allowed_fragments-----------------------------------------------------------
            if (key.toLowerCase()==='contain_fragment'){
                if (typeof value === "boolean"){
                    if(!checkFragments(url,value)){
                        return false
                        }
                }

            else{
                throw new ArgumentTypeError({
                error_code:"ERR_INVALID_ARGTYPE",
                error_description:`'${key}' must be a boolean`
            })
        }
                
            }
    


    //allowed_query----------------------------------------------------------------
            if(key.toLowerCase()==="contain_query"){
                 if (typeof value === "boolean"){
                    if(!checkQuerys(url,value))
                        return false
                    }

                else{
                throw new ArgumentTypeError({
                    error_code:"ERR_INVALID_ARGTYPE",
                    error_description:`'${key}' must be a boolean`
                })
            }
        }



    //port------------------------------------------------------------------------
            if(key.toLowerCase()==="allowed_ports"){
                //must be an array of numbers
                 if (Array.isArray(value)&&value.every(i=>typeof i === "string")){ 
                    
                    if(!checkPort(url,value))
                        return false
                }

                else{
                throw new ArgumentTypeError({
                    error_code:"ERR_INVALID_ARGTYPE",
                    error_description:`'${key}' must be an array of strings`
                })
            }
        }



            //range---------------------------------------------------------------------
            if(key.toLowerCase()==="between"){
                //must be an array of numbers
                 if (Array.isArray(value)&&value.every(i=>typeof i === "number")&&value.length>0&&value.length<3){ 
                    if(!checkLength(url,value))
                        return false
                    }

                else{
                throw new ArgumentTypeError({
                    error_code:"ERR_INVALID_ARGTYPE",
                    error_description:`'${key}' must be an array of numbers`
                })
            }
        }


            //allowed domain------------------------------------------------------------
            if(key.toLowerCase()==='allowed_domains'){
                //ensuring valus here is an array of strings
                if (Array.isArray(value)&&value.every(i=>typeof i === "string")){ 
                    //takes an array and calls check protocol
                   if (!checkDomain(url,value)){
                    return false 
                   }
                }
              
                else{  
                    throw new ArgumentTypeError({
                            error_code:"ERR_INVALID_ARGTYPE",
                            error_description:`'${key}' must be an array of strings`
                        })
                }
            }
            
    //contain_path---------------------------------------------------------------
            if(key.toLowerCase()==='contain_path'){
                if (typeof value === "boolean"){ 
                  if (!checkPath(url,value)){
                    return false 
                   }
                }
              
                else{  
                    throw new ArgumentTypeError({
                            error_code:"ERR_INVALID_ARGTYPE",
                            error_description:`'${key}' must be a boolean`
                        })
                    }
                }
            }
    return true
}






//Helpers

export const checkPath = (url,ifPaths)=>{
    const path = url.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^/?#]+(\/[^?#]*)?/)
      
    if(!ifPaths){
        const re = /[\/]{1,}[a-zA-Z-0-9]+[\/]{1,}/ /*should treat /////+ as / and should be followed by a string of characters to avoid treating http:// as having a path */
        const re_ = /[\/]{1,}/ /*should treat /////+ as / */
       return  path[1]===undefined || path[1]==='/' || re_.test(path[1])  || re.test(path[1])
        }
    return path[1]!==undefined && path[1]!=='/' 
}



const checkDomain=(url,domains=[])=>{
        if(domains.length===0)
        {
            return true
        }
        //converts all string to lowercase 
        domains =  domains.map(i=>i.toLowerCase())
      
        //domain or ip addr
        const domain = url.match(/\b([a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}|\d{1,3}(?:\.\d{1,3}){3})\b/) 
        return domains.includes(domain[1])?true:false
    
    }


const checkLength=(url,range=[])=>{
    if(range[1]===undefined){
        return url.length<range?true:false
    }
 
    return url.length>range[0]&&url.length<range[1]?true:false

}


const checkPort = (url,ports=[])=>{
        const url_port = url.match(/:(\d+)(?=\/|$)/)
        if(url_port===null){
            return false//port must exists as an array of allowed ports were given 
        }
        if (ports.length===0)
        {
            return true//as no allowed ports were given 
        }
        //if the port is exist and its found in the array of allowed ports
        return ports.includes(url_port[1])?true:false

}



const checkQuerys = (url,ifQuery)=>{
    const query = url.match(/\?([^#\s]+)/)

    if(query===null){
        return true
    }
    if(!ifQuery){
        //it means no query is allowed
        return query[1]?false:true
    }

   return true//ifQuery is true (query is allowed even if it wan't present)
}





const checkFragments = (url,ifFragments)=>{
    const fragment = url.match(/#([^\s?#]+)/)
    //so we check if the fragemnt is allowed or not
    if (!ifFragments){
            //if fragements  exist it should return false as no fragment was supposed to exist
            return fragment===null
            
        }
    return fragment!=null
   }



const checkProtocols = (url,protocols=[])=>{
        //lets break the url to get the scheme only 
        //we can split at : and get the first element or just check if the url matches  any protocol
        //we can just get index of the first : and slice it then.....
        const scheme = (url.split(':'))[0]//get the first element
        protocols = protocols.map(p=>p.toLowerCase())
        return protocols.includes(scheme)?true:false
}

//---------------------------------------------------------------------------
const CheckForDuplicates = (arr)=>{
    if (Array.isArray(arr) && arr.every((el)=>typeof el==='string')){
        for(let i=0;i<arr.length;i++){
            let key = arr.splice(i,1)//start from index an remove just one key
            if(arr.includes(key))//checkingf if that key is still present inside then must have been 2 of them
                return {
                    state:true,
                    duplicate:key
                }
            //else
                //put the key back but now at the ned of the array
            arr.push(key)
        }
        return {
            state:false,
            duplicate:null
        } // as no dupies was found
    }

    //as itsnot an array
    throw new ArgumentTypeError({
        error_code:"ERR_INVALID_ARGTYPE",
        error_description:"CheckForDuplicates accepts only an array of strings"
    })
}


//A function to remove a key
const removeK = (obj,key)=>{
    delete obj[key]
}

//A function to check if an object has only 2 keys {rule and errorMsg}  OR 
// an array of objects where each object has only 2 keys {rule and errorMsg}
//Any errors thrown by CheckKeys will be caught by CheckForRuleAndError and rethrown to drea 
// which will be caught again and rethrown to developer
const CheckForRuleAndError = (restr_model)=>{

    try{
        // arrays in js are objects so if restr is an object it could be an array or an object 
        if(restr_model instanceof Object){
            
            //lets specified now if its object 
            if(!Array.isArray(restr_model)){

                const {status,error} = CheckKeys(restr_model)
                    return {
                            status:status,
                            error:error
                        }
            }

            //if its an array instead
            else if(Array.isArray(restr_model)){

                if(restr_model.length <= 0){
                    throw new NullValueError({
                        error_code:"ERR_NULL_VALUE",
                        error_description:"RuleAndError[] cannot be empty"
                    })
                }

                for (const obj of restr_model){
                    //if its an obj not array
                    if(typeof obj === 'object' && obj instanceof Object && !Array.isArray(obj)){
                        const {status,error} = CheckKeys(obj)
                    }

                    else{
                        throw new ArgumentTypeError({
                            error_code:"ERR_INVALID_ARGTYPE",
                            error_description:"RuleAndError[] can either be an array of {rule,errorMsg} or a single {rule,errorMsg}"
                        })
                    }
                }

                return {
                    status:true,
                    error:"null"
                }
            }

            //for safety purposes this else is to return incase of an unexpected type
            else{
                throw new ArgumentTypeError({
                    error_code:"ERR_INVALID_ARGTYPE",
                    error_description:"RuleAndError[] can either be an array of {rule,errorMsg} or a single {rule,errorMsg}"
                })
            }
        }
    
        else{
            throw new ArgumentTypeError({
                error_code:"ERR_INVALID_ARGTYPE",
                error_description:"RuleAndError[] can either be an array of {rule,errorMsg} or a single {rule,errorMsg}"
            })
        }
    }
    
    catch(err){
        throw err
    }
}

//A function to check if the objects present in an array contains onyl 2 keys rule and errorMsg
export const CheckKeys = (obj)=>{

     let arr = Object.keys(obj)

            if(!arr.includes('rule')){
                throw new MissingKeyError({
                        error_code:"ERR_MISSING_KEY",
                        error_description:"rule key missing"
                    })
            }

            if(!arr.includes('errorMsg')){
                throw new MissingKeyError({
                    error_code:"ERR_MISSING_KEY",
                    error_description:"errorMsg key missing"
                })
            }

            //lets see the additional keys the user might have placed in that normally doesn't belong
             arr = arr.filter(v=>v!="rule" &&  v!="errorMsg")

            if(arr.length===1){
                throw new UnknownKeyError({
                    error_code:"ERR_UNKNOWN_KEY",
                    error_description: `'${arr}' is an unknown RuleAndError[]  key`
                })
            }

            if(arr.length>1){
                throw new UnknownKeyError({
                    error_code:"ERR_UNKNOWN_KEY",
                    error_description:`[${arr}] are unknown RuleAndError[] keys `
                })
            }

            return {
                status:true,
                error:null
            }
}

export{
    CheckWithConstraints,   
    StrictEmail,
    CheckForDuplicates,
    removeK,
    CheckForRuleAndError
}