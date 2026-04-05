"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";
import { useSiteData } from "@/lib/SiteDataContext";
import { buildSnsLinks } from "@/lib/site-data";

const STYLE = `
  .mb-contact {
    background: var(--mb-accent);
    padding: clamp(4rem, 10vw, 8rem) clamp(2rem, 6vw, 5rem);
    position: relative;
    overflow: hidden;
    border-top: 1px solid var(--mb-border);
  }
  .mb-contact-bg-text {
    position: absolute;
    bottom: -0.1em;
    right: -0.05em;
    font-family: 'Arial Black', 'Arial', sans-serif;
    font-weight: 900;
    font-size: clamp(10rem, 28vw, 22rem);
    letter-spacing: -0.05em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.08);
    line-height: 0.8;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  }
  .mb-contact-heading {
    font-family: 'Arial Black', 'Arial', sans-serif;
    font-weight: 900;
    font-size: clamp(3.5rem, 11vw, 10rem);
    letter-spacing: -0.04em;
    text-transform: uppercase;
    color: #FFFFFF;
    line-height: 0.85;
    position: relative;
    z-index: 1;
  }
  .mb-contact-sub {
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.75);
    position: relative;
    z-index: 1;
    margin-top: 1.5rem;
  }
  .mb-email-link {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    font-family: 'Courier New', monospace;
    font-size: clamp(0.85rem, 2.5vw, 1.2rem);
    letter-spacing: 0.05em;
    color: #FFFFFF;
    text-decoration: none;
    border-bottom: 2px solid rgba(255,255,255,0.4);
    padding-bottom: 2px;
    transition: border-color 0.2s, color 0.2s;
    position: relative;
    z-index: 1;
    margin-top: 2.5rem;
  }
  .mb-email-link:hover {
    border-color: #FFFFFF;
    color: #FFFFFF;
  }
  .mb-social-row {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
    margin-top: 2rem;
  }
  .mb-social-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.25rem;
    border: 2px solid rgba(255,255,255,0.5);
    color: rgba(255,255,255,0.85);
    font-family: 'Courier New', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.2s ease;
    background: transparent;
    cursor: pointer;
  }
  .mb-social-btn:hover {
    border-color: #FFFFFF;
    color: #FFFFFF;
    background: rgba(255,255,255,0.1);
  }
  .mb-divider {
    width: 60px;
    height: 3px;
    background: rgba(255,255,255,0.5);
    margin-top: 2rem;
    position: relative;
    z-index: 1;
  }
`;

const socialLinks = [
  { label: "X / Twitter", href: "https://x.com/", Icon: ExternalLink },
  { label: "Instagram", href: "https://instagram.com/", Icon: ExternalLink },
  { label: "note", href: "https://note.com/", Icon: ExternalLink },
  { label: "Pixiv", href: "https://pixiv.net/", Icon: ExternalLink },
];

export function ContactSection() {
  const data = useSiteData();
  const email = data?.email || "hello@example.com";
  const artistName = data?.artistName || "BOLD";

  return (
    <section id="contact">
      <style>{STYLE}</style>

      <div className="mb-contact">
        {/* Ghost background text */}
        <div className="mb-contact-bg-text" aria-hidden>GET IN TOUCH</div>

        <div className="relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-contact-sub">Contact — お問い合わせ</p>
            <h2 className="mb-contact-heading">
              GET<br />IN<br />TOUCH
            </h2>
          </motion.div>

          <motion.div
            className="mb-divider"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          <motion.p
            className="mb-contact-sub"
            style={{ marginTop: "1.5rem" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            仕事の依頼・コラボ・展示企画など、お気軽にどうぞ。
          </motion.p>

          {/* Email */}
          <motion.a
            href={`mailto:${email}`}
            className="mb-email-link"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Mail size={20} />
            {email}
          </motion.a>

          {/* Social links */}
          <motion.div
            className="mb-social-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-social-btn"
              >
                <link.Icon size={14} />
                {link.label}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
