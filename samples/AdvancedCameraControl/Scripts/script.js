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


	/*** camera select ***/ 
	var camList;

	var setCameraList = function(){
		camList = dcsObject.camera.getCameraList();
		document.getElementById("selectCamera").innerHTML = "";
		for(var i=0; i<camList.length; ++i){
			document.getElementById("selectCamera").options.add(new Option(camList[i], camList[i]));
		}
	};

    var sourceSelectDom = document.getElementById("selectCamera");

    // get the latest camera list in the event onmouseover
    // if firefox, use event click
    var isFireFox = navigator.userAgent.indexOf("Firefox") > 0;
    if(isFireFox){
    	sourceSelectDom.onclick = function(){
			var curSelected = this.value;
			setCameraList();
			this.value = curSelected;
		};
    }else{
    	sourceSelectDom.onmouseover = function(){
			var curSelected = this.value;
			setCameraList();
			this.value = curSelected;
		};
    }

	// select camera
	sourceSelectDom.onchange = function(){
		imgWait.show();
		// setTimeout: makes the wait-img.gif show in chrome
		setTimeout(function(){
			dcsObject.camera.selectCamera(document.getElementById("selectCamera").value);
			setResolutionList();
			dcsObject.camera.playVideo();
			camCtrl.init();
			camCtrl.auto ? camCtrl.beAuto() : camCtrl.beManual();
			imgWait.hide();
		}, 100);
	};

	/*** camera select end ***/ 

	/*** resolution select ***/ 
	var resList;

	var setResolutionList = function(){
		resList = dcsObject.camera.resolution.getAllowedValues();
		document.getElementById("selectResolution").innerHTML = "";
		for(var i=0; i<resList.length; ++i){
			document.getElementById("selectResolution").options.add(new Option(""+resList[i].width+' x '+resList[i].height, i));
		}
		var curRes = dcsObject.camera.resolution.getCurrent();
		var curResIndex = -1;
		for(var i=0; i<resList.length; ++i){
			if(resList[i].width == curRes.width && resList[i].height == curRes.height){
				curResIndex = i;
			}
		}
		document.getElementById("selectResolution").value = curResIndex;
	};

	document.getElementById("selectResolution").onchange = function(){
		dcsObject.camera.resolution.setCurrent(resList[document.getElementById("selectResolution").value]);
	};

	/*** resolution select end ***/ 

	// init camera
	setCameraList();
    if (camList.length > 0) {
    	document.getElementById("selectCamera").value = camList[0];
        dcsObject.camera.takeCameraOwnership(camList[0]);
        dcsObject.camera.playVideo(); 
    } else {
        alert('No camera is connected.');
    }
    setResolutionList();

	var adders = getElementsByName("adder", 'a');//document.getElementsByName("adder");
	var values = getElementsByName("prop", 'input');//document.getElementsByName("prop");
	var cutters = getElementsByName("cutter", 'a');//document.getElementsByName("cutter");

	var camCtrl = {
		auto:true,
		//video settings
		brightness:{
			aim:dcsObject.camera.brightness
		},
		contrast:{
			aim:dcsObject.camera.contrast
		},
		saturation:{
			aim:dcsObject.camera.saturation
		},
		sharpness:{
			aim:dcsObject.camera.sharpness
		},
		gamma:{
			aim:dcsObject.camera.gamma
		},
		gain:{
			aim:dcsObject.camera.gain
		},
		whiteBalanceTemperature:{
			aim:dcsObject.camera.whiteBalanceTemperature
		},
		backlightCompensation:{
			aim:dcsObject.camera.backlightCompensation
		},
		//camera settings
		pan:{
			aim:dcsObject.camera.pan
		},
		tilt:{
			aim:dcsObject.camera.tilt
		},
		roll:{
			aim:dcsObject.camera.roll
		},
		zoom:{
			aim:dcsObject.camera.zoom
		},
		exposure:{
			aim:dcsObject.camera.exposure
		},
		iris:{
			aim:dcsObject.camera.iris
		},
		focus:{
			aim:dcsObject.camera.focus
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
			// set properties to be controlled manually
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
		camCtrl.brightness,
		camCtrl.contrast,
		camCtrl.saturation,
		camCtrl.sharpness,
		camCtrl.gamma,
		camCtrl.gain,
		camCtrl.whiteBalanceTemperature,
		camCtrl.backlightCompensation,
		camCtrl.pan,
		camCtrl.tilt,
		camCtrl.roll,
		camCtrl.zoom,
		camCtrl.exposure,
		camCtrl.iris,
		camCtrl.focus
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
	var onAutoChange = function(){
		imgWait.show();
		// setTimeout: makes the wait-img.gif show in chrome
		var _this = this;
		setTimeout(function(){
			if(_this.checked == true){
				//set auto
				document.getElementById("videoAuto").checked = true;
				document.getElementById("cameraAuto").checked = true;
				camCtrl.beAuto();
			}else{
				//set manual
				document.getElementById("videoAuto").checked = false;
				document.getElementById("cameraAuto").checked = false;
				camCtrl.beManual();
			}
			imgWait.hide();
		}, 100);
	};
	document.getElementById("videoAuto").onclick = onAutoChange;
	document.getElementById("cameraAuto").onclick = onAutoChange;

	// default auto
	document.getElementById("videoAuto").checked = true;
	document.getElementById("cameraAuto").checked = true;
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

window.onbeforeunload = function () {
    if (dcsObject) dcsObject.destroy();
};

//button show hide
var btnShows = getElementsByName("btn-show", 'a');//document.getElementsByName("btn-show");
for(var i = 0; i < btnShows.length; ++i){
	(function(){
		var btn = btnShows[i];
		btn.parentNode.onclick = function(e){
			var aim = document.getElementById(btn.getAttribute("for"));
			if(btn.innerHTML == "▼"){
				for(var j=0; j<btnShows.length; ++j){
					btnShows[j].innerHTML = "▼";
					//document.getElementsByName("setting-container")[j].style.display="none";
					getElementsByName("setting-container", 'div')[j].style.display="none";
				}
				btn.innerHTML = "▲";
				aim.style.display="block";
			}else{
				btn.innerHTML = "▼";
				aim.style.display="none";
			}
		};
	})();
}

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
	
	var sltCamera = document.getElementById('selectCamera'),
		sltRes = document.getElementById('selectResolution');
		
	sltCamera.disabled = bShow;
	sltRes.disabled = bShow;
}