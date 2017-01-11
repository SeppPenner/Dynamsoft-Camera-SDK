var dcsObject, imageViewer;

//Success callback function for dynamsoft.dcsEnv.init()
function onInitSuccess(videoViewerId, imageViewerId) {
    dcsObject = dynamsoft.dcsEnv.getObject(videoViewerId); //Get the Dynamsoft Camera SDK object
    imageViewer = dcsObject.getImageViewer(imageViewerId); //Get a specific image viewer

    var cameraList = dcsObject.camera.getCameraList(); //Get a list of available cameras
    if (cameraList.length > 0) {
		//Call this method to take the ownership back, 
        //in case the first camera in the list is occupied by another Dynamsoft Camera process.
        dcsObject.camera.takeCameraOwnership(cameraList[0]);
        dcsObject.camera.playVideo();
    } else {
        alert('No camera is connected.');
    }
}

//Failure callback function for dynamsoft.dcsEnv.init()
function onInitFailure(errorCode, errorString) {
    alert('Init failed: ' + errorString);
};

function onBtnGrabClick() {
    if (!dcsObject) return;

    dcsObject.camera.captureImage('image-container');

    if (dcsObject.getErrorCode() !== EnumDCS_ErrorCode.OK) {
        alert('Capture error: ' + dcsObject.getErrorString());
    }
};

//initiate Dynamsoft Camera SDK object
dynamsoft.dcsEnv.init('video-container', 'image-container', onInitSuccess, onInitFailure); 

//destroy Dynamsoft Camera SDK object when the page is closed
window.onbeforeunload = function() {
    if (dcsObject) dcsObject.destroy();
};
