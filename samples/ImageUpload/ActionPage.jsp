<%@page import="java.io.BufferedOutputStream"%>
<%@page import="java.io.BufferedInputStream"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.io.FileOutputStream"%>
<%@page contentType="application/json; charset=utf-8" %>
<%@ Page Language="java" %>
<%
	String strJson = "{\"success\":false}";
	BufferedInputStream bis;
	BufferedOutputStream bos;
	try{
		Part filePart = request.getPart("RemoteFile");
		if (file != null)
		{
			String fileName = request.getParameter("fileName");
			if (fileName != null && !fileName.isEmpty()) fileName = filePart.getName(); 
			
			InputStream fis = filePart.getInputStream();
			bis = new BufferedInputStream(fis);
			
			FileOutputStream fos = new FileOutputStream(request.getSession().getServletContext().getRealPath("") + "\\UploadedImages\\" + fileName);
			bos = new BufferedOutputStream(fos);
			
			int b = -1;
			while(b = bis.read() != -1){
				bos.write(b);
			}
			
			strJson = "{\"success\":true, \"fileName\":\"" + fileName + "\"}";
		}
	}
	catch(Exception ex){
		strJson = "{\"success\":false, \"error\": \"" + ex.Message.Replace("\\", "\\\\") + "\"}";
	}
	final{
		if(bis != null){
			bis.close();
		}
		if(bos != null){
			bos.close();
		}
	}

    out.clear();
    out.write(strJson);
    out.close();
%>