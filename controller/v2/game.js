
function Game() {

}

//############interface area###############
/**
 * @method get
 * @summary summary test part
 * @description description test part
 * @requestParam userId 
 * @requestParam targetId 
 *  */
Game.prototype.part = async function (ctx, next){
	const paramsBody = ctx.params,
		userId = paramsBody.userId,
		targetId = paramsBody.targetId;
	ctx.body = {code: 200,};
}

//############interface area###############

module.exports = new Game();
