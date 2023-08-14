function setUserCredentials(user: any, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id.toString());
    localStorage.setItem('user', JSON.stringify(user));
}
function unsetUserCredentials() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
}
function setUserToken(token:string){
    localStorage.setItem('token',token)
}
function getUserToken() {
    return localStorage.getItem('token')
}
function getUser() {
    return localStorage.getItem('user')
}
function getUserId() {
    return localStorage.getItem('userId')
}
function setCurrentLocation(current_location: any) {
    localStorage.setItem('current_location', JSON.stringify(current_location));
}
function getCurrentLocation() {
    return localStorage.getItem('current_location');
}
function setCart(cart_items: any) {
    localStorage.setItem('cart_items', JSON.stringify(cart_items));
}
function unsetCart() {
    localStorage.removeItem('cart_items');
}
function getCart(){
    return localStorage.getItem('cart_items');
}
function setComment(comment: string) {
    localStorage.setItem('comment', comment);
}
function unsetComment() {
    localStorage.removeItem('comment');
}
function setSupplier(restaurant:any){
    localStorage.setItem('supplier', JSON.stringify(restaurant));
}
function getSupplier(){
    return localStorage.getItem('supplier');
}

function setDelivery(delivery:number){
    localStorage.setItem('delivery',delivery.toString());
}

function getDelivery(){
    return localStorage.getItem('delivery');
}

export const localStorageService = {
    setUserCredentials,
    unsetUserCredentials,
    setUserToken,
    getUserToken,
    getUser,
    getUserId,
    setCurrentLocation,
    getCurrentLocation,
    setCart,
    unsetCart,
    getCart,
    setComment,
    unsetComment,
    setSupplier,
    getSupplier,
    setDelivery,
    getDelivery
};
