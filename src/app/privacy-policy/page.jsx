import "@/stylesheets/privacy-policy.css";

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy container">
      <h1>Privacy Policy</h1>
      <p>Last Updated: October 9, 2024</p>

      <section>
        <h2>Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> When you send a message
            through our contact form, we may collect provided information such
            as your email address to respond to your request, if needed. We may
            also use any suggestions from your message to make improvements to
            our website.
          </li>
          <li>
            <strong>IP Address:</strong> We collect your IP address through
            Cloudflare HTTP request headers. This is used to locate nearby halal
            restaurants based on your general location.
          </li>
          <li>
            <strong>Geolocation Data:</strong> If you click the geolocation
            button on the interactive map, we use the Geolocation API to
            retrieve your current location, if you allow it, for the purpose of
            displaying halal restaurant options near you on the map. This is an
            optional feature of the map, and your location is not received if
            this feature is not used.
          </li>
          <li>
            <strong>Analytics Data:</strong> We track the pages you visit and
            your interactions with our website using tools like Google Analytics
            and Vercel Analytics to improve our website's content and user
            experience.
          </li>
        </ul>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <p>The data we collect is used for the following purposes:</p>
        <ul>
          <li>
            To provide and improve the services offered on WhoIsHalal.com.
          </li>
          <li>
            To locate and display nearby halal restaurants based on your IP
            address or geolocation.
          </li>
          <li>To respond to queries submitted through the contact form.</li>
          <li>
            To analyze user behavior and website traffic to enhance user
            experience.
          </li>
        </ul>
      </section>

      <section>
        <h2>Data Sharing and Third Parties</h2>
        <p>
          We do not share your personal information with third parties. Please
          refer to the following organizations' privacy policies regarding
          information that may be collected by them for using their services on
          our website:
        </p>
        <ul>
          <li>
            <strong>Google Analytics and Vercel Analytics:</strong> For
            analyzing website traffic and user behavior.
          </li>
          <li>
            <strong>Cloudflare:</strong> Your IP address is collected via HTTP
            request headers to locate nearby restaurants.
          </li>
        </ul>
        <p>We do not sell or rent your personal data to any third party.</p>
      </section>

      <section>
        <h2>Cookies and Tracking</h2>
        <p>
          <strong>WhoIsHalal.com</strong> does not use cookies. However, we use
          sessionStorage to temporarily store user preferences, such as search
          filters, locally in your browser. These are deleted when the browser
          tab is closed.
        </p>
      </section>

      <section>
        <h2>Data Retention</h2>
        <ul>
          <li>
            <strong>Contact Form Submissions:</strong> We retain emails and
            personal data submitted through the contact form for the duration
            necessary to address your query or request.
          </li>
          <li>
            <strong>Analytics Data:</strong> Data collected for analytics
            purposes is retained as specified by the third-party services we use
            (Google Analytics and Vercel Analytics).
          </li>
        </ul>
        <p>
          Users have the right to request the deletion of their data by
          contacting us via the contact form.
        </p>
      </section>

      <section>
        <h2>Data Security</h2>
        <p>
          We use <strong>SSL (Secure Sockets Layer)</strong> to encrypt and
          protect your data during transmission between your device and our
          servers. While we take security seriously, no method of transmission
          over the internet is entirely secure, and we cannot guarantee absolute
          protection of your information.
        </p>
      </section>

      <section>
        <h2>Your Rights</h2>
        <p>You have the following rights concerning your personal data:</p>
        <ul>
          <li>
            <strong>Access:</strong> You can request a copy of the personal data
            we hold about you.
          </li>
          <li>
            <strong>Correction:</strong> You can request corrections to any
            inaccuracies in your data.
          </li>
          <li>
            <strong>Deletion:</strong> You can request the deletion of personal
            data submitted through the contact form.
          </li>
        </ul>
        <p>
          To exercise any of these rights, please reach out to us via the
          contact form on the website.
        </p>
      </section>

      <section>
        <h2>Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with the updated effective date. We encourage
          you to review the policy periodically.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or
          your personal data, please contact us via the contact form available
          on the website.
        </p>
      </section>
    </div>
  );
}
