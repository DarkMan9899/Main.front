export const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://polyglotacademy.am';
export const IDRAM_ACCOUNT_ID = '100049302';
export const CUSTOMER_EMAIL = 'academy.polyglott@gmail.com';

export const PAYMENT_CONFIG = {
    idram: {
        formAction: 'https://banking.idram.am/Payment/GetPayment',
        language: 'EN',
    },
    ameria: {
        merchantId: process.env.REACT_APP_AMERIA_MERCHANT_ID,
        terminalId: process.env.REACT_APP_AMERIA_TERMINAL_ID,
        merchantName: "PolyglotAcademy",
        appIdentifier: process.env.REACT_APP_AMERIA_APP_IDENTIFIER,
    },
    telcell: {
        formAction: 'https://telcellmoney.am/invoices',
        issuer: 'davitkirakosyan99@gmail.com',
        currency: '֏',
        validDays: 10,
        language: 'en',
        shop_key: process.env.REACT_APP_TELCELL_SHOP_KEY ,

    }
};