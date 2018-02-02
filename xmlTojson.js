const validator = require('validator');
const parser = require('xml2json');
const utils = require('./utils');
var options = {
    object: false,
    reversible: true,
    coerce: false,
    sanitize: false,
    trim: true,
    arrayNotation: false,
    alternateTextNode: true
};

const show_status = utils.show_status;
const clear_status = utils.clear_status;
const remove_slash = utils.remove_slash;
const format_values = utils.format_values;

module.exports = function (RED) {
    function Convert(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function (msg) {
            clear_status(node);
            format_values(config);
            options.coerce = config.coerce || msg.coerce;
            options.trim = config.trim || msg.trim;
            options.sanitize = config.sanitize || msg.sanitize;
            options.arrayNotation = config.arrayNotation || msg.arrayNotation;
            let payload = msg.payload;
            show_status(node, 'in_progress');
            // msg.statusCode = response.statusCode;
            // msg.statusMessage = response.statusMessage;
            try {
                if (typeof (payload) == 'string') {
                    msg.payload = parser.toJson(payload, options);
                    try { msg.payload = JSON.parse(msg.payload); } // obj
                    catch (e) { node.warn(RED._("error in converting string to json")); }
                } else if (typeof (payload) == 'object')
                    msg.payload = parser.toXml(payload, options);

            } catch (err) {
                node.warn(RED._("Formating error"));
            }


            show_status(node, 'success');
            node.send(msg);
            clear_status(node)
        });
    }
    RED.nodes.registerType('xmlTojson', Convert);
};