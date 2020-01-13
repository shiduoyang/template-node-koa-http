
function Common2() {

}

//############interface area###############
/**
 * @method post
 * @summary spLogin
 * @description description
 * @requestParam code 
 *  */
Common2.prototype.spLogin = async function (ctx, next){
	const paramsBody = ctx.request.body,
		code = paramsBody.code;
	ctx.body = {code: 200,};
}

//############interface area###############

module.exports = new Common2();
