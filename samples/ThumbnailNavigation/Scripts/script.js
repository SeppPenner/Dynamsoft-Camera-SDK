function onBtnGrabClick(){
    document.getElementById("black-bar").style.display="block";
    document.getElementById("btn-grab").style.display="none";
	// pause the video
    dwsObject.camera.pauseVideo();
};

function onBtnShowVideoClick(){
    // continue the video
    dwsObject.camera.playVideo();
    document.getElementById("big-image-container").style.display="none";
    document.getElementById("video-container").style.display="block";
    document.getElementById("btn-showVideo").style.display="none";
    document.getElementById("btn-grab").style.display="inline";
};

function okClick(){
    document.getElementById("black-bar").style.display="none";
    document.getElementById("btn-grab").style.display="inline";
	// grab an image
    if (!dwsObject) return;

    dwsObject.camera.captureImage('image-container');

    if (dwsObject.getErrorCode() !== EnumDWS_ErrorCode.OK) {
        alert('Capture error: ' + dwsObject.getErrorString());
    }
	// continue the video
    dwsObject.camera.playVideo();
};
function cancelClick(){
    document.getElementById("black-bar").style.display="none";
    document.getElementById("btn-grab").style.display="inline";
	// continue the video
    dwsObject.camera.playVideo();
};

var dwsObject, imageViewer;

function onInitSuccess(videoViewerId, imageViewerId) {
    dwsObject = dynamsoft.dwsEnv.getObject(videoViewerId);
    imageViewer = dwsObject.getImageViewer(imageViewerId); 
    imageViewer.ui.setImageViewMode(1, 3);
    imageViewer.ui.setMouseShape(true); // set as hand
    bigImageViewer = dwsObject.addImageViewer("big-image-container");   
    bigImageViewer.image.setCapacity(1);

    var cameraList = dwsObject.camera.getCameraList();
    if (cameraList.length > 0) {
        dwsObject.camera.takeCameraOwnership(cameraList[0]);
        dwsObject.camera.playVideo();
    } else {
        alert('No camera is connected.');
    }

    imageViewer.ui.onmouseclick = function(index){
        bigImageViewer.image.remove([0]);
        imageViewer.image.copyToImageViewer(index, bigImageViewer);
        // pause the video
        dwsObject.camera.pauseVideo();
        document.getElementById("video-container").style.display="none";
        document.getElementById("big-image-container").style.display="block";
        document.getElementById("btn-grab").style.display="none";
        document.getElementById("btn-showVideo").style.display="inline";
    };

}

function onInitFailure(errorCode, errorString) {
    alert('Init failed: ' + errorString);
};

dynamsoft.dwsEnv.init('video-container', 'image-container', onInitSuccess, onInitFailure);

window.onbeforeunload = function() {
    if (dwsObject) dwsObject.destroy();
};
