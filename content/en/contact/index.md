---
title: "Contact"
description: "Book your magic performance by Email or SMS."
showDate: false
showAuthor: false
showReadingTime: false
showTableOfContents: false
loadContactJS: true
---
<section class="edgar-section" style="margin: 0 auto;">
<p class="edgar-hero__eyebrow" style="justify-content: left; margin-bottom: 1rem;">
Direct Contact
</p>
<h1 class="edgar-section__title">Book Edgar</h1>
<p class="edgar-section__lead">
Choose your preferred way to get in touch for an instant quote.
</p>
<div class="edgar-contact-grid">
<div class="edgar-form-container">
<form class="edgar-form" id="contactForm">
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
<div class="edgar-form-group">
<label for="nom">Last name</label>
<input type="text" id="nom" placeholder="Your last name" required />
</div>
<div class="edgar-form-group">
<label for="prenom">First name</label>
<input type="text" id="prenom" placeholder="Your first name" required />
</div>
</div>
<div class="edgar-form-group">
<label for="email">Email</label>
<input type="email" id="email" placeholder="your@email.com" required />
</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
<div class="edgar-form-group">
<label for="date">Date</label>
<input type="date" id="date" required />
</div>
<div class="edgar-form-group">
<label for="heure">Time</label>
<input type="time" id="heure" />
</div>
</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
<div class="edgar-form-group">
<label for="participants">Number of guests</label>
<input type="number" id="participants" placeholder="E.g. 50" min="1" />
</div>
<div class="edgar-form-group">
<label for="lieu">Venue</label>
<input type="text" id="lieu" placeholder="City or postcode" />
</div>
</div>
<div class="edgar-form-group">
<label for="message">Your project</label>
<textarea id="message" placeholder="Describe your event (type, desired atmosphere…)" required></textarea>
</div>
<div class="edgar-hero__cta" style="margin-top: 1rem; justify-content: flex-start; gap: 10px;">
<button type="button" onclick="sendEmail()" class="btn-primary" style="cursor: pointer;">
✉ Send by Email
</button>
<button type="button" onclick="sendSMS()" class="btn-secondary" style="cursor: pointer;">
📱 Send by SMS
</button>
</div>
</form>
</div>
<div class="edgar-contact-info">
<h2 style="font-size: 1.8rem; margin-bottom: 1.5rem;">Information</h2>
<p>
Based in Villeneuve d'Ascq, I travel to create the impossible at your events.
</p>
<div class="edgar-contact-item">
<span>📧</span>
<a href="mailto:edmagie52@gmail.com">edmagie52@gmail.com</a>
</div>
<div class="edgar-contact-item">
<span>📞</span>
<a href="tel:+33766726578">07 66 72 65 78</a>
</div>
<div class="edgar-divider" style="margin: 2rem 0;"></div>
<p style="font-size: 0.9rem; color: var(--text-2); font-style: italic;">
« Magic is a bridge between reality and imagination. »
</p>
</div>
</div>
</section>