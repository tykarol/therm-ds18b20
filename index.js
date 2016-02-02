var fs           = require('fs');
var util         = require('util');
var EventEmitter = require('events').EventEmitter;

function Thermometer(options) {
	var _this = this;

	EventEmitter.call(this);

	options = util._extend({
		id: null,
		oneWirePath: '/sys/bus/w1/devices/%id%/w1_slave',
		regExp: /t=([\-0-9]+)/,
		interval: false
	}, options);

	var inited   = null;
	var file     = null;
	var interval = null;

	this.init = function() {
		if(inited === null) {
			inited = true;

			if(!options.id || !options.oneWirePath || !options.regExp) {
				this.emit('error', new Error('Invalid parameters'));
			} else {
				file = options.oneWirePath.replace('%id%', options.id);
				this.emit('init');
			}
		}

		return this;
	}

	this.run = function() {
		if(inited === null) {
			this.init();
		}

		if(inited !== false) {
			if(!isNaN(options.interval) && options.interval > 0) {
				interval = setInterval(function() {
					_this.get();
				}, options.interval);

				_this.get();

				_this.once('error', function(err) {
					clearInterval(interval);
				});
			}
		}
	}

	this.halt = function() {
		clearInterval(interval);
	}

	this.get = function() {
		if(!file) {
			_this.emit('error', new Error('Invalid file path'));
		} else {
			var getTimestamp = new Date().getTime();

			fs.readFile(file, 'utf-8', function(error, data) {
				if(error) {
					_this.emit('error', new Error('File error'));
				} else {
					var matches = data.match(options.regExp);
					
					if(matches && matches[1]) {
						var realTimestamp = new Date().getTime();
						var C = parseFloat(parseInt(matches[1]) / 1000);
						var K = parseFloat(C + 273.15);

						_this.emit('data', {
							getTimestamp: getTimestamp,
							realTimestamp: realTimestamp,
							C: C,
							K: K
						});
					} else {
						_this.emit('data', null);
					}
				}
			});
		}

		return this;
	}

	return this;
}

util.inherits(Thermometer, EventEmitter);

module.exports = Thermometer;

