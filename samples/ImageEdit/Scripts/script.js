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

function onBtnGrabClick() {
    if (!dwsObject) return;

    dwsObject.camera.captureImage('image-container');

    if (dwsObject.getErrorCode() !== EnumDWS_ErrorCode.OK) {
        alert('Capture error: ' + dwsObject.getErrorString());
    }
};

dynamsoft.dwsEnv.init('video-container', 'image-container', onInitSuccess, onInitFailure);

window.onbeforeunload = function() {
    if (dwsObject) dwsObject.destroy();
};