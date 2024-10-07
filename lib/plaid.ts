import {Configuration, PlaidApi, PlaidEnvironments} from 'plaid'

const plaidConfig = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
            
        }
    }
})

export const plaidClient = new PlaidApi(plaidConfig)

//lot of this software hv few things in common such as appwrite or plaid 
// u do the same thing u create a client and expose it to the client  then you can use that appwrite client to make requests to the appwrite server
//in a similar way u create a plaid client and expose it to the client and use that plaid client to make requests to the plaid server

