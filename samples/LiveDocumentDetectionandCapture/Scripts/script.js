var dcsObject, imageViewer;

//Success callback function for dynamsoft.dcsEnv.init()
function onInitSuccess(videoViewerId, imageViewerId) {
    dcsObject = dynamsoft.dcsEnv.getObject(videoViewerId); //Get the Dynamsoft Camera SDK object
    imageViewer = dcsObject.getImageViewer(imageViewerId); //Get a specific image viewer
	dcsObject.videoviewer.setMode(dcsObject.videoviewer.EnumMode.Document);
    dcsObject.videoviewer.setAllowCaptureUndetectedDocument(true);

    var cameraList = dcsObject.camera.getCameraList(); //Get a list of available cameras
    if (cameraList.length > 0) {
		//Call this method to take the ownership back, 
        //in case the first camera in the list is occupied by another Dynamsoft Camera process.
        dcsObject.camera.takeCameraOwnership(cameraList[0]);
        dcsObject.camera.playVideo();
    } else {
        alert('No camera is connected.');
    }
	
	showLoadingLayer(false);
}

//Failure callback function for dynamsoft.dcsEnv.init()
function onInitFailure(errorCode, errorString) {
    alert('Init failed: ' + errorString);
	
	showLoadingLayer(false);
};

function onBtnGrabClick() {
    if (!dcsObject) return;

	dcsObject.camera.captureDocument('image-container')

    if (dcsObject.getErrorCode() !== EnumDCS_ErrorCode.OK) {
        alert('Capture error: ' + dcsObject.getErrorString());
    }
};

//show loading layer
showLoadingLayer(true);

//initiate Dynamsoft Camera SDK object
dynamsoft.dcsEnv.init('video-container', 'image-container', onInitSuccess, onInitFailure); 

//destroy Dynamsoft Camera SDK object when the page is closed
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