import React from 'react'
import { Accordion, Card, Container } from 'react-bootstrap'

const TermsAndCondition = () => {
  return (
    <div>
        <Container className="mt-5">
      <div className="" id="">
        <div className="accordion-item">
          <h2 className="accordion-header text-center" id="headingOne">
              Terms & Conditions
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#termsAndConditionsAccordion"
          >
            <div className="accordion-body">
              <h3>Product Price</h3>
              <p>INR 10000/- + 18% (GST)</p>

              <h3>TERMS & CONDITIONS</h3>
              <h4>Purpose</h4>
              <p>
              <a href="https://lara.co.in" target="_blank" rel="noopener noreferrer">
                  https://lara.co.in
                </a> is intended only to serve as a preliminary medium of Training and Placement for its
                users / members who have a bona fide intention to contact and/or be contacted for the purposes related
                to their career enhancement.
              </p>

              <h4>Online Training Provider</h4>
              <p>
                Online Training provided by Lara Technology which is established in 2005. We will use our reasonable
                endeavors to provide the Online Training. We will provide the Training with lots of care and skills
                which are very much required to the industry. We provide technical delivery with the videos and test to
                evaluate in the same video. We share the toppers contact data to the recruiters to get hired.
              </p>

              <h4>Account</h4>
              <p>
                You need an account for most activities on our platform. Keep your password safe, because you’re
                responsible for all activity associated with your account. If you suspect someone else is using your
                account, let us know by contacting our Supporting Team.
              </p>
              <p>
                You need an account for most activities on our platform, including to purchase and enroll in a course.
                When setting up and maintaining your account, you must provide and continue to provide accurate and
                complete information, including a valid email address. You have complete responsibility for your
                account and everything that happens on your account, including for any harm or damage (to us or anyone
                else) caused by someone using your account without your permission. This means you need to be careful
                with your password. You may not transfer your account to someone else or use someone else’s account
                without their permission. If you contact us to request access to an account, we will not grant you such
                access unless you can provide us the login credential information for that account.
              </p>

              <h4>Course Enrolment and 1 Year Access</h4>
              <p>
                When you enroll in a course you will get access to view that course at any time anywhere on{' '}
                <a href="https://lara.co.in" target="_blank" rel="noopener noreferrer">
                  https://lara.co.in
                </a>{' '}
                only. You will not have an access to download that course because we grant you a 1 year access.
              </p>
              <p>
                We generally give 1 year access to our students when they enroll in a course. However, we have the
                rights to disable the access at any point in time in the event due to legal or privacy reasons.
              </p>

              <h4>Purchasing and Confirmation</h4>
              <p>
                Lara works on third party payment processing partners to offer you the most convenient payment methods
                and to keep your payment information secure.
              </p>
              <p>
                In order to purchase an Online Course, you must provide the required information and pay the amount
                specified. You must ensure that all information provided is complete and accurate.
              </p>
              <p>For confirmation of your purchase we will send you a mail regarding your purchased course details.</p>
              <p>
                Whenever you use our web site, or any other web site, the computer on which the web pages are stored
                (the Web server) needs to know the network address of your computer so that it can send the requested
                web pages to your Internet browser. The unique network address of your computer is called its “IP
                address,” and is sent automatically each time you access any Internet site. From a computer’s IP
                address, it is possible to determine the general geographic location of that computer but otherwise it
                is anonymous.
              </p>

              <h4>Security</h4>
              <p>
                When purchasing from https://lara.co.in, your financial details are passed through a secure server
                using the latest 128-bit SSL (secure sockets layer) encryption technology. 128-bit SSL encryption is the
                current industry standard.
              </p>

              <h4>Privacy Policy</h4>
              <p>
                https://lara.co.in is committed to safeguarding your personal details privacy. We will use our best
                efforts to ensure that the information you submit to us remains private. If required we will share your
                contact to only recruiters to get hire you.
              </p>

              <h4>Your Rights:</h4>
              <p>You can access and update your personal information that Lara collects and maintains as follows:</p>
              <ul>
                <li>
                  <strong>To Access:</strong> To access your account information, you need to take care of safeguarding
                  your login credentials to log in at any time anywhere.
                </li>
                <li>
                  <strong>To Update:</strong> To update information you provide directly, log into your account and
                  update your account anytime anywhere.
                </li>
              </ul>

              <h4>Lara Rights:</h4>
              <p>
                https://lara.co.in reserves rights to revise or to modify this privacy policy. In such an event, we will
                post a prominent notice on the application prior to the change becoming effective. https://lara.co.in
                reserves rights to delete or terminate your account if we find any misuse of our application which
                causes harm to us or others.
              </p>

              <h4>Lara Support:</h4>
              <p>
                For any issues regarding your account or anything, let us know by contacting our Supporting Team.
                Reachable at{' '}
                <a href="mailto:support@lara.co.in">support@lara.co.in</a> or +91 9972006654.
              </p>

              <h4>Cancellation and Refund Policy</h4>
              <p>
                Before taking admission, you should go through the demo sessions. If you really want, then you can make
                a trial period of 2 calendar days to access our application. Once you take admission by paying the fee,
                then your admission can’t be canceled, and the fee will not be refundable or transferable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
    </div>
  )
}

export default TermsAndCondition
