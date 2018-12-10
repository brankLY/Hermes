/* eslint-disable no-case-declarations */
const Response = require('../utils/Response');
const {
	SPV_CHAINCODE_NAME,
	SPV_CHAINCODE_ID,
	EARTH_CHAINCODE_ID,
} = require('../utils/Constants');
const logger = require('../utils/Logger').getLogger('handler');
const SchemaCheker = require('../utils/SchemaChecker');

class SPVHandler {
	/**
   * Sample code for create new contract account on Earth chaincode
   * This method will create an account of type "contract" at Earth
   *
   * @param {ChaincodeStub} stub
   * @param {string} contractAccountId the contract account for this Dapp at Earth
  */
	static async Create(stub, params) {
		const method = 'Create';
		logger.debug('%s - enter', method);
		try {
	      logger.enter(method);
	      if (params.length !== 2) {
	        logger.error('%s - Create new User requires params of length 2, found %s, %j', method, params.length, params);
	        return Response(false, 'Create new User requires params of length 2');
	      }
	      const createRequest = {
	        id: params[0],
	        name: params[1],
	        role: 'spv',
	      };

	      const schema = [
	        { name: 'id', type: 'string', required: true },
	        { name: 'name', type: 'string', required: true },
	        { name: 'spv', type: 'string', required: false },
	      ];
	      SchemaCheker.check(schema, createRequest);
	      logger.debug('%s - Create new spv with options %j', method, createRequest);
	      let account = await stub.invokeChaincode(EARTH_CHAINCODE_ID, ['account.create', JSON.stringify(createRequest)]);
	      account = account.payload.toString('utf8');
	      logger.debug('%s - Successfully create new User in bc, response: %s', method, account);
	      return Response(true, account);
	    } catch (e) {
	      logger.error('%s - Error: %o', method, e);
	      return Response(false, e.message);
    	}
    }
}

module.exports = SPVHandler;