import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import { Row, Col } from 'react-bootstrap';

const EmailScreen = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_uohmgzo',
        'template_xaoq4zj',
        form.current,
        'user_hcljxh71uJrDGiUh2u65I'
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <Row>
      <form ref={form} onSubmit={sendEmail}>
        <Col>
          <label>Name</label>
          <input type="text" name="user_name" />
        </Col>
        <Col>
          <label>Email</label>
          <input type="email" name="user_email" />
        </Col>
        <Col>
          <label>Message</label>
          <textarea name="message" />
        </Col>
        <Col>
          <input type="submit" value="Send" />
        </Col>
      </form>
    </Row>
  );
};

export default EmailScreen;
