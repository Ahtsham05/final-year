import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async function(to,subject,message){
   try {
    const {data,error} = await resend.emails.send({
      from: 'Blinkeyit <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: message,
    });
    if(error){
      console.error(error);
    }
    return data;
   } catch (error) {
    console.log("Error sending mail" + error.message)
   }
}

export {sendMail}