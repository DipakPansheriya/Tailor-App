export interface AuthResponse {
    idToken:string,
    email:string,
    refreshToken:string,
    expiresIn:string,
    localId:string
    registerd?:boolean
}

export interface CustomerList {
    id: string,
    firstName:string
    lastName:string
    mobileNo:number
}