function onBtnGrabClick(){
    document.getElementById("black-bar").style.display="block";
    document.getElementById("btn-grab").style.display="none";
	// pause the video
    dcsObject.camera.pauseVideo();
};

function onBtnShowVideoClick(){
    // continue the video
    dcsObject.camera.playVideo();
    document.getElementById("big-image-container").style.display="none";
    document.getElementById("video-container").style.display="block";
    document.getElementById("btn-showVideo").style.display="none";
    document.getElementById("btn-grab").style.display="inline";
};

function okClick(){
    document.getElementById("black-bar").style.display="none";
    document.getElementById("btn-grab").style.display="inline";
	// grab an image
    if (!dcsObject) return;

    dcsObject.camera.captureImage('image-container');

    if (dcsObject.getErrorCode() !== EnumDCS_ErrorCode.OK) {
        alert('Capture error: ' + dcsObject.getErrorString());
    }
	// continue the video
    dcsObject.camera.playVideo();
};
function cancelClick(){
    document.getElementById("black-bar").style.display="none";
    document.getElementById("btn-grab").style.display="inline";
	// continue the video
    dcsObject.camera.playVideo();
};

var dcsObject, imageViewer;

function onInitSuccess(videoViewerId, imageViewerId) {
    dcsObject = dynamsoft.dcsEnv.getObject(videoViewerId);
    imageViewer = dcsObject.getImageViewer(imageViewerId); 
    imageViewer.ui.setImageViewMode(1, 3);
    imageViewer.ui.setMouseShape(true); // set as hand
    bigImageViewer = dcsObject.addImageViewer("big-image-container");   
    bigImageViewer.image.setCapacity(1);

    var cameraList = dcsObject.camera.getCameraList();
    if (cameraList.length > 0) {
        dcsObject.camera.takeCameraOwnership(cameraList[0]);
        dcsObject.camera.playVideo();
    } else {
        alert('No camera is connected.');
    }

    imageViewer.ui.onmouseclick = function(index){
        bigImageViewer.image.remove([0]);
        imageViewer.image.copyToImageViewer(index, bigImageViewer);
        // pause the video
        dcsObject.camera.pauseVideo();
        document.getElementById("video-container").style.display="none";
        document.getElementById("big-image-container").style.display="block";
        document.getElementById("btn-grab").style.display="none";
        document.getElementById("btn-showVideo").style.display="inline";
    };
	
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
