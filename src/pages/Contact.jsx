import { useState } from 'react';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Sales', message: '' });
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', subject: 'Sales', message: '' });
  };

  return (
    <section className="page page--contact">
      <div className="container">
        <header className="page-header page-header--centered">
          <div>
            <h1>Contact Us</h1>
            <p className="page-subtitle">
              Have questions about OrderPro? Our team is here to help you get the most out of your order management.
            </p>
          </div>
        </header>

        <div className="contact-grid">
          <div className="contact-info card">
            <div className="info-item">
              <span className="info-icon blue">📧</span>
              <div>
                <h4>Email</h4>
                <p>support@orderpro.io</p>
                <p className="muted-sm">Response within 24 hours</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon green">📞</span>
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 012-8470</p>
                <p className="muted-sm">Mon - Fri · 9am - 6pm ET</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon purple">📍</span>
              <div>
                <h4>Office</h4>
                <p>100 Market St, Suite 400</p>
                <p className="muted-sm">San Francisco, CA 94105</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon orange">💬</span>
              <div>
                <h4>Live Chat</h4>
                <p>Available 24/7 in the app</p>
                <p className="muted-sm">Average wait: under 2 min</p>
              </div>
            </div>
          </div>

          <form className="contact-form card" onSubmit={onSubmit}>
            <h2>Send us a message</h2>
            <div className="form-grid">
              <label className="field">
                <span>Name</span>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={onChange}
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={onChange}
                />
              </label>
              <label className="field field--full">
                <span>Subject</span>
                <select name="subject" value={form.subject} onChange={onChange}>
                  <option>Sales</option>
                  <option>Support</option>
                  <option>Billing</option>
                  <option>Partnerships</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="field field--full">
                <span>Message</span>
                <textarea
                  name="message"
                  rows="6"
                  required
                  placeholder="How can we help?"
                  value={form.message}
                  onChange={onChange}
                ></textarea>
              </label>
            </div>
            <div className="form-footer">
              {sent && <span className="form-success">✅ Thanks! We'll get back to you shortly.</span>}
              <button type="submit" className="btn btn-primary btn-lg">
                Send Message
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
