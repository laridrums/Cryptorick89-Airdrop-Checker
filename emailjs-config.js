// emailjs-config.js
// Configuration EmailJS pour les notifications de suggestions d'airdrops

import emailjs from '@emailjs/browser';

// ============================================
// CONFIGURATION
// Remplacer avec vos vraies valeurs depuis EmailJS Dashboard
// ============================================

const EMAILJS_SERVICE_ID = 'service_xxxxxxx';  // Votre Service ID
const EMAILJS_TEMPLATE_ID = 'template_xxxxxxx'; // Votre Template ID
const EMAILJS_PUBLIC_KEY = 'xxxxxxxxxxxxx';     // Votre Public Key (User ID)

// Initialiser EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// ============================================
// FONCTIONS D'ENVOI D'EMAIL
// ============================================

/**
 * Envoyer une notification de suggestion d'airdrop
 * @param {Object} suggestionData - Données de la suggestion
 * @returns {Promise} Résultat de l'envoi
 */
export async function sendSuggestionNotification(suggestionData) {
  try {
    const templateParams = {
      project_name: suggestionData.projectName,
      description: suggestionData.description,
      official_link: suggestionData.officialLink,
      user_email: suggestionData.email || 'Non fourni',
      criteria_notes: suggestionData.criteria || 'Non spécifié',
      submission_date: new Date().toLocaleString('fr-FR'),
      to_email: 'votre-email@example.com' // Votre email pour recevoir les notifications
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Email envoyé avec succès:', response);
    return { success: true, response };

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error };
  }
}

/**
 * Envoyer un email de confirmation à l'utilisateur (optionnel)
 * @param {string} userEmail - Email de l'utilisateur
 * @param {string} projectName - Nom du projet suggéré
 */
export async function sendUserConfirmation(userEmail, projectName) {
  if (!userEmail) return;

  try {
    const templateParams = {
      user_email: userEmail,
      project_name: projectName,
      confirmation_date: new Date().toLocaleString('fr-FR')
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      'template_confirmation', // Template séparé pour confirmation utilisateur
      templateParams
    );

    console.log('✅ Email de confirmation envoyé:', response);
    return { success: true, response };

  } catch (error) {
    console.error('❌ Erreur confirmation:', error);
    return { success: false, error };
  }
}

// ============================================
// INTÉGRATION AVEC REACT
// ============================================

/**
 * Exemple d'utilisation dans un composant React
 */
/*
import { sendSuggestionNotification } from './emailjs-config';

function SuggestModal({ onClose }) {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    officialLink: '',
    email: '',
    criteria: ''
  });

  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // 1. Sauvegarder dans Supabase
      const supabaseResult = await submitSuggestion(formData);
      
      if (supabaseResult) {
        // 2. Envoyer notification email
        const emailResult = await sendSuggestionNotification(formData);
        
        if (emailResult.success) {
          alert('✅ Merci ! Votre suggestion a été envoyée.');
          onClose();
        } else {
          alert('⚠️ Suggestion enregistrée mais erreur d\'envoi email.');
        }
      } else {
        alert('❌ Erreur lors de l\'enregistrement.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Une erreur est survenue.');
    } finally {
      setSending(false);
    }
  };

  return (
    // ... JSX du formulaire
  );
}
*/

// ============================================
// TEMPLATES EMAILJS RECOMMANDÉS
// ============================================

/*
=== TEMPLATE 1: Notification Admin ===
Nom du template: airdrop_suggestion_notification

Sujet: 
🆕 Nouvelle suggestion d'airdrop: {{project_name}}

Corps:
Bonjour,

Une nouvelle suggestion d'airdrop vient d'être soumise:

📌 Projet: {{project_name}}
📝 Description: {{description}}
🔗 Lien officiel: {{official_link}}
📧 Email utilisateur: {{user_email}}
🎯 Critères suggérés: {{criteria_notes}}
📅 Date de soumission: {{submission_date}}

Vérifiez la suggestion dans votre dashboard Supabase.

---
Airdrop Checker App
cryptoric89.skr


=== TEMPLATE 2: Confirmation Utilisateur (optionnel) ===
Nom du template: airdrop_suggestion_confirmation

Sujet:
✅ Votre suggestion d'airdrop a été reçue

Corps:
Bonjour,

Merci d'avoir suggéré l'airdrop "{{project_name}}" !

Votre suggestion a bien été enregistrée le {{confirmation_date}}.

Nous allons l'examiner et l'ajouter à notre liste si elle est validée.

Cordialement,
L'équipe Airdrop Checker

---
cryptoric89.skr
*/

// ============================================
// CONFIGURATION EMAILJS ÉTAPE PAR ÉTAPE
// ============================================

/*
ÉTAPE 1: Créer un compte EmailJS
- Aller sur https://www.emailjs.com/
- S'inscrire (gratuit: 200 emails/mois)
- Confirmer l'email

ÉTAPE 2: Ajouter un service email
- Dashboard → Email Services → Add New Service
- Choisir votre provider (Gmail, Outlook, etc.)
- Suivre les instructions pour connecter votre email
- Noter le SERVICE_ID

ÉTAPE 3: Créer un template
- Dashboard → Email Templates → Create New Template
- Utiliser les templates ci-dessus comme base
- Variables disponibles: {{variable_name}}
- Tester le template
- Noter le TEMPLATE_ID

ÉTAPE 4: Obtenir la Public Key
- Dashboard → Account → General
- Copier votre Public Key (User ID)

ÉTAPE 5: Configurer dans le code
- Remplacer les valeurs dans ce fichier
- Ou utiliser des variables d'environnement:

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
*/

// ============================================
// GESTION DES ERREURS COMMUNES
// ============================================

/**
 * Gérer les erreurs EmailJS
 */
export function handleEmailError(error) {
  if (error.status === 400) {
    return 'Configuration EmailJS invalide. Vérifiez vos clés.';
  } else if (error.status === 402) {
    return 'Limite d\'emails atteinte. Vérifiez votre plan EmailJS.';
  } else if (error.status === 403) {
    return 'Accès refusé. Vérifiez votre Public Key.';
  } else if (error.status === 404) {
    return 'Service ou template introuvable.';
  } else if (error.text) {
    return `Erreur: ${error.text}`;
  } else {
    return 'Erreur réseau. Vérifiez votre connexion.';
  }
}

// ============================================
// VALIDATION DES DONNÉES
// ============================================

/**
 * Valider les données avant envoi
 */
export function validateSuggestionData(data) {
  const errors = [];

  if (!data.projectName || data.projectName.trim().length < 2) {
    errors.push('Le nom du projet doit contenir au moins 2 caractères');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('La description doit contenir au moins 10 caractères');
  }

  if (!data.officialLink || !isValidUrl(data.officialLink)) {
    errors.push('Le lien officiel doit être une URL valide');
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push('L\'email n\'est pas valide');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valider une URL
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Valider un email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================
// RATE LIMITING (Protection anti-spam)
// ============================================

const emailRateLimit = {
  lastSent: 0,
  minInterval: 60000 // 1 minute entre chaque email
};

/**
 * Vérifier si on peut envoyer un email (anti-spam)
 */
export function canSendEmail() {
  const now = Date.now();
  const timeSinceLastEmail = now - emailRateLimit.lastSent;
  
  if (timeSinceLastEmail < emailRateLimit.minInterval) {
    const waitTime = Math.ceil((emailRateLimit.minInterval - timeSinceLastEmail) / 1000);
    return {
      allowed: false,
      message: `Veuillez attendre ${waitTime} secondes avant d'envoyer une nouvelle suggestion.`
    };
  }

  emailRateLimit.lastSent = now;
  return { allowed: true };
}

// ============================================
// STATISTIQUES (optionnel)
// ============================================

let emailStats = {
  sent: 0,
  failed: 0,
  lastError: null
};

export function getEmailStats() {
  return emailStats;
}

export function trackEmailSent(success, error = null) {
  if (success) {
    emailStats.sent++;
  } else {
    emailStats.failed++;
    emailStats.lastError = error;
  }
}

// Export de la configuration pour référence
export const emailConfig = {
  SERVICE_ID: EMAILJS_SERVICE_ID,
  TEMPLATE_ID: EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: EMAILJS_PUBLIC_KEY,
  isConfigured: () => {
    return EMAILJS_SERVICE_ID !== 'service_xxxxxxx' 
      && EMAILJS_TEMPLATE_ID !== 'template_xxxxxxx'
      && EMAILJS_PUBLIC_KEY !== 'xxxxxxxxxxxxx';
  }
};

// Vérifier la configuration au chargement
if (!emailConfig.isConfigured()) {
  console.warn('⚠️ EmailJS n\'est pas configuré. Les notifications ne fonctionneront pas.');
}
