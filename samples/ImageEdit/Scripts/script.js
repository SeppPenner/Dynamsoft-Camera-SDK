function onRotateLeft(){
    var index = imageViewer.image.getSelectedIndices()[0];
    imageViewer.image.rotateLeft(index);
};

function onRotateRight(){
    var index = imageViewer.image.getSelectedIndices()[0];
    imageViewer.image.rotateRight(index);
};

function onRotate180(){
    var index = imageViewer.image.getSelectedIndices()[0];
    imageViewer.image.rotateLeft(index);
    imageViewer.image.rotateLeft(index);
};

function onMirror(){
    var index = imageViewer.image.getSelectedIndices()[0];
    imageViewer.image.mirror(index);
};

function onFlip(){
    var index = imageViewer.image.getSelectedIndices()[0];
    imageViewer.image.flip(index);
};

function onChangeSize(){
	document.getElementById("changeSizeBar").style.display = 'block';
};

function onChangeSizeOk(){
	// change size
    var index = imageViewer.image.getSelectedIndices()[0];
    var info  = imageViewer.image.getImageInfo(index);
    var oriWidth = info.getWidth();
    var oriHeight = info.getHeight();

    // like xx% get xx
    var ptgWidth = document.getElementById("horizontal").value;
    var ptgHeight = document.getElementById("vertical").value;

    // the interpolation arithmetic
    var interpolationMethod;
    var EnumIM = imageViewer.image.EnumInterpolationMethod;
    var ipmSelector = document.getElementById("interpolationMethod");
    switch(ipmSelector.options[ipmSelector.selectedIndex].value){
        case 'NN':
            interpolationMethod = EnumIM.NEARESTNEIGHBOUR;
            break;
        case 'BL':
            interpolationMethod = EnumIM.BILINEAR;
            break;
        case 'BC':
            interpolationMethod = EnumIM.BICUBIC;
            break;
        default:
            return;
    }

    // aiming rect
    var aimWidth = oriWidth * ptgWidth / 100;
    var aimHeight = oriHeight * ptgHeight /100;

    imageViewer.image.changeSize(index, aimWidth, aimHeight, interpolationMethod);
    

	document.getElementById("changeSizeBar").style.display = 'none';
};

function onChangeSizeCancel(){
	document.getElementById("changeSizeBar").style.display = 'none';
};

function onCrop(){
    var ai = imageViewer.ui.getImageSelectedAreaInfo();
    if(!ai){
        alert("Crop: failed. Please first select the area you\'d like to crop.");
        return;
    }
    imageViewer.image.crop(ai.index, ai.left, ai.top, ai.right, ai.bottom);
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
	
	showLoadingLayer(false);
}

function onInitFailure(errorCode, errorString) {
    alert('Init failed: ' + errorString);
	
	showLoadingLayer(false);
};

function onBtnGrabClick() {
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