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
    if (typeof window !== 'undefined') {

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
    }
}
function setUserToken(token: string) {
    localStorage.setItem('token', token)
}
function getUserToken() {
    if (typeof window !== 'undefined') {

        return localStorage.getItem('token')
    } else return ""
}
function setUser(user: any) {
    let userData = JSON.stringify(user)
    return localStorage.setItem('user', userData)
}
function getUser() {
    if (typeof window !== 'undefined') {

        return localStorage.getItem('user')
    }
    else return ""
}
function getUserId() {
    if (typeof window !== 'undefined') {

        return localStorage.getItem('userId')

    } else return ""
}
function setCurrentLocation(current_location: any) {

    localStorage.setItem('current_location', JSON.stringify(current_location));
}

function getCurrentLocation() {
    if (typeof window !== 'undefined') {

        return localStorage.getItem('current_location');
    } else return ""
}
function setCart(cart_items: any) {
    localStorage.setItem('cart_items', JSON.stringify(cart_items));
}
function unsetCart() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('cart_items');
    }
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

function getLanguage() {
    return localStorage.getItem('i18nextLng');
}

export const localStorageService = {
    setUserTheme,
    getUserTheme,

    setUserCredentials,
    unsetUserCredentials,
    setUserToken,
    getUserToken,
    getUser,
    setUser,
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
    getDelivery,
    getLanguage,
};
