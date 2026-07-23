//Types Config 

//Url extra_constraints shape
export interface ExtraConstraints {
    allowed_protocols?: string[];
    contain_fragment?:boolean;
    contain_query?:boolean;
    allowed_ports?: string[];
    between?:number[];
    allowed_domains?:string [];
    contain_path?:boolean
}

//Shape of Error Object 
export interface Err {
    error_code: string;
    error_description:string;
}

//None type 
export type None = {
    __type : "none"
}
export const None: None = { __type: "none" }


//RuleAndError Shape [v can be 'any' type depending on the validation rule used]
export interface RuleAndError_t {
    rule : RegExp | ((v:any)=>boolean) | None;
    errorMsg : string | number | object | boolean | any[] | null;
}

//Shape of return type of validateEntry [_r --> result]
export type ValidateEntry_r = {
    status: boolean;
    error: RuleAndError_t['errorMsg']
}

//Shape of params of validateEntry [_p --> params]
export interface ValidateEntry_p  {
    entry: string | number | object | any[] | boolean | null ;
    RuleAndError: RuleAndError_t[] | MayDreaFileWrapper | DreaAtomWrapper | DreaFileWrapper
}

//Shape of return type for validateMany  [_r --> result]
export type ValidateMany_r = {
    value:ValidateEntry_p['entry'];
    error: RuleAndError_t['errorMsg'];
    status:boolean;
}

//Type ModelErrorObj  used by both ClassicModel and CustomClassicModelused to shap the error obj
export type ModelErrorObj= {
  [key:string]:{
    status: boolean;
    error: RuleAndError_t['errorMsg'];
    value: ValidateEntry_p['entry'];
  } | ModelErrorObj //recursive type for nested objects
}


//Return type for CustomClassicModel and ClassicModel validate() 
export type ModelResultObj<T> = {
    status:boolean;
    error:null | ModelErrorObj;
    data:T | null
}


//CustomClassicModel restr_schema shape 
export interface SchemaRestriction {
    [key: string]: SchemaRestriction |RuleAndError_t| RuleAndError_t[] |MayDreaFileWrapper|DreaFileWrapper// index signature for string keys
}


//Data object type 
export type object_p<T> = 
    T extends object ? T extends Function? never//no functins allowed
    : T extends readonly any[]? never
    : T extends Date | Map<any,any> |Set<any>? never
    : T
    : never;

export type PureObject = object_p<Record<string,ValidateEntry_p['entry']>>


/**
 * The opaque wrapper type returned by {@link __File}.
 *
 * A `DreaFileWrapper` is a zero-argument function that returns the original
 * `File` instance when called. It carries the `__isDreaFile` brand that
 * `hasNest` uses internally to recognise file wrappers and treat them as
 * atomic leaves rather than recursing into the `File` object's properties.
 *
 * Treat this type as opaque — its internal shape is an implementation detail
 * and may change between minor releases. Interact with it only through
 * {@link __File} (to create) and your rule functions (to receive).
 *
 * @example
 * const wrapped: DreaFileWrapper = __File(new File([''], 'photo.png'))
 * // Inside a rule, the unwrapped File is passed automatically:
 * // rule: (v: File) => v.size < 5 * 1024 * 1024
 */
export type DreaFileWrapper = {():RuleAndError_t[],readonly __isDreaFile: true }

/**
 * The opaque wrapper type returned by {@link __mayFile}.
 *
 * A `MayDreaFileWrapper` is a zero-argument function that returns the original
 * `File` instance or null value when called. It carries the `__isDreaMayFile` brand that
 * `hasNest` uses internally to recognise file wrappers and treat them as
 * atomic leaves rather than recursing into the `File` object's properties.
 *
 * Treat this type as opaque — its internal shape is an implementation detail
 * and may change between minor releases. Interact with it only through
 * {@link __mayFile} (to create) and your rule functions (to receive).
 *
 * @example
 * const wrapped: MayDreaFileWrapper = __mayFile(new File([''], 'photo.png'))
 * // Inside a rule, the unwrapped File is passed automatically:
 * // rule: (v: File) => v.size < 5 * 1024 * 1024
 */
export type MayDreaFileWrapper = {
    ():  RuleAndError_t[],
    readonly __isDreaMayFile: true }

//Similar to DreaFileWrapper but returns File or null
export type DreaAtomWrapper = {(): PureObject,  readonly __isDreaAtom: true }
