// var { AbstractWeb3Module } = require('web3-core');
// var { Network } = require('web3-net');
// var Utils = require('web3-utils');
// var { formatters } = require('web3-core-helpers');
// var { ProviderResolver } = require('web3-providers');
// var { AbstractMethodFactory, AbstractMethod } = require('web3-core-method');
var Web3 = require('web3');
var web3 = new Web3();

// class GetPowerMethod extends AbstractMethod {
//
//     constructor(utils, formatters, moduleInstance) {
//         super('eth_getPower', 2, utils, formatters, moduleInstance);
//     }
//
//     beforeExecution(moduleInstance) {
//       this.parameters[0] = this.formatters.inputAddressFormatter(this.parameters[0]);
//       this.parameters[1] = this.parameters[1] || moduleInstance.defaultBlock;
//     }
//
//     afterExecution(response) {
//       return response;
//     }
// }
//
// class MethodFactory extends AbstractMethodFactory {
//     constructor(utils, formatters) {
//         super(utils, formatters);
//
//         this.methods = {
//             getPower: GetPowerMethod
//         };
//
//     }
// }
//
// class PowerModule extends AbstractWeb3Module {
//     constructor(provider, methodFactory, net, utils, formatters, options, nodeNet) {
//         super(provider, options, methodFactory, nodeNet);
//
//         this.utils = utils;
//         this.formatters = formatters;
//         this.net = net;
//     }
// }
//
// exports.Power = function Power(provider, net = null, options = {}) {
//     const resolvedProvider = new ProviderResolver().resolve(provider, net);
//     return new PowerModule(
//         resolvedProvider,
//         new MethodFactory(Utils, formatters),
//         new Network(resolvedProvider, null, options),
//         Utils,
//         formatters,
//         options,
//         null
//     );
// }
exports.Power = {
    property: 'etz',
    methods: [{
        name: 'getPower',
        call: 'eth_getPower',
        params: 2,
        inputFormatter: [web3.extend.formatters.inputAddressFormatter, web3.extend.formatters.inputDefaultBlockNumberFormatter],
        // outputFormatter: web3.utils.hexToNumberString
    }]
}
