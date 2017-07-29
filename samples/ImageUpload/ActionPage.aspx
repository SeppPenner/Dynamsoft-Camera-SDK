<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<%
    string strJson = "{\"success\":false}";
    try
    {
        HttpPostedFile file = Request.Files["RemoteFile"];

        string fileName = Request.Form["fileName"];
        if (string.IsNullOrEmpty(fileName)) fileName = file.FileName;
        string filePath = Server.MapPath(".") + "\\UploadedImages\\";
        
        if (File.Exists(filePath + fileName))
        {
            var iniNum = 0;
            if (fileName.Contains("(") && fileName.Contains(")"))
            {
                var leftPhPos = fileName.LastIndexOf("(");
                var rightPhPos = fileName.LastIndexOf(")");
                if (leftPhPos < rightPhPos) {
                    var numStr = fileName.Substring(leftPhPos + 1, rightPhPos - leftPhPos - 1);
                    if (int.TryParse(numStr, out iniNum))
                    {
                        fileName = fileName.Substring(0, leftPhPos) + fileName.Substring(rightPhPos + 1);
                    }
                    else { 
                        iniNum = 0;
                    }
                }
            }
            var indexPoint = fileName.LastIndexOf(".");
            var str1 = fileName.Substring(0, indexPoint) + "(";
            var str2 = ")" + fileName.Substring(indexPoint);
            for (var i = iniNum; ; ++i)
            {
                if (!File.Exists(filePath + (str1 + i + str2)))
                {
                    fileName = str1 + i + str2;
                    break;
                }
            }
        }

        string fileFullPath = filePath + fileName;

        if (!file.ContentType.Contains("text/plain"))
        {
            file.SaveAs(fileFullPath);
        }
        else
        {
            Stream fs = file.InputStream;
            byte[] base64Bytes = new byte[fs.Length];

            fs.Read(base64Bytes, 0, (int) fs.Length);
            StringBuilder base64Str = new StringBuilder();

            foreach (byte b in base64Bytes)
            {
                base64Str.Append((char) b);
            }

            File.WriteAllBytes(fileFullPath, Convert.FromBase64String(base64Str.ToString()));
        }

        strJson = "{\"success\":true, \"fileName\":\"" + fileName + "\"}";
    }
    catch (Exception ex)
    {
        strJson = "{\"success\":false, \"error\": \"" + ex.Message.Replace("\\", "\\\\") + "\"}";
    }

    Response.Clear();
    Response.ContentType = "application/json; charset=utf-8";
    Response.Write(strJson);
    Response.End();
%>
