# therm-ds18b20

Get temperature from DS18B20 sensor connected to Raspberry Pi by 1-wire.

## How to use
```javascript
    var Thermometer = require('./index');
    
    // Example 1 - Get data in the interval
    var therm1 = new Thermometer({
        id: '28-000003eacfa3', // device id
        interval: 600000 // interval in ms, 600000ms = 10min
    }).on('data', function(data) {
        if(data) {
            console.log(data);
        }
    }).run();
    
    // Example 2 - Get data on demand
    var therm2 = new Thermometer({
        id: '28-000003eacfa3' // device id
    }).on('data', function(data) {
        if(data) {
            console.log(data);
        }
    }).init();

    therm2.get(); // This works also with interval

    // Example 3 - Handle errors
    var therm3 = new Thermometer({
        id: '28-000003eacfa3', // device id
        interval: 600000 // interval in ms, 600000ms = 10min
    }).on('init', function() {
        console.log('inited');
    }).on('data', function(data) {
        if(data) {
            console.log(data);
        }
    }).on('error', function(error) {
        console.log(error)
    }).run();

    // To halt interval you can use halt method
    therm3.halt();
```

### Options
    
    Option | Type | Required | Description
    -------|------|----------|------------
    `id` | `string` | yes | Device id - It is the same as the file name of the sensor.
    `interval` | `int` or `null` | no | Interval data retrieval (default: null - interval disabled).
    `oneWirePath` | `string` | no | Path to 1-wire sensor file (default: '/sys/bus/w1/devices/%id%/w1_slave'). %id% will be replaced by device id.
    `regExp` | `RegExp` | no | RegExp to extract temperature from sensor file (default: /t=([\-0-9]+)/).

### Events
    
    Name | Params |Description |
    -----|--------|------------|
    `init` |  | When `init()` function will be launched (fired olny once - when not inited before).
    `error` | `Error` | On error on init or get data etc.
    `data` | `{}` or `null` | Data from sensor.

### Methods

    Name | Description
    -----|------------
    `init` | Initialize thermometer (works only once, Events: `init` or `error`).
    `run` | Initialize thermometers if not initialized and run interval if `interval` option is set (Events: no or `error`).
    `halt` | Clear interval (Events: no).
    `get` | Get data from sensor file (Events: `data` or `error`).

## License

The MIT License (MIT)
