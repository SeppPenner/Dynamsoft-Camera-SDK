var dwsObject, imageViewer;

//Success callback function for dynamsoft.dwsEnv.init()
function onInitSuccess(videoViewerId, imageViewerId) {
    dwsObject = dynamsoft.dwsEnv.getObject(videoViewerId); //Get the Dynamsoft Webcam SDK object
    imageViewer = dwsObject.getImageViewer(imageViewerId); //Get a specific image viewer

    var cameraList = dwsObject.camera.getCameraList(); //Get a list of available cameras
    if (cameraList.length > 0) {
		//Call this method to take the ownership back, 
		//in case the first camera in the list is occupied by another Dynamsoft Webcam process.
        dwsObject.camera.takeCameraOwnership(cameraList[0]);
        dwsObject.camera.playVideo();
    } else {
        alert('No camera is connected.');
    }
}

//Failure callback function for dynamsoft.dwsEnv.init()
function onInitFailure(errorCode, errorString) {
    alert('Init failed: ' + errorString);
};

function onBtnGrabClick() {
    if (!dwsObject) return;

    dwsObject.camera.captureImage('image-container');

    if (dwsObject.getErrorCode() !== EnumDWS_ErrorCode.OK) {
        alert('Capture error: ' + dwsObject.getErrorString());
    }
};

//initiate Dynamsoft Webcam SDK object
dynamsoft.dwsEnv.init('video-container', 'image-container', onInitSuccess, onInitFailure); 

//destroy Dynamsoft Webcam SDK object when the page is closed
window.onbeforeunload = function() {
    if (dwsObject) dwsObject.destroy();
};
