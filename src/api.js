//
const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://main-api.academy-polyglot.site'
    : 'http://localhost:5001';

export const API_URL_Product_Details = `${BASE_URL}/api/products/`;
export const API_URL_Comment = `${BASE_URL}/api/comments`;
export const API_URL_Gallery = `${BASE_URL}/api/gallery`;
export const API_URL_Newsletter = `${BASE_URL}/api/newsletter`;
export const API_URL_Product_Collection = `${BASE_URL}/api/product`;
export const API_URL_Cart_Page = `${BASE_URL}/api/orders`;
export const API_URL_Contact_Page = `${BASE_URL}/api/contact`;
export const API_URL_Products = `${BASE_URL}/api/products`;
export const API_URL_Product_Page = `${BASE_URL}/api/products`;
export const API_URL_Teacher_Page = `${BASE_URL}/api/teachers`;
export const API_URL_MyTeam = `${BASE_URL}/api/myTeam`;
