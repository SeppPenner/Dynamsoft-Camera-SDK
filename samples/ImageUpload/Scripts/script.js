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
}

function onUploadSuccess() {
    var fileName,
        responseData = dynamsoft.lib.parse(imageViewer.io.getHTTPResponse());
		
    document.getElementById('btn-upload').innerHTML = 'Upload';
	
    if (responseData && responseData.success && responseData.fileName) {
        fileName = responseData.fileName;

        var a = document.createElement('a');
        var linkText = document.createTextNode(fileName);
        a.appendChild(linkText);
        a.title = fileName;
        a.href = getCurPagePath() + 'UploadedImages/' + fileName;
        a.target = '_blank';

        var divImgLinks = document.getElementById('image-links'),
            firstChild = divImgLinks.firstChild;

        divImgLinks.insertBefore(a, (typeof firstChild) === 'string' ? null : firstChild);
    }else if(responseData && responseData.error){
		alert(responseData.error);
	}
}

function onUploadFailure(errorCode, errorString) {
    document.getElementById('btn-upload').innerHTML = 'Upload';
    alert('Upload failed: ' + errorString);
}

function onBtnUploadClick() {
    if (!dwsObject || !imageViewer) return;

    if (imageViewer.image.getCount() === 0) {
        alert('Please grab an image first.');
        return;
    }

    var counter,
        url = getCurPagePath() + 'ActionPage.aspx',
        fileName = getFileName(),
        imageType = getCurEnumImageType(),
        bMultiImages = isImgTypeChksChecked(),
        imageIndexArray = [];

    if (bMultiImages) {
        for (counter = 0; counter < imageViewer.image.getCount() ; counter++) imageIndexArray.push(counter);
    } else imageIndexArray.push(imageViewer.image.getIndex());

    imageViewer.io.setHTTPFormFields({ "fileName": fileName });
    imageViewer.io.httpUploadAsync(url, imageIndexArray, imageType, onUploadSuccess, onUploadFailure);

    document.getElementById('btn-upload').innerHTML = 'Upload...';
}

function onBtnGrabClick() {
    if (!dwsObject) return;

    dwsObject.camera.captureImage('image-container');

    if (dwsObject.getErrorCode() !== EnumDWS_ErrorCode.OK) {
        alert('Capture error: ' + dwsObject.getErrorString());
    }
}

window.onload = function() {
    setCheckboxEnable();
    dynamsoft.dwsEnv.init('video-container', 'image-container', onInitSuccess, onInitFailure);
};

window.onbeforeunload = function() {
    if (dwsObject) dwsObject.destroy();
};

//*********ui & utilities*********
function setCheckboxEnable(radioValue) {
    var imgTypeChks = document.getElementsByName('multi');
    for (var i = 0; i < imgTypeChks.length; i++) {
        imgTypeChks[i].checked = false;
        imgTypeChks[i].disabled = radioValue !== imgTypeChks[i].value;
    }
}

function isImgTypeChksChecked() {
    var imgTypeChks = document.getElementsByName('multi');

    for (var i = 0; i < imgTypeChks.length; i++) {
        if (imgTypeChks[i].checked) return true;
    }

    return false;
}

function getSelectedImgType() {
    var imgTypeRadios = document.getElementsByName('img-format');

    for (var i = 0; i < imgTypeRadios.length; i ++) {
        if (imgTypeRadios[i].checked) return imgTypeRadios[i].value;
    }
}

function getCurEnumImageType() {
    var enumImageType = imageViewer.io.EnumImageType,
        checkedRadioValue = getSelectedImgType();

    switch (checkedRadioValue) {
        case 'BMP':
            return enumImageType.BMP;
        case 'JPEG':
            return enumImageType.JPEG;
        case 'TIFF':
            return enumImageType.TIFF;
        case 'PNG':
            return enumImageType.PNG;
        case 'PDF':
            return enumImageType.PDF;
        default:
            return enumImageType.PNG;
    }
}

function getFileName() {
    var fileName = document.getElementById('txtFileName').value.replace(/^\s+|\s+$/g, ''); // trim

    if (fileName === '') return '';

    var checkedRadioValue = getSelectedImgType();

    switch (checkedRadioValue) {
        case 'BMP':
            return fileName += '.bmp';
        case 'JPEG':
            return fileName += '.jpg';
        case 'TIFF':
            return fileName += '.tiff';
        case 'PNG':
            return fileName += '.png';
        case 'PDF':
            return fileName += '.pdf';
        default:
            return fileName += '.png';
    }
}

function getCurPagePath(){
	var strHttpServer = location.protocol + '//' +
			location.hostname + 
			(location.port === '' ? '' : ':' + location.port),
		curPathName = unescape(location.pathname),
		curPath = curPathName.substring(0, curPathName.lastIndexOf("/") + 1);
	
	return strHttpServer + curPath;
}