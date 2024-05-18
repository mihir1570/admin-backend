const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const multer = require("multer")


require("./db/connection")
require("dotenv").config();
const inquiriesModel = require("./db/inquiries")
const getintouchModel = require("./db/getintouchs")
const cpartnersModel = require("./db/cpartners")
const contactModel = require("./db/contacts")
const teamModel = require("./db/joinourteams")
var nodemailer = require('nodemailer');
const PORT_NUMBER = process.env.PORT || 4500;


app.use(express.json())
app.use(cors())
app.use("/files", express.static("../../admin/frontend/src/components/resumepdf"));



// Email auth for emial
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mihirpatel6pg6090201@gmail.com',
        pass: process.env.ADMIN_EMAIL_KEY
    }
});

// PDF
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../../admin/frontend/src/components/resumepdf')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix + file.originalname)
    }
});

const upload = multer({ storage: storage })



//---------API's-------//


// -----------------------------Inquiries-----------------------------
app.post("/addInquiries", async (req, res) => {
    const datas = new inquiriesModel(req.body)
    const result = await datas.save()

    // Get inquiries email from the users
    var mailOptions = {
        from: req.body.email,
        to: 'mihirpatel6pg6090201@gmail.com',
        subject: `Inquiry From ${req.body.name}`,
        html:
            `
        
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Inquiry Received</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #ffffff; /* Change background color to white */
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
            }
            .card {
                border: 1px solid #ccc; /* Add border */
                border-radius: 10px;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1); /* Add shadow effect */
                background-color: #fff;
                padding: 20px;
                transition: box-shadow 0.3s ease-in-out; /* Add transition for smooth effect */
            }
            .card:hover {
                box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2); /* Add stronger shadow on hover */
            }
            .header {
                background-color: #007bff;
                padding: 20px;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                text-align: center;
                color: #fff;
                margin-bottom: 20px;
            }
            .details h2,
            .message h2 {
                font-size: 22px;
                margin-bottom: 10px;
            }
            .details p,
            .message p {
                margin-bottom: 10px;
                font-size: 16px;
                color: #555;
            }
            .footer {
                background-color: #007bff;
                padding: 20px;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
                text-align: center;
                color: #fff;
                margin-top: 20px;
            }
            .footer p {
                margin: 0;
                font-size: 14px;
                opacity: 0.8;
            }
            .footer p a {
                color: #fff;
                text-decoration: none;
                transition: opacity 0.3s;
            }
            .footer p a:hover {
                opacity: 0.6;
            }
            .email-link {
                color: inherit; /* Use default text color */
                text-decoration: none; /* Remove underline */
                cursor: pointer; /* Change cursor to pointer on hover */
            }
            .email-link:hover {
                text-decoration: underline; /* Underline on hover */
            }
        </style>
        </head>
        <body>
        
        <div class="container">
            <div class="card">
                <div class="header">
                    <h1>New Inquiry Received!</h1>
                </div>
                
                <div class="details">
                    <h2>Sender Details:</h2>
                    <p><strong>Name:</strong> ${req.body.name}</p>
                    <p><strong>Email:</strong> <span class="email-link" onclick="location.href='mailto:${req.body.email}'">${req.body.email}</span></p>
                    <p><strong>Phone Number:</strong> ${req.body.phone}</p>
                    <h2>Message:</h2>
                    <p>${req.body.interest}</p>
                </div>
                
                <div class="footer">
                    <p>© PVOT Designs. All rights reserved. <a href="#" target="_blank">Privacy Policy</a></p>
                </div>
            </div>
        </div>
        
        </body>
        </html>


        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    // Send Thanks Email to users for inquiry
    var mailOptions = {
        from: 'mihirpatel6pg6090201@gmail.com',
        to: req.body.email,
        subject: `Thank-you for inquiry ${req.body.name}`,
        html:
            `
       
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family: arial, 'helvetica neue', helvetica, sans-serif;">

            <head>
                <meta charset="UTF-8">
                <meta content="width=device-width, initial-scale=1" name="viewport">
                <meta name="x-apple-disable-message-reformatting">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta content="telephone=no" name="format-detection">
                <title></title>
                <!--[if (mso 16)]>
                <style type="text/css">
                a {text-decoration: none;}
                </style>
                <![endif]-->
                <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
                <!--[if gte mso 9]>
            <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG></o:AllowPNG>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
                <!--[if !mso]><!-- -->
                
                <!--<![endif]-->
            </head>


            <body style="width: 100%;font-family: arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;padding: 0;margin: 0;">
                <div dir="ltr" class="es-wrapper-color" style="background-color: #eff7f6;">
                    <!--[if gte mso 9]>
                        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                            <v:fill type="tile" color="#eff7f6"></v:fill>
                        </v:background>
                    <![endif]-->
                    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;padding: 0;margin: 0;width: 100%;height: 100%;background-image: ;background-repeat: repeat;background-position: center top;background-color: #eff7f6;">
                        <tbody>
                            <tr>
                                <td class="esd-email-paddings" valign="top" style="padding: 0;margin: 0;">
                                    <table class="es-content esd-header-popover" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;width: 100%;table-layout: fixed !important;">
                                        <tbody>
                                            <tr>
                                                <td class="esd-stripe" align="center" style="padding: 0;margin: 0;">
                                                    <table class="es-content-body" style="background-color: #ffffff;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                        <tbody>
                                                            <tr>
                                                                <td class="esd-structure" align="left" esd-custom-block-id="794034" style="padding: 0;margin: 0;">
                                                                    <table cellspacing="0" cellpadding="0" width="100%" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td class="es-m-p0r esd-container-frame" width="600" valign="top" align="center" style="padding: 0;margin: 0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td align="center" class="esd-block-banner" style="position: relative;padding: 0;margin: 0;" esdev-config="h3"><a target="_blank" style="-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;text-decoration: underline;color: #6a994e;font-size: 16px;"><img class="adapt-img esdev-stretch-width esdev-banner-rendered" src="https://demo.stripocdn.email/content/guids/bannerImgGuid/images/image17115585345368420.png" alt title width="600" style="display: block;border: 0;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;"></a></td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="esd-structure es-p30t es-p30b es-p20r es-p20l" align="left" esd-custom-block-id="794035" bgcolor="#6a994e" style="background-color: #6a994e;padding: 0;margin: 0;padding-left: 20px;padding-right: 20px;padding-top: 30px;padding-bottom: 30px;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td width="560" class="esd-container-frame" align="center" valign="top" style="padding: 0;margin: 0;">
                                                                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td align="center" class="esd-block-text es-p10 es-m-txt-c" style="padding: 10px;margin: 0;">
                                                                                                    <h3 style="color: #ffffff;margin: 0;line-height: 120%;mso-line-height-rule: exactly;font-family: Raleway, Arial, sans-serif;font-size: 24px;font-style: normal;font-weight: normal;">Hello,</h3>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="center" class="esd-block-text es-m-txt-c es-p20t" style="padding: 0;margin: 0;padding-top: 20px;">
                                                                                                    <p style="color: #ffffff;margin: 0;-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;font-family: tahoma, verdana, segoe, sans-serif;line-height: 150%;font-size: 16px;">Thank you for reaching out to us! We appreciate your interest in our services/products. We'll get back to you shortly.</p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table cellpadding="0" cellspacing="0" class="es-footer esd-footer-popover" align="center" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;width: 100%;background-color: transparent;background-image: ;background-repeat: repeat;background-position: center top;table-layout: fixed !important;">
                                        <tbody>
                                            <tr>
                                                <td class="esd-stripe" align="center" esd-custom-block-id="794054" style="padding: 0;margin: 0;">
                                                    <table bgcolor="#ffffff" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" width="600" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;background-color: #ffffff;">
                                                        <tbody>
                                                            <tr>
                                                                <td class="esd-structure" align="left" style="padding: 0;margin: 0;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td width="600" class="esd-container-frame" align="center" valign="top" style="padding: 0;margin: 0;">
                                                                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td align="center" class="esd-block-spacer es-p5t es-p5b" style="font-size: 0;padding: 0;margin: 0;padding-top: 5px;padding-bottom: 5px;">
                                                                                                    <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;">
                                                                                                        <tbody>
                                                                                                            <tr>
                                                                                                                <td style="border-bottom: 2px solid #eff7f6;background: unset;height: 1px;width: 100%;margin: 0px;padding: 0;"></td>
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="esd-structure es-p30t es-p30b es-p20r es-p20l" align="left" esd-custom-block-id="794032" style="padding: 0;margin: 0;padding-left: 20px;padding-right: 20px;padding-top: 30px;padding-bottom: 30px;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td width="560" align="left" class="esd-container-frame" style="padding: 0;margin: 0;">
                                                                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td align="center" class="esd-block-image es-p20b es-m-txt-c" style="font-size: 0px;padding: 0;margin: 0;padding-bottom: 20px;"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;text-decoration: underline;color: #6a994e;font-size: 12px;"><img src="https://tlr.stripocdn.email/content/guids/CABINET_128e4efa46af80b67022aaf8a3e25095/images/group_364.png" alt="Logo" style="display: block;border: 0;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" title="Logo" height="50"></a></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td class="esd-block-menu" esd-tmp-menu-color="#6a994e" style="padding: 0;margin: 0;">
                                                                                                    <table cellpadding="0" cellspacing="0" width="100%" class="es-menu" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;">
                                                                                                        <tbody>
                                                                                                            <tr class="links">
                                                                                                                <td align="center" valign="top" width="33.33%" class="es-p10t es-p10b es-p5r es-p5l" style="padding: 0;margin: 0;padding-left: 5px;padding-right: 5px;padding-top: 10px;padding-bottom: 10px;border: 0;"><a target="_blank" href="https://" style="color: #6a994e;-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;text-decoration: none;font-size: 12px;display: block;font-family: tahoma, verdana, segoe, sans-serif;">Who are you</a></td>
                                                                                                                <td align="center" valign="top" width="33.33%" class="es-p10t es-p10b es-p5r es-p5l" style="padding: 0;margin: 0;padding-left: 5px;padding-right: 5px;padding-top: 10px;padding-bottom: 10px;border: 0;"><a target="_blank" href="https://" style="color: #6a994e;-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;text-decoration: none;font-size: 12px;display: block;font-family: tahoma, verdana, segoe, sans-serif;">Who we serve</a></td>
                                                                                                                <td align="center" valign="top" width="33.33%" class="es-p10t es-p10b es-p5r es-p5l" style="padding: 0;margin: 0;padding-left: 5px;padding-right: 5px;padding-top: 10px;padding-bottom: 10px;border: 0;"><a target="_blank" href="https://" style="color: #6a994e;-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;text-decoration: none;font-size: 12px;display: block;font-family: tahoma, verdana, segoe, sans-serif;">Why SAP</a></td>
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="center" class="esd-block-social es-m-txt-c es-p20t es-p20b" style="font-size: 0;padding: 0;margin: 0;padding-top: 20px;padding-bottom: 20px;">
                                                                                                    <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0px;">
                                                                                                        <tbody>
                                                                                                            <tr>
                                                                                                                <td align="center" valign="top" esd-tmp-icon-type="facebook" class="es-p20r" style="padding: 0;margin: 0;padding-right: 20px;"><a target="_blank" href="" style="-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;text-decoration: underline;color: #6a994e;font-size: 12px;"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb" title="Facebook" height="24" style="display: block;border: 0;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;"></a></td>
                                                                                                                <td align="center" valign="top" esd-tmp-icon-type="twitter" class="es-p20r" style="padding: 0;margin: 0;padding-right: 20px;"><a target="_blank" href="" style="-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;text-decoration: underline;color: #6a994e;font-size: 12px;"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/logo-black/twitter-logo-black.png" alt="Tw" title="Twitter" height="24" style="display: block;border: 0;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;"></a></td>
                                                                                                                <td align="center" valign="top" esd-tmp-icon-type="youtube" class="es-p20r" style="padding: 0;margin: 0;padding-right: 20px;"><a target="_blank" href="" style="-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;text-decoration: underline;color: #6a994e;font-size: 12px;"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png" alt="Yt" title="Youtube" height="24" style="display: block;border: 0;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;"></a></td>
                                                                                                                <td align="center" valign="top" esd-tmp-icon-type="instagram" style="padding: 0;margin: 0;"><a target="_blank" href="" style="-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;text-decoration: underline;color: #6a994e;font-size: 12px;"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Ig" title="Instagram" height="24" style="display: block;border: 0;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;"></a></td>
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="center" class="esd-block-text" esd-links-underline="none" style="padding: 0;margin: 0;">
                                                                                                    <p style="font-size: 13px;margin: 0;-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;font-family: tahoma, verdana, segoe, sans-serif;line-height: 150%;color: #4d4d4d;"><a target="_blank" style="text-decoration: none;-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;color: #6a994e;font-size: 12px;"></a><a target="_blank" style="text-decoration: none;-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;color: #6a994e;font-size: 12px;" href="">Privacy Policy</a><a target="_blank" style="font-size: 13px;text-decoration: none;-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;color: #6a994e;"></a> • <a target="_blank" style="text-decoration: none;-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;color: #6a994e;font-size: 12px;">Unsubscribe</a></p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>


                  
                </div>
            </body>

            </html>

        `

        // attachments: [
        //     {
        //         filename: 'document.pdf',
        //         path: './db/attachments/REMS.pdf', // Update the path to your PDF file
        //         contentType: 'application/pdf' // Specify the content type
        //     },
        //     {
        //         filename: 'image.jpg',
        //         path: './db/attachments/PVOT_Designs_B.png', // Update the path to your image file
        //         contentType: 'image/jpeg' // Specify the content type
        //     }
        // ]



    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.send(result)
})
app.get("/showInquiries", async (req, res) => {
    const datas = await inquiriesModel.find().sort({ _id: -1 })
    res.send(datas)
})
app.delete("/deleteInquiries/:_id", async (req, res) => {
    const datas = await inquiriesModel.deleteOne({ _id: req.params._id })
    res.send(datas)
})
app.put("/changeStatus/:id", async (req, res) => {
    const id = req.params.id
    const result = await inquiriesModel.updateOne({ _id: id }, { $set: req.body })
    res.send(result)
})



// -----------------------------Get in touch-----------------------------
app.post("/addGetintouchs", async (req, res) => {
    const datas = new getintouchModel(req.body)
    const result = await datas.save()
    res.send(result)
})
app.get("/showGetintouchs", async (req, res) => {
    const datas = await getintouchModel.find().sort({ _id: -1 })
    res.send(datas)
})
app.delete("/deleteGetintouchs/:_id", async (req, res) => {
    const datas = await getintouchModel.deleteOne({ _id: req.params._id })
    res.send(datas)
})
app.put("/getintouchStatus/:id", async (req, res) => {
    const id = req.params.id
    const result = await getintouchModel.updateOne({ _id: id }, { $set: req.body })
    res.send(result)
})



// -----------------------------Join our team-----------------------------
app.post("/addTeam", upload.single("image"), async (req, res, next) => {
    console.log(req.body)
    const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date()
    const day = date.getDate()
    const month = monthName[date.getMonth()]
    const year = date.getFullYear()
    const status = "Pending Review"

    const data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        select: req.body.select,
        image: req.file.filename,
        comment: req.body.comment,
        day: day,
        month: month,
        year: year,
        status: status
    }
    try {
        const datas = new teamModel(data)
        const result = await datas.save()
        const ans = await result.json()
        if (ans) {
            res.send(ans)
        }
        else {
            res.send("same name")
        }
    } catch (error) {
        res.json({ status: error })
    }
})
app.get("/showTeam", async (req, res) => {
    const datas = await teamModel.find().sort({ _id: -1 })
    res.send(datas)
})
app.delete("/deleteTeam/:_id", async (req, res) => {
    const datas = await teamModel.deleteOne({ _id: req.params._id })
    res.send(datas)
})
app.put("/teamStatus/:id", async (req, res) => {
    const id = req.params.id
    const result = await teamModel.updateOne({ _id: id }, { $set: req.body })
    res.send(result)
})




// -----------------------------Channel Partner----------------------------
app.post("/addCpartners", async (req, res) => {
    const datas = new cpartnersModel(req.body)
    const result = await datas.save()
    res.send(result)
})
app.get("/showCpartners", async (req, res) => {
    const datas = await cpartnersModel.find().sort({ _id: -1 })
    res.send(datas)
})
app.delete("/deleteCpartners/:_id", async (req, res) => {
    const datas = await cpartnersModel.deleteOne({ _id: req.params._id })
    res.send(datas)
})
app.put("/cpartnersStatus/:id", async (req, res) => {
    const id = req.params.id
    const result = await cpartnersModel.updateOne({ _id: id }, { $set: req.body })
    res.send(result)
})



// -----------------------------Contact Us----------------------------
app.post("/addContacts", async (req, res) => {
    const datas = new contactModel(req.body)
    const result = await datas.save()
    res.send(result)
})
app.get("/showContacts", async (req, res) => {
    const datas = await contactModel.find().sort({ _id: -1 })
    res.send(datas)
})
app.delete("/deleteContacts/:_id", async (req, res) => {
    const datas = await contactModel.deleteOne({ _id: req.params._id })
    res.send(datas)
})
app.put("/contactsStatus/:id", async (req, res) => {
    const id = req.params.id
    const result = await contactModel.updateOne({ _id: id }, { $set: req.body })
    res.send(result)
})



app.listen(PORT_NUMBER, () => {
    console.log(`Server is running on port no ${PORT_NUMBER}`);
})

// app.listen(4500, () => {
//     console.log("Server is running on port no 4500");
// })
