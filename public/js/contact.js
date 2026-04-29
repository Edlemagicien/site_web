/**
 * @file contact.js
 * @description Contact form validation and submission.
 */
function showError(el, msg) {
  el.style.borderColor = '#e53e3e';
  el.style.boxShadow = '0 0 0 2px rgba(229,62,62,0.25)';
  let container = el.closest('.edgar-form-group');
  if (!container) container = el.parentElement;
  let err = container.querySelector('.edgar-error-msg');
  if (!err) {
    err = document.createElement('span');
    err.className = 'edgar-error-msg';
    err.style.cssText = 'display:block;color:#e53e3e;font-size:0.78rem;margin-top:4px;';
    container.appendChild(err);
  }
  err.textContent = msg;
}

function clearError(el) {
  el.style.borderColor = '';
  el.style.boxShadow = '';
  let container = el.closest('.edgar-form-group');
  if (!container) container = el.parentElement;
  const err = container.querySelector('.edgar-error-msg');
  if (err) err.remove();
}

/* Validation  */
function validate() {
  const today = new Date().toISOString().split('T')[0];
  const rules = [
    { id: 'nom',     label: 'Nom',     required: true },
    { id: 'prenom',  label: 'Prénom',  required: true },
    { id: 'email',   label: 'Email',   required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMsg: 'Email invalide — ex : nom@domaine.fr' },
    { id: 'date',    label: 'Date',    required: true, future: true, futureMsg: 'La date doit être dans le futur' },
    { id: 'heure',   label: 'Heure',   required: true },
    { id: 'lieu',    label: 'Lieu',    required: true },
    { id: 'message', label: 'Votre projet', required: true, minLength: 20, minLengthMsg: 'Décrivez votre projet en au moins 20 caractères' }
  ];
  let valid = true;
  let firstInvalid = null;
  rules.forEach(function(r) {
    var el = document.getElementById(r.id);
    if (!el) return;
    clearError(el);
    var val = el.value.trim();
    if (r.required && !val) {
      showError(el, r.label + ' est requis');
      valid = false;
      if (!firstInvalid) firstInvalid = el;
    } else if (r.pattern && val && !r.pattern.test(val)) {
      showError(el, r.patternMsg);
      valid = false;
      if (!firstInvalid) firstInvalid = el;
    } else if (r.future && val && val < today) {
      showError(el, r.futureMsg);
      valid = false;
      if (!firstInvalid) firstInvalid = el;
    } else if (r.minLength && val && val.length < r.minLength) {
      showError(el, r.minLengthMsg);
      valid = false;
      if (!firstInvalid) firstInvalid = el;
    }
  });
  if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalid.focus();
  }
  return valid;
}

/* Construction du message*/

function getFormData() {
  function g(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  var lines = [
    'Bonjour Edgar,',
    '',
    'Demande de : ' + g('prenom') + ' ' + g('nom'),
    'Email : ' + g('email'),
    'Date : ' + g('date') + (g('heure') ? ' à ' + g('heure') : ''),
    'Lieu : ' + (g('lieu') || 'Non précisé'),
    'Invités : ' + (g('participants') || 'Non précisé'),
    '',
    'Projet : ' + g('message')
  ];
  return { subject: 'Magie : ' + g('prenom') + ' ' + g('nom'), body: lines.join('\n') };
}

/* Actions exposées globalement*/

window.sendEmail = function() {
  if (!validate()) return;
  var info = getFormData();
  var emailAddr = 'edgar@magicien.fr';
  window.location.href = 'mailto:' + emailAddr
    + '?subject=' + encodeURIComponent(info.subject)
    + '&body=' + encodeURIComponent(info.body);
};

window.sendSMS = function() {
  if (!validate()) return;
  var info = getFormData();
  var phoneNum = '+33600000000';
  window.location.href = 'sms:' + phoneNum + '?body=' + encodeURIComponent(info.body);
};

/* Nettoyage */

document.addEventListener('DOMContentLoaded', function() {
  ['nom', 'prenom', 'email', 'date', 'heure', 'message', 'lieu', 'participants'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() { clearError(el); });
      el.addEventListener('change', function() { clearError(el); });
    }
  });
});