
function User() {

}

//############interface area###############
/**
 * @method post
 * @summary 小程序登录2
 * @description code必选；encryptedData，iv授权之后传2
 * @requestParam code2 
 * @requestParam encryptedData2 
 * @requestParam iv2 
 *  */
User.prototype.spLogin2 = async (ctx, next) => {

}

//############interface area###############

module.exports = new User();
