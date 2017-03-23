// whether video container is visable
var isOnVideo = true;

document.getElementById("btn-grab").onclick = function(){
	if(!isOnVideo) return;
    if (!dcsObject) return;

	// pause the video
    dcsObject.camera.pauseVideo();
	document.getElementById("video-container").style.display="none";
	document.getElementById("image-container").style.display="block";

	// grab an image
    dcsObject.camera.captureImage('image-container');

    if (dcsObject.getErrorCode() !== EnumDCS_ErrorCode.OK) {
        alert('Capture error: ' + dcsObject.getErrorString());
    }
    
	isOnVideo = false;
	document.getElementById("btn-grab").style.backgroundColor="#aaa";
	document.getElementById("btn-switch").innerHTML = "Switch to Video Viewer";
};

document.getElementById("btn-switch").onclick = function(){
	if(document.getElementById("image-container").style.display == "none"){
		// pause the video
	    dcsObject.camera.pauseVideo();
		document.getElementById("video-container").style.display="none";
		document.getElementById("image-container").style.display="block";
		isOnVideo = false;
		document.getElementById("btn-grab").style.backgroundColor="#aaa";
		document.getElementById("btn-switch").innerHTML = "Switch to Video Viewer";
	}else{
		// continue the video
	    dcsObject.camera.playVideo();
		document.getElementById("image-container").style.display="none";
		document.getElementById("video-container").style.display="block";
		isOnVideo = true;
		document.getElementById("btn-grab").removeAttribute("style");
		document.getElementById("btn-switch").innerHTML = "Switch to Image Viewer";
	}
};

document.getElementById("image-container").style.display="none";

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
	
	showLoadingLayer(false);
}

function onInitFailure(errorCode, errorString) {
    alert('Init failed: ' + errorString);
	
	showLoadingLayer(false);
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