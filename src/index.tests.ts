import { ArgumentTypeError } from './errors.js'
import { 
  isUsernameValid, 
  isEmailValid, 
  isPhoneNumberValid, 
  isRequired, 
  None ,
  CustomClassicModel,Normalizer,
  validateEntry,
  __File,
  __mayFile,
} from './index.js'

/* 
//Nested address schema
const useAddressSchema = {
  street:[
      { rule:(v)=>isRequired(v.trim()).status===true, errorMsg:"Please provide your street name" },
      { rule:(v)=>typeof v==='string', errorMsg:"Must be a string" },//
      { rule:/^[a-zA-Z0-9\s.,-]+$/, errorMsg:"Street name has some invalid characters"},
      { rule:(v)=>v.length > 3, errorMsg:"Street name too short" },
      { rule:(v)=>v.length < 100, errorMsg:"Street name too long" }
  ],
  city:[
    { rule:(v)=>isRequired(v.trim()).status===true, errorMsg:"Please provide your city" },
    { rule:(v)=>typeof v==='string', errorMsg:"Must be a string" },//
    { rule:/^[a-zA-Z]+$/, errorMsg:"City can only conatins letters"}
  ],
  country:[
    { rule:(v)=>isRequired(v.trim()).status===true, errorMsg:"Please provide your country" },
    { rule:(v)=>typeof v==='string', errorMsg:"Must be a string" },//
    { rule:/^[a-zA-Z]+$/, errorMsg:"Country can only contains letters"}
  ]
}

//Main schema
const schema = {
  id:{ rule:None, errorMsg:""},//No validation
  name:[
    { rule:(v)=>isRequired(v.trim()).status===true, errorMsg:"Please provide your name" },
    { rule:(v)=>typeof v==='string', errorMsg:"Must be a string"},//
    { rule:/^[a-zA-Z\s-]+$/, errorMsg:"Name must contains only letters"},
    { rule:(v)=>v.length>3, errorMsg:"Name too small" },
   // { rule:(v)=>v.length<40, errorMsg:"Name getting longer" },
    { rule:(v)=>v.length<50, errorMsg:"Name too long" }
  ],
  email:[
    { rule:(v)=>isRequired(v.trim()).status===true, errorMsg:"Please provide your email" },
    { rule:(v)=>typeof v==='string', errorMsg:"Must be a string"},//
    { rule:(v)=>isEmailValid(v).status===true, errorMsg:"Invalid email address" }
  ],
  age:[
    { rule:(v)=>isRequired(v).status===true, errorMsg:"Please provide your age" },
    { rule:(v)=>typeof v==='number', errorMsg:"Must be a number"},
    { rule:(v)=>v>=18, errorMsg:"Must be above 18yrs" },
    { rule:(v)=>v<25, errorMsg:"Must be between 18 and 25yrs" }
  ],
  address:useAddressSchema
}


//data
const user = {
  id:"G23fWke25***",
  name:"John doe",
  age:23,
  address:{
    street:"Plache Street",
    city:"DammeVille",
    country:"Cameroon"
  }
}

const model = new CustomClassicModel(schema)

test("Testing Level 1 Nest Validation",()=>{
  expect(model.nestvalidate(user)).toEqual(
    {
      status:true,
      error:null,
      data:user
    }
  )
}) 
  
*/





/* 
  const schema = {
  company: {
    name: {
      rule: (v) => typeof v === 'string' && v.length > 2,
      errorMsg: 'Company name must be at least 3 characters'
    },
    address: {  // ← level 2
      city: { rule: (v) => typeof v === 'string' && v.length > 0, errorMsg: 'City is required' },
      zip:  { rule: (v) => /^\d{5}$/.test(v),                     errorMsg: 'Zip must be exactly 5 digits' }
    }
  }
}

const model = new CustomClassicModel(schema)

// ✅ Success
model.nestvalidate({
  company: { name: 'Acme Corp', address: { city: 'Springfield', zip: '12345' } }})

//
test("Testing Level 2 Nest Validation",()=>{
  expect(model.nestvalidate({
        company: { 
          name: 'Acme Corp', 
          address: { 
            city: 'Springfield', 
            zip: '12345' 
            } 
          }
        })).toEqual(
          { status:true,error:null,data:
            {
              company: { 
                name: 'Acme Corp', 
                address: { 
                  city: 'Springfield', 
                  zip: '12345' 
                  } 
                }
            }})
}) 

*/


/* 
const schema= {
  profile:[
        { rule:(v)=>v===null?true:['image/jpg','image/jpeg','image/webp','image/png'].includes(v?.type), 
          errorMsg:"Acceptable file types are jpg, webp or png file" },
        { rule:(v)=>v===null?true:Math.floor(v?.size/(1024*1024))<7, 
          errorMsg:"Max File size is 6MB" }]
        }


const d = {
  profile:__File({
    name:"C.pdf",
    size:34422,
    type:"image/jpg"
  })
}

const m = new CustomClassicModel(schema)

test("Testing the File validation on nestvalidation",()=>{
  expect(m.nestvalidate(d)).toEqual({
    status:true,
    error:null,
    data:d
  })
}) 

*/

//Testing with validateEntry
test("Testing validateEntry on a primitive value",()=>{
  expect(validateEntry({
    entry:1,
    RuleAndError:[{ rule:(v)=>v===1, errorMsg:"value should be one" }]
  }))
  .toEqual({ status:true,error:null })
})

test("Testing validateEntry on an object",()=>{
  expect(validateEntry({
    entry:{name:"allisson",status:"online"},
    RuleAndError:[{rule:(v)=>v.name==='max',errorMsg:"name must be `Max`"}]
  })).toEqual({ status:false, error:"name must be `Max`"})
})

test("Testing validateEntry on a function",()=>{
  expect(validateEntry({
    entry:(()=>({name:"allison",status:"online"}))(),
    RuleAndError:[ {rule:(v)=>v.name==='allison', errorMsg:"name must be allison"},
      { rule:(v)=>v.status ==='online', errorMsg:"status must be online"}
    ]
  }).status).toBe(true)
})


test("Testing validateEntry using None as rule",()=>{
  expect(validateEntry({
    entry:"None",
    RuleAndError:[{rule:None,errorMsg:null}]
  }))
})


test("Testing validateEntry on a file using __File",()=>{
  expect(validateEntry({
    entry:new File(["Content A fileBits where the size is also calculated"],"name.txt",
      {type:"application/txt"}),
    RuleAndError:[{
      rule:(v)=>v.type==='text/plain',errorMsg:"Must be a txt file"
    }]
  }).status).toBe(false)
})


//Testing CustomClassicModel
//1. validate
const data_without_nest= {
  id:'N2oE*****',
  name:"Alice",
  file:new File(["Content"],"Resume.pdf",{
    type:"application/pdf",
    lastModified:(new Date('2026-07-19')).getTime()
  })
}

const schema = {
  id:{rule:None,errorMsg:null},
  name:{ rule:/[A-Za-z/s]+/, errorMsg:"name must contain only letters"},
  file:__mayFile([
    {rule:(v)=>v!=null,errorMsg:'File is required'},
    { rule:(v:unknown)=>(v as any).type==='application/pdf',errorMsg:"only pdf is allowed"},
    { rule:(v:unknown)=>(v as any).name==='Resume.pdf',errorMsg:"file must be called `Resume` "},
    { rule:(v:unknown)=>(new Date('2026-07-28').getTime())>(v as any).lastModified, errorMsg:`file modified after due date`}
  ])
}

const ccl = new CustomClassicModel(schema)

test("Testing ccl with validate()",()=>{
  expect(()=>ccl.validate(data_without_nest)).toThrow(new ArgumentTypeError({
    error_code:"ERR_INVALID_ARGTYPE",error_description:"drea file wrappers should not be used when using validate()"
  }))
})




//nestvalidate
const data_with_nest = {
  id:'N2oE*****',
  name:"Alice",
  file:null,
  profile:{
    about:"hi, am alice....",
    address:"7421 Maple Grove Lane",
    phone:'+442079460123'
  }
}

//extend the schema by adding a nested schema part for profile nest object
ccl.extend({
  profile:{
    about:[
      {rule:(v)=>isRequired(v).status===true,errorMsg:"field is required"},
      { rule:(v)=>typeof v==='string',errorMsg:"accepts only string"},
      {rule:(v)=>v.length<200,errorMsg:"max number of chars (200) exceeded"}
    ],
    address:[      
      {rule:(v)=>isRequired(v).status===true,errorMsg:"field is required"},
      {rule:(v)=>v.startsWith('7421'),errorMsg:"street number must be 7421"},
      {rule:(v)=>v.length<200,errorMsg:"address too long"}],
    
    phone:[
      {rule:(v)=>isRequired(v).status===true,errorMsg:"field is required"},
      {rule:(v)=>v.startsWith('+44'),errorMsg:"requires a UK phonenumber"}, // Use or call other stuffs to ensure number format matches UK format
      {rule:(v)=>v.length<15,errorMsg:"phonenumber too long"}
   
    ]
  }
})// We've extended the schema by adding a nested obj in it

test("Testing ccl on nestvalidate()",()=>{
  expect(ccl.nestvalidate(data_with_nest)).toEqual({status:false,error:{
    file:{
          error: "File is required",
          status: false,
          value: null,
        }
      },data:null}) //We expect n error on this field
})

