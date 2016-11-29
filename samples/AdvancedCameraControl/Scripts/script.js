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

var dwsObject, imageViewer;

function onInitSuccess(videoViewerId, imageViewerId) {
    dwsObject = dynamsoft.dwsEnv.getObject(videoViewerId);
    imageViewer = dwsObject.getImageViewer(imageViewerId);    


	/*** camera select ***/ 
	var camList;

	var setCameraList = function(){
		camList = dwsObject.camera.getCameraList();
		document.getElementById("selectCamera").innerHTML = "";
		for(var i=0; i<camList.length; ++i){
			document.getElementById("selectCamera").options.add(new Option(camList[i], camList[i]));
		}
	};

    // get the latest camera list in the event onmouseover
	document.getElementById("selectCamera").onmouseover = function(){
		var curSelected = this.value;
		setCameraList();
		this.value = curSelected;
	};

	// select camera
	document.getElementById("selectCamera").onchange = function(){
		imgWait.show();
		// setTimeout: makes the wait-img.gif show in chrome
		setTimeout(function(){
			dwsObject.camera.selectCamera(document.getElementById("selectCamera").value);
			setResolutionList();
			dwsObject.camera.playVideo();
			camCtrl.init();
			camCtrl.auto ? camCtrl.beAuto() : camCtrl.beManual();
			imgWait.hide();
		}, 100);
	};

	/*** camera select end ***/ 

	/*** resolution select ***/ 
	var resList;

	var setResolutionList = function(){
		resList = dwsObject.camera.resolution.getAllowedValues();
		document.getElementById("selectResolution").innerHTML = "";
		for(var i=0; i<resList.length; ++i){
			document.getElementById("selectResolution").options.add(new Option(""+resList[i].width+' x '+resList[i].height, i));
		}
		var curRes = dwsObject.camera.resolution.getCurrent();
		var curResIndex = -1;
		for(var i=0; i<resList.length; ++i){
			if(resList[i].width == curRes.width && resList[i].height == curRes.height){
				curResIndex = i;
			}
		}
		document.getElementById("selectResolution").value = curResIndex;
	};

	document.getElementById("selectResolution").onchange = function(){
		dwsObject.camera.resolution.setCurrent(resList[document.getElementById("selectResolution").value]);
	};

	/*** resolution select end ***/ 

	// init camera
	setCameraList();
    if (camList.length > 0) {
    	document.getElementById("selectCamera").value = camList[0];
        dwsObject.camera.takeCameraOwnership(camList[0]);
        dwsObject.camera.playVideo(); 
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
			aim:dwsObject.camera.brightness
		},
		contrast:{
			aim:dwsObject.camera.contrast
		},
		saturation:{
			aim:dwsObject.camera.saturation
		},
		sharpness:{
			aim:dwsObject.camera.sharpness
		},
		gamma:{
			aim:dwsObject.camera.gamma
		},
		gain:{
			aim:dwsObject.camera.gain
		},
		whiteBalanceTemperature:{
			aim:dwsObject.camera.whiteBalanceTemperature
		},
		backlightCompensation:{
			aim:dwsObject.camera.backlightCompensation
		},
		//camera settings
		pan:{
			aim:dwsObject.camera.pan
		},
		tilt:{
			aim:dwsObject.camera.tilt
		},
		roll:{
			aim:dwsObject.camera.roll
		},
		zoom:{
			aim:dwsObject.camera.zoom
		},
		exposure:{
			aim:dwsObject.camera.exposure
		},
		iris:{
			aim:dwsObject.camera.iris
		},
		focus:{
			aim:dwsObject.camera.focus
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

	// onInitSuccess finishes
	imgWait.hide();
}

function onInitFailure(errorCode, errorString) {
    alert('Init failed: ' + errorString);
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
    if (!dwsObject) return;

    dwsObject.camera.captureImage('image-container');

    if (dwsObject.getErrorCode() !== EnumDWS_ErrorCode.OK) {
        alert('Capture error: ' + dwsObject.getErrorString());
    }
};

imgWait.show();
dynamsoft.dwsEnv.init('video-container', 'image-container', onInitSuccess, onInitFailure);

window.onbeforeunload = function () {
    if (dwsObject) dwsObject.destroy();
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
