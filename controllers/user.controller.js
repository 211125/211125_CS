import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { getUser } from '../models/user.model.js'
import { transporter } from '../config/mailer.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const data = dotenv.config({
    path: path.resolve(__dirname, `../environments/.env.${process.env.NODE_ENV}`)
})


const user_create = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    getUser.create({
        name,
        email,
        password,
    },
        { fields: ['name', 'email', 'password'] })
        .then(users => {
            res.send(users)

            const emailconfirm = async (res) => {
                const token = jwt.sign({
                    to: email,
                }, 'secret', { expiresIn: '30m' }, data.parsed.JWT_TOKEN_SECRET, { algorithm: 'HS256' })
                const url = `http://localhost:3001/Confirmation?${token}&email=${email}`
                await transporter.sendMail({
                    from: ' <211125@ids.upchiapas.edu.mx>', // sender address
                    to: email, // list of receivers
                    subject: "Confirmation ", // Subject line
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
                    
                    
                           
                        
                          
                           
            
                    
                                                <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
                    
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">
            
                                                    
            
                    
                 
                                                        <tr>
                                                            <td style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:50px;word-break:break-word;">
                    
                                                                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                                    <tr>
                                                                        <td href='${url}' align="center" bgcolor="#FF4742" role="presentation" style="border:none;border-radius:3px;color:#ffffff;cursor:auto;padding:15px 25px;" valign="middle">
                                                                            <a href='${url}' style="background:#FF4742;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;">
                                                                            Confirmation Acount
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
                    
                    </html>`

                })

            }
            emailconfirm();

        })
        .catch(err => {
            res.status(400).send(err)
        });
};



const confirmation = async (req, res) => {
    const email = req.body.email;
    const confi = req.body.valor;
    if (confi === 'false') {
        console.log('confirmations failed')
        getUser
            .destroy({ where: { email: email } })
            .then((r) => {
                res.status(200).json({ message: "Deleted successfully" });
            })
            .catch((err) => {
                res.status(400).send(err);
            });

    }

    if (confi === 'true') {
        getUser.findOne({ where: { email: email } })
            .then(users => {
                users.update({ validat: (confi) })
                res.status(200).json({ message: 'Usuario Confirmado' })
            })
            .catch((err) => {
                res.status(400).json({ err: 'Usuario Confirmado Error' })
            });

    }

}


const user_validat = async function (req, res) {
    getUser
        .findAll()
        .then((r) => {
            //res.send(r);
            r.status(200).json(r.name)
        })
        .catch((err) => {
            res.status(400).send(err);
        });
};








const user_update = (req, res) => {
    const email = req.body.email
    getUser.findOne({ where: { email: email } })
        .then(users => {
            users.update({ password: bcryptjs.hashSync(req.body.password, 10) })
            res.status(200).json({ err: 'contraseña Actualizada' })
        })
        .catch((err) => {
            res.status(400).json({ err: 'contraseña No Actualizado' })
        });
};




const user_login = async (req, res) => {
    const user = await getUser.findOne({ where: { email: req.body.email } });
    if (user) {
        const validPassword = bcryptjs.compareSync(req.body.password, user.password);
        if (user.validat === true) {
            if (validPassword) {
                const token = jwt.sign({
                    sub: user.name,
                    id: user.id,
                }, 'secret', { expiresIn: '30m' }, data.parsed.JWT_TOKEN_SECRET, { algorithm: 'HS256' })
                user.token = token;

                res.header('auth-token', token).json({
                    error: null,
                    data: { token, user: user.id, name: user.name, validate: user.validate }
                });

            }
            else {
                return res.status(400).json({ error: 'contraseña no válida' })
            }
        } else {
            return res.status(400).json({ error: "Usuario no verificado" });
        }
    }
    else {
        return res.status(400).json({ error: 'Usuario no encontrado' });
    }


};







export const userController = { user_create, user_login, user_update, confirmation, user_validat };