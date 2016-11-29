// whether video container is visable
var isOnVideo = true;

document.getElementById("btn-grab").onclick = function(){
	if(!isOnVideo) return;
    if (!dwsObject) return;

	// pause the video
    dwsObject.camera.pauseVideo();
	document.getElementById("video-container").style.display="none";
	document.getElementById("image-container").style.display="block";

	// grab an image
    dwsObject.camera.captureImage('image-container');

    if (dwsObject.getErrorCode() !== EnumDWS_ErrorCode.OK) {
        alert('Capture error: ' + dwsObject.getErrorString());
    }
    
	isOnVideo = false;
	document.getElementById("btn-grab").style.backgroundColor="#aaa";
	document.getElementById("btn-switch").innerHTML = "Switch to Video Viewer";
};

document.getElementById("btn-switch").onclick = function(){
	if(document.getElementById("image-container").style.display == "none"){
		// pause the video
	    dwsObject.camera.pauseVideo();
		document.getElementById("video-container").style.display="none";
		document.getElementById("image-container").style.display="block";
		isOnVideo = false;
		document.getElementById("btn-grab").style.backgroundColor="#aaa";
		document.getElementById("btn-switch").innerHTML = "Switch to Video Viewer";
	}else{
		// continue the video
	    dwsObject.camera.playVideo();
		document.getElementById("image-container").style.display="none";
		document.getElementById("video-container").style.display="block";
		isOnVideo = true;
		document.getElementById("btn-grab").removeAttribute("style");
		document.getElementById("btn-switch").innerHTML = "Switch to Image Viewer";
	}
};

document.getElementById("image-container").style.display="none";

var dwsObject, imageViewer;

function onInitSuccess(videoViewerId, imageViewerId) {
    dwsObject = dynamsoft.dwsEnv.getObject(videoViewerId);
    imageViewer = dwsObject.getImageViewer(imageViewerId);    

    var cameraList = dwsObject.camera.getCameraList();
    if (cameraList.length > 0) {
        dwsObject.camera.takeCameraOwnership(cameraList[0]);
        dwsObject.camera.playVideo();
    } else {
        alert('No camera is connected.');
    }
}

function onInitFailure(errorCode, errorString) {
    alert('Init failed: ' + errorString);
};

dynamsoft.dwsEnv.init('video-container', 'image-container', onInitSuccess, onInitFailure);

window.onbeforeunload = function() {
    if (dwsObject) dwsObject.destroy();
};