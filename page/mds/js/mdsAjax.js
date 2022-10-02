if (typeof (mdsAjax)=="undefined") {
	Ext.namespace('mdsAjax');
}

mdsAjax.doAjaxRequest = function(passedInOptions) {
	var fOptions = {
		url: undefined,
		params: {},
		successCallback: undefined,
		noResponseCallback: undefined,
		afterFailMessageCallback: undefined,
		disableCaching: true,
		timeout: Ext.Ajax.timeout
	};
	for (var key in passedInOptions){
		if (passedInOptions.hasOwnProperty(key) && fOptions.hasOwnProperty(key)) 
			fOptions[key] = passedInOptions[key];
	}
	fOptions.url = mdsAjax.adaptURL(fOptions.url, fOptions.params);

	fOptions.callback = function(success, responseJSON){
		if (!success){
			if (responseJSON.message !== "") Ext.Msg.alert("", responseJSON.message);
			else Ext.Msg.alert("", "An error has occurred.");
			if (fOptions.afterFailMessageCallback) fOptions.afterFailMessageCallback(responseJSON.data);
		} else if (fOptions.successCallback) fOptions.successCallback(responseJSON.data);
	};

	Ext.data.JsonP.request(fOptions);
};

mdsAjax.jsonpCallback = function(data) {
	var scripts = document.getElementsByTagName('script');
	var script;
	for (var i = 0; i < scripts.length; i++){
		//if (scripts[i].src.match("callback=Ext.data.JsonP")) {
		if (scripts[i].src.match("callback=")) {
			if (Object.prototype.toString.call(data) === '[object Array]') {
				var data = data.filter(function(el) {
					return !el.hasOwnProperty("jsonPRef")
				});
			}        
			script = scripts[i];
			break;
		}
	}
 
	if (script !== undefined) {
		var queryString = script.src.replace(/^[^\?]+\??/, '');
		var callback = queryString.split("Ext.data.JsonP.")[1];

		Ext.data.JsonP[callback](data);
	}
};

mdsAjax.adaptURL = function(url, params) {
	var splitURL = url.split("?");
	var paramsInURL = Ext.Object.fromQueryString(splitURL[1]);
	var paramsArray = [];

	for (var key in paramsInURL) {
		if (paramsInURL.hasOwnProperty(key) && key != "fuseaction" && paramsInURL[key] != null){
			paramsArray.push("" + key + "=" + ("" + paramsInURL[key]).replace(/[^a-zA-Z0-9-_]/g, ""));
		}
	}
	for (key in params) {
		if (params.hasOwnProperty(key) && key != 'id' && key != 'node' && params[key] != null){
			paramsArray.push("" + key + "=" + ("" + params[key]).replace(/[^a-zA-Z0-9-_]/g, ""));
		}
	}
	Ext.Array.sort(paramsArray);

	var filename = paramsArray.join("&");
	if (!filename) filename = "data.js";
	else filename = filename + ".js";

	return "../json/" + paramsInURL.fuseaction + "/" + filename;
};

Ext.data.Types.TZADATE = {
	convert: function(value, record) {
		if (!value)
			return null;
		var dsSplit = value.split(" ");
		if (dsSplit.length > 4)
			dsSplit.pop();
		return new Date(dsSplit.join(" "));
	},
	type: 'tzaDate'
};

Ext.data.proxy.JsonP.override({
	buildRequest: function(operation) {
		var me = this; 
		var params = operation.params = Ext.apply({}, operation.params, me.extraParams);
		var request, url;

		if (operation.id !== undefined && params[me.idParam] === undefined) {
			params[me.idParam] = operation.id;
		}

		if (me.config.api.read !== undefined && me.config.api.read != '') {
			url = mdsAjax.adaptURL(me.config.api.read, params);
		} else if (me.url != '') {
			url = mdsAjax.adaptURL(me.url, params);
		} else {
			console.log('mdsAjax buildRequest error: URL undefined.');
		}

		//hack because can't clear out params for some reason
		if (url == "index.cfm?fuseaction=aclientPhotoViewer.getPhotos" && params.groupType == 'h') params.shootUID = '';
		if (url == "index.cfm?fuseaction=aclientPhotoViewer.getPhotos" && params.groupType != 'h') delete params.hotspotID;

		request = new Ext.data.Request({
			params: params,
			action: operation.action,
			records: operation.records,
			operation: operation,
			url: url,
			proxy: me
		});

		//request.url = app.getController('controller.bell').adaptURL(me.getUrl(request), params);

		request.params = {};

		operation.request = request;

		return request;
	}
});

Ext.data.JsonP.request = function(options){
	var me = this;

	if (Ext.Object.getSize(this.requests)){
		setTimeout(function(){
			me.request(options);
		}, 50);
		return;
	}

	options = Ext.apply({}, options);

	if (!options.url){
		Ext.Error.raise('A url must be specified for a JSONP request.');
	}

	var disableCaching = Ext.isDefined(options.disableCaching) ? options.disableCaching : me.disableCaching,
	cacheParam = options.disableCachingParam || me.disableCachingParam,
	id = ++me.requestCount,
	callbackName = options.callbackName || 'callback' + id,
	callbackKey = options.callbackKey || me.callbackKey,
	timeout = Ext.isDefined(options.timeout) ? options.timeout : me.timeout,
	params = options.params || {},
	url = options.url,
	name = Ext.name,
	request,
	script;

	// Add cachebuster param unless it has already been done.
	if (disableCaching && !params[cacheParam]){
		params[cacheParam] = new Date().getTime();
	} else{
		params = options.params;
	}

	//request.url += '?callback=' + callbackName;

	params[callbackKey] = name + '.data.JsonP.' + callbackName;
	
	script = me.createScript(url, params, options);

console.log('mdsAjax script url: ' + url);

	me.requests[id] = request = {
		url: url,
		params: params,
		script: script,
		id: id,
		scope: options.scope,
		success: options.success,
		failure: options.failure,
		callback: options.callback,
		callbackKey: callbackKey,
		callbackName: callbackName
	};

	if (timeout > 0){
		request.timeout = setTimeout(Ext.bind(me.handleTimeout, me, [request]), timeout);
	}

	me.setupErrorHandling(request);
	me[callbackName] = Ext.bind(me.handleResponse, me, [request], true);
	me.loadScript(request);

	return request;
};
