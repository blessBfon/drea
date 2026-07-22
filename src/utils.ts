//utils.js

import {
    DreaAtomWrapper,
    DreaFileWrapper,
    ExtraConstraints,
    MayDreaFileWrapper,
    None,
    PureObject,
    RuleAndError_t
} from './types.js'


import{
    ArgumentTypeError,
    NullValueError,
    UnknownKeyError,
    MissingKeyError,
    DuplicateKeyError,
    ValidationError
} from './errors.js'


//strict email validation
/**
 * 
 * @param {*} v - The email addr to test
 * @returns {boolean} Returns true if email matches the regex
 */
//type of v here is any but will used explicitly as a string
//This regex is more strict than the one used in the validateEmail function as it doesn't allow for some of the special characters that are allowed in the local part of the email address and it also ensures that the domain part of the email address is valid.
const StrictEmail = (v:any):boolean =>

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
const ALLOWED_KEYS:Array<string> = ["allowed_protocols",
                        "allowed_ports",
                        "allowed_domains",
                        "contain_fragment",
                        "contain_path",
                        "contain_query",
                        "between"]
const CheckWithConstraints = (url:string,xtra_constr:ExtraConstraints):boolean =>{
    
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

//Check Path [If path are allowed] ---> returns boolean
export const checkPath = (url:string,ifPaths:boolean):boolean =>{
      const path = url.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^/?#]+(\/[^?#]*)?/)
      
    if(!ifPaths){
        const re = /[\/]{1,}[a-zA-Z-0-9]+[\/]{1,}/
       return  path===null || path[1]===undefined || path[1]==='/'
    }
    return path ===null || path[1]!==undefined || path[1]!=='/' 
}


// Check domain [ if url domains matches any domain provided] ---> returns boolean
const checkDomain=(url:string,domains:string[]):boolean=>{
        if(domains.length===0)
        {
            return true
        }
        //converts all string to lowercase 
        domains =  domains.map(i=>i.toLowerCase())
      
        //domain or ip addr
        const domain = url.match(/\b([a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}|\d{1,3}(?:\.\d{1,3}){3})\b/) 
        return domain===null || domains.includes(domain[1])?true:false
    
    }


// Check Length enure url length is within the range ---> returns boolean
const checkLength=(url:string,range:number[])=>{
    if(range[1]===undefined){
        return url.length<range[0]?true:false
    }
 
    return url.length>range[0]&&url.length<range[1]?true:false

}

//Check Port [ if url port matches any of the port provided] ---> returns boolean
const checkPort = (url:string,ports:string[]):boolean=>{
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

//Check Query [ if query params are allowed] ---> returns boolean
const checkQuerys = (url:string,ifQuery:boolean):boolean=>{
    const query = url.match(/\?([^#\s]+)/)

    if(!ifQuery){
        //it means no query is allowed
        return query===null
    }

   return query!=null
}

//Check Fragments [if fragments are allowed or not] ---> returns boolean
const checkFragments = (url:string,ifFragments:boolean):boolean=>{
    const fragment = url.match(/#([^\s?#]+)/)
 
   if (!ifFragments){
            //if fragements  exist it should return false as no fragment was supposed to exist
            return fragment===null
            
        }
    return fragment!=null
}


//Check Protocols [ url protocols must  match any of the provided protocols ]--> returns boolean
const checkProtocols = (url:string,protocols:string[]):boolean =>{
        //lets break the url to get the scheme only 
        //we can split at : and get the first element or just check if the url matches  any protocol
        //we can just get index of the first : and slice it then.....
        const scheme = (url.split(':'))[0]//get the first element
        protocols = protocols.map(p=>p.toLowerCase())
        return protocols.includes(scheme)?true:false
}

//---------------------------------------------------------------------------
const CheckForDuplicates = (arr:string[]):{state:boolean, duplicate:string | null}=>{
    if (Array.isArray(arr) && arr.every((el)=>typeof el==='string')){
        for(let i=0;i<arr.length;i++){
            let key = arr.splice(i,1)//start from index an remove just one key
            if(arr.includes(key[0]))
                //checkingf if that key is still present inside then must have been 2 of them
                return {
                    state:true,
                    duplicate:key[0]
                }
            //else
                //put the key back but now at the ned of the array
            arr.push(key[0])
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
const removeK = (obj:{[key: string]: any},key:string)=>{
    delete obj[key]
}

//A function to check if an object has only 2 keys {rule and errorMsg}  OR 
// an array of objects where each object has only 2 keys {rule and errorMsg}
//Any errors thrown by CheckKeys will be caught by CheckForRuleAndError and rethrown to drea 
// which will be caught again and rethrown to developer
const CheckForRuleAndError = (restr_model :any):{status:boolean, error:null | string}=>{

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
                    error: null
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
const CheckKeys = (obj:RuleAndError_t):{status:boolean, error:null}=>{

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
            arr = arr.filter(v=>v!=="rule" &&  v!=="errorMsg")

            if(arr.length===1){
                throw new UnknownKeyError({
                    error_code:"ERR_UNKNOWN_KEY",
                    error_description:`'${arr}' is an unknown RuleAndError[]  key`
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


// ─────────────────────────────────────────────────────────────────────────────
// hasNest 
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns `true` when `value` is a plain nested object that `nestvalidate`
 * should recurse into, and `false` when it should be treated as an atomic leaf.
 *
 * Values that are treated as leaves (return `false`):
 * - `null` or `undefined`
 * - Arrays
 * - Primitives (`string`, `number`, `boolean`)
 * - drea-branded file wrappers (`DreaFileWrapper`) created by {@link __File}
 *
 * Values that are treated as nested objects (return `true`):
 * - Plain objects `{}`
 * - Class instances (guard at the schema level if atomic validation is needed)
 *
 * **`__File` exemption.**
 *
 * Because `typeof (new File(...)) === 'object'`, a raw `File` would be
 * classified as a nested object and `nestvalidate` would try to recurse
 * into its DOM properties (`name`, `size`, `type`, `lastModified`, …).
 * Wrapping the file with `__File(file)` produces a `DreaFileWrapper`, and
 * this method detects that brand first — before any object/array check —
 * and returns `false`. The file is then validated as a single atomic value
 * by the rule functions in the schema.
 *
 * @private
 * @template T
 * @param {T} value - The data field value to inspect.
 * @returns {boolean}
 *   `true` → recurse into `value` as a nested object.
 *   `false` → validate `value` as a leaf entry.
 *
 * @example
 * // Plain object → recurse
 * this.hasNest({ name: 'Alice' })                         // true
 *
 * @example
 * // Branded file wrapper → leaf (File validated atomically)
 * this.hasNest(__File(new File([''], 'photo.png')))        // false ✅
 *
 * @example
 * // Raw File (not wrapped) → recurse — use __File to prevent this
 * this.hasNest(new File([''], 'photo.png'))                // true ⚠️
 *
 * @example
 * // null → leaf
 * this.hasNest(null)                                       // false
 *
 * @example
 * // Array → leaf
 * this.hasNest([1, 2, 3])                                  // false
 */
function hasNest<T>(value: T): boolean {
    // If a drea wrapper — always treat as a leaf, never recurse the nest
    if (typeof value === 'function' && ((value as any).__asDreaFile === true || 
    (value as any).__asDreaAtom === true || 
    (value as any).__asDreaMayFile === true)
    ) return false
   

    return (
        value !== null &&
        value !== undefined &&
        typeof value === 'object' &&
        !Array.isArray(value)
    )
}



//Checks if the value v is a File brand 
const isDreaFile = (v:unknown): v is DreaFileWrapper => typeof v === 'function' && (v as any).__isDreaFile===true 

//Check if the value v is an atom brand
const isDreaAtom = (v:unknown): v is DreaAtomWrapper => typeof v === 'object' && (v as any).__isDreaAtom === true

//Check if the value v is either a File brand or just null
const isDreaMayFile = (v:unknown): v is MayDreaFileWrapper => v === null  || (v as any).__isDreaMayFile===true





export{
    CheckWithConstraints,
    CheckForDuplicates,
    removeK,
    CheckForRuleAndError,
    StrictEmail,
    isDreaFile,
    hasNest,
    isDreaMayFile
} 


