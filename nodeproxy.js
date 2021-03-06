var httpProxy = require('http-proxy'),
    fs = require('fs');

var options = {
    maxSockets: 100000,
    hostnameOnly: true,
    router: {}
};

var nodeProxyDir = __dirname;
fs.readdir(nodeProxyDir, function(err, files) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }

    for (var i = 0, ln = files.length, file, data; i < ln; i++) {
        file = files[i];
        if (file.slice(-5) === '.json') {
            data = fs.readFileSync(nodeProxyDir + '/' + file, 'utf8');
            data = JSON.parse(data);
            for (var name in data) {
                options["router"][name] = data[name];
            }
        }
    }
    
    //create proxy server
    var server = httpProxy.createServer(options);
    
    //start proxy server
    server.listen(80, function() {
        console.log('Node Proxy Server started with options:', options);
        // Downgrade the process to run as the ubuntu group and user now that it's bound to privileged ports.
        process.setgid('ubuntu');
        process.setuid('ubuntu');
    });
});
