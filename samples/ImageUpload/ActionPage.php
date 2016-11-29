<?php
	$strJson = "{\"success\":false}";
	try{

		$file = $_FILE["RemoteFile"];

		$fileName = $_POST["fileName"];
		if ($fileName == "" || $fileName == null) $fileName = $file["name"];
		$filePath = dirname(__FILE__) . "\\UploadedImages\\" . $fileName;

		if(trim($file["type"]) == "application/octet-stream"){
			move_uploaded_file($file , $filePath);
		}else{
		    $image_info = getimagesize($file['tmp_name']);
		    $base64_image_content = "data:{$image_info['mime']};base64," . chunk_split(base64_encode(file_get_contents(file['tmp_name'])));
		    if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64_image_content, $result)){
		        $type = $result[2];
		        file_put_contents($filePath, base64_decode(str_replace($result[1], '', $base64_image_content)));
		    }
		}

		$strJson = "{\"success\":true, \"fileName\":\"" . fileName . "\"}";

	}
	catch(Exception $ex){
		$strJson = "{\"success\":false, \"error\": \"" + ex.Message.Replace("\\", "\\\\") + "\"}";
	}	

    Response.Clear();
    header("Content-Type: application/json; charset=utf-8");
    echo $strJson;
?>
