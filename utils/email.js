const nodemailer=require("nodemailer");


/* new Email(user,url).sendWelcome(); */

module.exports=class Email{
    constructor(user,url){
        this.to=user.email;
        this.firstName=user.name.split(" ")[0];
        this.url=url;
        this.from=process.env.FROM_EMAIL;
        console.log('FROM EMAIL:', this.from);
    }
    newTransport(){
        if(process.env.NODE_ENV==="production"){
            return nodemailer.createTransport({
                service:"sendGrid",
                auth:{
                    user:process.env.SENDGRID_USERNAME,
                    pass:process.env.SENDGRID_PASSWORD
                }
            })
        }
         return nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
});
    }

   async send(template,subject){

const mailOptions={
    from:this.from,
    to:this.to,
    subject/* ,
    text: */
};

await this.newTransport().sendMail(mailOptions);

    }

    
    async   sendWelcome(){
         await  this.send("welcome","welcome there!!!!"); 
        }

        

        async sendPasswordReset(){
            await this.send("passwordReset","your password reset token");
        }
}



