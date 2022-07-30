import { transporter } from '../config/mailer.js'
import { v4 as uuidv4 } from "uuid";


const email_password = async (req, res) => {
    const token = uuidv4();
    const email = req.body.email;
    const url = `http://localhost:3001/New-Password?${token}&email=${email}`
    console.log(email)
    await transporter.sendMail({
        from: ' <211125@ids.upchiapas.edu.mx>', // sender address
        to: email, // list of receivers
        subject: "Password Recovery", // Subject line
        html: `<!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
            <title>
        
            </title>
            <!--[if !mso]><!-- -->
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <!--<![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
                #outlook a {
                    padding: 0;
                }
        
                .ReadMsgBody {
                    width: 100%;
                }
        
                .ExternalClass {
                    width: 100%;
                }
        
                .ExternalClass * {
                    line-height: 100%;
                }
        
                body {
                    margin: 0;
                    padding: 0;
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
        
                table,
                td {
                    border-collapse: collapse;
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                }
        
                img {
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                    -ms-interpolation-mode: bicubic;
                }
        
                p {
                    display: block;
                    margin: 13px 0;
                }
            </style>
            <!--[if !mso]><!-->
            <style type="text/css">
                @media only screen and (max-width:480px) {
                    @-ms-viewport {
                        width: 320px;
                    }
                    @viewport {
                        width: 320px;
                    }
                }
            </style>
            <!--<![endif]-->
            <!--[if mso]>
                <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
            <!--[if lte mso 11]>
                <style type="text/css">
                  .outlook-group-fix { width:100% !important; }
                </style>
                <![endif]-->
        
        
            <style type="text/css">
                @media only screen and (min-width:480px) {
                    .mj-column-per-100 {
                        width: 100% !important;
                    }
                }
            </style>
        
        
            <style type="text/css">
            </style>
        
        </head>
        
        <body style="background-color:#f9f9f9;">
        
        
            <div style="background-color:#f9f9f9;">
        
        
               
            
              
               

        
                                    <div >
        
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">

                                        

        
     
                                            <tr>
                                                <td  style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:50px;word-break:break-word;">
        
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                        <tr>
                                                            <td href='${url}' align="center" bgcolor="#FF4742" role="presentation" style="border:none;border-radius:3px;color:#ffffff;cursor:auto;padding:15px 25px;" valign="middle">
                                                                <a href='${url}' style="background:#FF4742;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;">
                                                                Restablecer la contraseña
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
        
                                                </td>
                                            </tr>
        
                                            
        
                                        </table>
        
                                    </div>
        
                                  
        
        
            </div>
        
        </body>
        
        </html>`, // html body
    });
    return res.status(200).json({ succes: 'Correo enviado Con exito' });

}
export const emailController = { email_password };