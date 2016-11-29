<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<%
    string strJson = "{\"success\":false}";
    try
    {
        HttpPostedFile file = Request.Files["RemoteFile"];

        string fileName = Request.Form["fileName"];
        if (string.IsNullOrEmpty(fileName)) fileName = file.FileName;
        string filePath = Server.MapPath(".") + "\\UploadedImages\\" + fileName;

        if (file.ContentType.Trim().Equals("application/octet-stream"))
        {
            file.SaveAs(filePath);
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

            File.WriteAllBytes(filePath, Convert.FromBase64String(base64Str.ToString()));
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
