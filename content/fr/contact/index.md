---
title: "Contact"
description: "Réservez votre prestation de magie par Email ou SMS."
showDate: false
showAuthor: false
showReadingTime: false
showTableOfContents: false
loadContactJS: true
---

<section class="edgar-section" style="margin: 0 auto;">

<p class="edgar-hero__eyebrow" style="justify-content: left; margin-bottom: 1rem;">
Contact Direct
</p>

<h1 class="edgar-section__title">Réserver Edgar</h1>

<p class="edgar-section__lead">
Choisissez votre mode de communication préféré pour un devis instantané.
</p>

<div class="edgar-contact-grid">

<div class="edgar-form-container">
<form class="edgar-form" id="contactForm">

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
<div class="edgar-form-group">
<label for="nom">Nom</label>
<input type="text" id="nom" placeholder="Votre nom" required />
</div>
<div class="edgar-form-group">
<label for="prenom">Prénom</label>
<input type="text" id="prenom" placeholder="Votre prénom" required />
</div>
</div>

<div class="edgar-form-group">
<label for="email">Email</label>
<input type="email" id="email" placeholder="votre@email.fr" required />
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
<div class="edgar-form-group">
<label for="date">Date</label>
<input type="date" id="date" required />
</div>
<div class="edgar-form-group">
<label for="heure">Heure</label>
<input type="time" id="heure" />
</div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
<div class="edgar-form-group">
<label for="participants">Nombre de participants</label>
<input type="number" id="participants" placeholder="Ex : 50" min="1" />
</div>
<div class="edgar-form-group">
<label for="lieu">Lieu</label>
<input type="text" id="lieu" placeholder="Ville ou code postal" />
</div>
</div>

<div class="edgar-form-group">
<label for="message">Votre projet</label>
<textarea id="message" placeholder="Décrivez votre événement (type, ambiance souhaitée…)" required></textarea>
</div>

<div class="edgar-hero__cta" style="margin-top: 1rem; justify-content: flex-start; gap: 10px;">
<button type="button" onclick="sendEmail()" class="btn-primary" style="cursor: pointer;">
✉ Envoyer par Email
</button>
<button type="button" onclick="sendSMS()" class="btn-secondary" style="cursor: pointer;">
📱 Envoyer par SMS
</button>
</div>

</form>
</div>

<div class="edgar-contact-info">

<h2 style="font-size: 1.8rem; margin-bottom: 1.5rem;">Informations</h2>

<p>
Basé à Villeneuve d'Ascq, je me déplace pour créer l'impossible lors de vos événements.
</p>

<div class="edgar-contact-item">
<span>📧</span>
<a href="mailto:edmagie52@gmail.com">edmagie52@gmail.com</a>
</div>

<div class="edgar-contact-item">
<span>📞</span>
<a href="tel:+33 7 66 72 65 78">07 66 72 65 78</span>
</div>

<div class="edgar-divider" style="margin: 2rem 0;"></div>

<p style="font-size: 0.9rem; color: var(--text-2); font-style: italic;">
« La magie est un pont entre le réel et l'imaginaire. »
</p>

</div>

</div>

</section>