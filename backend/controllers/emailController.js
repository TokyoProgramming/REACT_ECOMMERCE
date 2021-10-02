import nodemailer from 'nodemailer';

const sendEmailCtr = async (toEmail, subject = '', text = '') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yoshiokayusukexxxxx@gmail.com',
      pass: 'yusuke7828',
    },
  });

  const options = {
    from: 'yoshiokayusukexxxxx@gmail.com',
    to: toEmail,
    subject: subject,
    text: text,
  };

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info.response);
    }
  });
};

export { sendEmailCtr };
