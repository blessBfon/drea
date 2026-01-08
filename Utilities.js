
//version::: 1.1.8
//Utility functions
/*  */


//import error instances
import { validatePhoneNumberLength } from 'libphonenumber-js'
import {
    ArgumentTypeError,
    MissingKeyError,
    UnknownKeyError,
    ValidationError
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
        return reg_.test(v.trim)
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
                   {
                    return false //protocol was'nt found
                   }
                       count = count + 1
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
                    count += 1
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
                        {
                        return false
                        }
                    count += 1
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
                        {
                        return false
                        }
                    count += 1
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
                        {
                        return false
                        }
                    count += 1
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
                   if (!checkDomain(url,value))
                   {
                    return false //protocol was'nt found
                   }
                       count = count + 1
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
                //ensuring valus here is an array of strings
                if (typeof value === "boolean"){ 
                    //takes an array and calls check protocol
                   if (!checkPath(url,value))
                   {
                    return false //protocol was'nt found
                   }
                       count = count + 1
                }
              
            else{  
          throw new ArgumentTypeError({
                error_code:"ERR_INVALID_ARGTYPE",
                error_description:`'${key}' must be a boolean`
            })
        }
        
}


   

    }

    if(count>1){
        return true
    }

}


/*
Whats left
  
    allowed_ipclass
  

*/







const checkPath = (url,ifPaths)=>{
    const path = url.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^/?#]+(\/[^?#]*)?/)
       if(path===null || path===undefined){//if the url does not have a path 
        return true 
    }

    if(!ifPaths){//surely the url has a path but lets check...
        //if path exist we should return false saying we didn't want any path
        //if the there's no path then path[1] will be '/' 

        /*
            because we can have path with // or /// or //about//find/......
            so we need to makes sure any path of //xxx/ or ///xxx// or /xxx// 
            // starting with 1 or more slashes followed by some string thenending with
            // onse or more slashes etc will be 
            seen as /xxx/ thus tested as such  and path like /// /// / ///// seen as / and 
            treated as such 
            */
           //regex to test for >=1 slashes TEXT >= slashes
        const re = /[\/]{1,}[a-zA-Z-0-9]+[\/]{1,}/
       return (re.test(path[1]))?false:true
        }
    return true
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
        return url.length>range?true:false
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
 
    if(fragment===null){
        return true
    }
    //meaning its not null
    //so we check if the fragemnt is allowed or not
    if (!ifFragments){
            //if fragements  exist it should return false as no fragment was supposed to exist
            return query_fragment[1]?false:true
            
        }
    return true
   
 
}

const checkProtocols = (url,protocols=[])=>{
        //lets break the url to get the scheme only 
        //we can split at : and get the first element or just check if the url matches  any protocol
        //we can just get index of the first : and slice it then.....
        const scheme = (url.split(':'))[0]//get the first element
        protocols = protocols.map(p=>p.toLowerCase())
        return protocols.includes(scheme)?true:false
}

export{
    CheckWithConstraints,   
    StrictEmail
}