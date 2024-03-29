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
	      if (params.length !== 1) {
	        logger.error('%s - Create new User requires params of length 2, found %s, %j', method, params.length, params);
	        return Response(false, 'Create new User requires params of length 2');
	      }
	      const req = JSON.parse(params[0]);
	      const createRequest = {
	        id: req.id,
	        name: req.name,
	        role: 'contract',
	      };

	      const schema = [
	        { name: 'id', type: 'string', required: true },
	        { name: 'name', type: 'string', required: true },
	        { name: 'contract', type: 'string', required: false },
	      ];
	      SchemaCheker.check(schema, createRequest);
	      logger.debug('%s - Create new spv with options %j', method, createRequest);
	      let account = await stub.invokeChaincode(EARTH_CHAINCODE_ID, ['account.create', JSON.stringify(createRequest)]);
	      account = account.payload.toString('utf8');
	      logger.debug('%s - Create new spv account %j', method, account);
	      account = JSON.parse(account);
	      logger.debug('- invokeChaincode Options:%j', createRequest);
	      return Response(true, account);
	    } catch (e) {
	      logger.error('%s - Error: %o', method, e);
	      return Response(false, e.message);
    	}
	}

	static async InitSPVToken(stub, params) {
		const method = '';
		logger.debug('%s - enter', method);
		try {
		  logger.enter(method);
	      if (params.length !== 1) {
	        logger.error('%s - InitSPVToken requires params of length 1, found %s, %j', method, params.length, params);
	        return Response(false, 'InitSPVToken requires params of length 1');
	      }
    	const req = JSON.parse(params[0]);
			const iTokenReq = {
	 	  name: req.name + 'itoken',
		  symbol: 'i' + req.name,
		  decimals: 8,
		  amount: 100000,
		  description: 'income token',
		  mintageAccountId: req.id,
		  gasAccountId: 'admin',
		  gasMin: 0.01,
		  gasPercentage: 0.01,
		  ramAccountId: 'admin',
		  ramMin: 0.01,
		  ramPercentage: 0.01
		  };
	  logger.debug('- Create spv iToken Options:%j', iTokenReq);
	  let account = await stub.invokeChaincode(EARTH_CHAINCODE_ID, ['token.create', JSON.stringify(iTokenReq)]);
	  logger.debug('- invokeChaincode Options:%j', account);
	  const sTokenReq = {
	  name: req.name + 'itoken',
	  symbol: 's' + req.name,
	  decimals: 8,
	  amount: 100000,
	  description: 'share token',
	  mintageAccountId: req.id,
	  gasAccountId: 'admin',
	  gasMin: 0.01,
	  gasPercentage: 0.01,
	  ramAccountId: 'admin',
	  ramMin: 0.01,
	  ramPercentage: 0.01
	  };
	  account = await stub.invokeChaincode(EARTH_CHAINCODE_ID, ['token.create', JSON.stringify(sTokenReq)]);
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