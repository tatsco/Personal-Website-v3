import React, { useRef, useState } from 'react';
import portrait from './assets/portrait.png';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function App() {
  const contactRef = useRef(null)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [sending, setSending] = useState(false)

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const onSubmit = async (e) => {
    // Allow native form POST to Netlify, but add quick validation first
    const form = e.target
    const name = form.from_name.value.trim()
    const email = form.reply_to.value.trim()
    const message = form.message.value.trim()
    const website = form.website.value // honeypot

    if (website) { // bot filled
      e.preventDefault()
      return
    }

    if (!name || !validateEmail(email) || !message) {
      e.preventDefault()
      setStatus({ type: 'error', message: 'Please fill all fields with a valid email.' })
      return
    }

    setSending(true)
  }

  return (
    <>
      <header className="container">
        <div className="hero">
          <img
            src={portrait}
            alt="Tatiana Scott portrait illustration"
            className="portrait card"
            loading="eager"
          />
          <div className="card">
            <h1 className="title">Tatiana Scott</h1>
            <p className="blurb">
              Software Engineer in NYC, building code and connections. Not currently looking for work, but always happy to chat.
            </p>
            <button className="cta" onClick={scrollToContact}>Contact Me</button>
          </div>
        </div>
      </header>

      <main className="container" ref={contactRef}>
        <section className="card">
          <h2 className="section-title">Contact</h2>
          <p className="helper">I usually respond within a few days.</p>

          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="website"
            className="form"
            action="/success.html"
            onSubmit={onSubmit}
          >
            {/* Netlify needs this field to associate the form */}
            <input type="hidden" name="form-name" value="contact" />

            <label>
              Name
              <input name="from_name" className="input" type="text" autoComplete="name" required />
            </label>
            <label>
              Email
              <input name="reply_to" className="input" type="email" autoComplete="email" required />
            </label>
            <label>
              Message
              <textarea name="message" className="textarea" required></textarea>
            </label>

            {/* Honeypot field for bots */}
            <input type="text" name="website" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} />

            <button className="cta" type="submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send'}
            </button>
          </form>

          {status.message && <p className="helper" role={status.type === 'error' ? 'alert' : 'status'}>{status.message}</p>}
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Tatiana Scott
      </footer>
    </>
  )
}
