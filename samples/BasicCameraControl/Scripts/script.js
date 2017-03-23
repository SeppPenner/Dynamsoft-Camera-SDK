// getElementsByName for ie6,7
function getElementsByName(name, tag) {  
	var returns = document.getElementsByName(name);  
	if(returns.length > 0) return returns;  
	returns = new Array();  
	var e = document.getElementsByTagName(tag ? tag : 'div');  
	for(i = 0; i < e.length; i++) {  
		if(e[i].getAttribute("name") == name) {  
			returns.push(e[i]);  
		}  
	}  
	return returns;  
};

var dcsObject, imageViewer;

function onInitSuccess(videoViewerId, imageViewerId) {
    dcsObject = dynamsoft.dcsEnv.getObject(videoViewerId);
    imageViewer = dcsObject.getImageViewer(imageViewerId);    

    var cameraList = dcsObject.camera.getCameraList();
    if (cameraList.length > 0) {
        dcsObject.camera.takeCameraOwnership(cameraList[0]);
        dcsObject.camera.playVideo();
    } else {
        alert('No camera is connected.');
    }

	var adders = getElementsByName("adder", 'a');//document.getElementsByName("adder");
	var values = getElementsByName("prop", 'input');//document.getElementsByName("prop");
	var cutters = getElementsByName("cutter", 'a');//document.getElementsByName("cutter");
	
	var camCtrl = {
		auto:true,
		exposure:{
			aim:dcsObject.camera.exposure
		},
		zoom:{
			aim:dcsObject.camera.zoom
		},
		brightness:{
			aim:dcsObject.camera.brightness
		},
		contrast:{
			aim:dcsObject.camera.contrast
		},
		sharpness:{
			aim:dcsObject.camera.sharpness
		},
		saturation:{
			aim:dcsObject.camera.saturation
		},
		init:function(){
			for(var i=0; i < arrProp.length; ++i){
				var prop = arrProp[i];
				prop.val = prop.aim.getCurrent();
				if(prop.val == null){
					// null means the property is not supported
					continue;
				}
				prop.min = prop.aim.getMin();
				prop.max = prop.aim.getMax();
				prop.def = prop.aim.getDefault();
			}
			// set min and max
			var mins = getElementsByName('min', 'span');//document.getElementsByName('min');
			var maxs = getElementsByName('max', 'span');//document.getElementsByName('max');
			for(var i = 0; i < values.length; ++i){
				var vbox = values[i];
				var prop = camCtrl[vbox.id];
				if(prop.val == null){
					// null means the property is not supported
					mins[i].innerHTML = null;
					maxs[i].innerHTML = null;
					continue;
				}
				mins[i].innerHTML = prop.min;
				maxs[i].innerHTML = prop.max;
			}
		},
		getValFromSer:function(){
			for(var i=0; i < arrProp.length; ++i){
				var prop = arrProp[i];
				if(prop.val != null){
					// null means the property is not supported
					prop.val = prop.aim.getCurrent();
				}
			}
		},
		beAuto:function(){
			camCtrl.auto = true;
			// set properties to be controlled automatically
			for(var i=0; i < arrProp.length; ++i){
				var prop = arrProp[i];
				if(prop.val != null && prop.aim.setIfAuto){
					// property is supported and auto is supported
					prop.aim.setIfAuto(true);
				}
			}
			// diable the related input boxes and buttons
			for(var i=0; i < values.length; ++i){
				values[i].value = "- -";
				values[i].setAttribute('disabled','disabled');
				adders[i].style.backgroundColor = "#eee";
				cutters[i].style.backgroundColor = "#eee";
			}
		},
		beManual:function(){
			camCtrl.auto = false;
			// set service manual
			for(var i=0; i < arrProp.length; ++i){
				var prop = arrProp[i];
				if(prop.val != null && prop.aim.setIfAuto){
					// property is supported and auto is supported
					prop.aim.setIfAuto(false);
				}
			}
			// get the current values of camera properties
			camCtrl.getValFromSer();
			for(var i = 0; i < values.length; ++i){
				var vbox = values[i];
				var prop = camCtrl[vbox.id];
				if(prop.val != null){
					// enable the related input boxes and buttons
					vbox.value = prop.val;
					vbox.removeAttribute("disabled");
					adders[i].style.backgroundColor = "white";
					cutters[i].style.backgroundColor = "white";
				}else{
					// diable the related input boxes and buttons
					vbox.value = "- -";
					vbox.setAttribute('disabled','disabled');
					adders[i].style.backgroundColor = "#eee";
					cutters[i].style.backgroundColor = "#eee";
				}
			}
		}
	};

	var arrProp = [
		camCtrl.exposure,
		camCtrl.zoom,
		camCtrl.brightness,
		camCtrl.contrast,
		camCtrl.sharpness,
		camCtrl.saturation
	];

	camCtrl.init();

	//"+" button event
	for(var i = 0; i < values.length; ++i){
		(function(){
			var index = i;
			adders[index].onclick = function(){
				var vbox = values[index];
				var prop = camCtrl[vbox.id];
				if(camCtrl.auto == true || prop.val == null)return;
				prop.val += Math.ceil((prop.max - prop.min)/10); 
				if(prop.val > prop.max){
					prop.val = prop.max;
				}
				// warning: doesn't check whether setCurrent succeeds or not
				prop.aim.setCurrent(prop.val);
				vbox.value = prop.val;
			};
		})();
	};

	//"-" button event
	for(var i = 0; i < values.length; ++i){
		(function(){
			var index = i;
			cutters[index].onclick = function(){
				var vbox = values[index];
				var prop = camCtrl[vbox.id];
				if(camCtrl.auto == true || prop.val == null)return;
				prop.val -= Math.ceil((prop.max - prop.min)/10); 
				if(prop.val < prop.min){
					prop.val = prop.min;
				}
				// warning: doesn't check whether setCurrent succeeds or not
				prop.aim.setCurrent(prop.val);
				vbox.value = prop.val;
			};
		})();
	};

	//set the value of property through property input
	var setValThrInput = function(sender){
		var prop = camCtrl[sender.id];
		prop.val = parseInt(sender.value);

		if(isNaN(prop.val)){
			prop.val = prop.def;
		}else if(prop.val < prop.min){
			prop.val = prop.min;
		}else if(prop.val > prop.max){
			prop.val = prop.max;
		}
		// warning: doesn't check whether setCurrent succeeds or not
		prop.aim.setCurrent(prop.val);
		sender.value = prop.val;
	};
	//set keyenter and blur event of property input
	for(var i = 0; i < values.length; ++i){
		values[i].onkeypress = function(event){
			if(event.which == 13){
				event.preventDefault;
				setValThrInput(this);
			}
		};
		values[i].onblur = function(){
			setValThrInput(this);
		};
	};

	//click isAuto checkBox
	document.getElementById("isAuto").onclick = function(){
		imgWait.show();
		// setTimeout: makes the wait-img.gif show in chrome
		var _this = this;
		setTimeout(function(){
			if(_this.checked == true){
				//set auto
				camCtrl.beAuto();
			}else{
				//set manual
				camCtrl.beManual();
			}
			imgWait.hide();
		}, 100);
	};

	// default auto
	document.getElementById("isAuto").checked = true;
	camCtrl.beAuto();
	
	showLoadingLayer(false);
}

function onInitFailure(errorCode, errorString) {
    alert('Init failed: ' + errorString);
	
	showLoadingLayer(false);
};

var imgWait = {
	show:function(){
		document.getElementById("imgWait").style.display = "block";
	},
	hide:function(){
		document.getElementById("imgWait").style.display = "none";
	}
};

document.getElementById('btn-grab').onclick = function () {
    if (!dcsObject) return;

    dcsObject.camera.captureImage('image-container');

    if (dcsObject.getErrorCode() !== EnumDCS_ErrorCode.OK) {
        alert('Capture error: ' + dcsObject.getErrorString());
    }
};

//show loading layer
showLoadingLayer(true);

dynamsoft.dcsEnv.init('video-container', 'image-container', onInitSuccess, onInitFailure);

window.onbeforeunload = function() {
    if (dcsObject) dcsObject.destroy();
};

//triggered when dcs service is not found
dynamsoft.dcsEnv.ondcsnotfound = function() {
    showLoadingLayer(false);
	return false;
};

//show or hide loading layer
function showLoadingLayer(bShow){
	var loaderContent = document.getElementById('loaderContent'),
		elLoadingLayer = document.getElementById('loadingLayer');

	loaderContent.style.display = bShow ? 'block' : 'none';
	elLoadingLayer.style.display = bShow ? 'block' : 'none';
}