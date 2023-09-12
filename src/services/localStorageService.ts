function setUserTheme(theme: string) {
    localStorage.setItem('theme', theme)
}
function getUserTheme() {
    return localStorage.getItem('theme')
}

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
function setUserToken(token: string) {
    localStorage.setItem('token', token)
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
function getCart() {
    return localStorage.getItem('cart_items');
}
function setComment(comment: string) {
    localStorage.setItem('comment', comment);
}
function getComment() {
    return localStorage.getItem('comment');
}
function unsetComment() {
    localStorage.removeItem('comment');
}
function setCodePromo(comment: string) {
    localStorage.setItem('codePromo', comment);
}
function getCodePromo() {
    return localStorage.getItem('codePromo');
}
function unsetCodePromo() {
    localStorage.removeItem('codePromo');
}
function setBonus(bonus: string) {
    localStorage.setItem('bonus', bonus);
}
function getBonus() {
    return localStorage.getItem('bonus');
}
function unsetBonus() {
    localStorage.removeItem('bonus');
}


function setSupplier(restaurant: any) {
    localStorage.setItem('supplier', JSON.stringify(restaurant));
}
function getSupplier() {
    return localStorage.getItem('supplier');
}

function setDelivery(delivery: number) {
    localStorage.setItem('delivery', delivery.toString());
}

function getDelivery() {
    return localStorage.getItem('delivery');
}

export const localStorageService = {
    setUserTheme,
    getUserTheme,
    
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
    getComment,
    unsetComment,
    setCodePromo,
    getCodePromo,
    unsetCodePromo,
    setBonus,
    getBonus,
    unsetBonus,
    setSupplier,
    getSupplier,
    setDelivery,
    getDelivery
};
