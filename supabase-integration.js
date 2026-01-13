// supabase-integration.js
// Intégration complète Supabase pour l'application Airdrop Checker

import { createClient } from '@supabase/supabase-js'

// Configuration Supabase - REMPLACER avec vos vraies valeurs
const SUPABASE_URL = https://gbraoqvyhrchkngmqbkk.supabase.co
const SUPABASE_ANON_KEY = sb_publishable_q3NBOPu98GJuZ2Hs-wsnew_nZRAk6qH

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ============================================
// FONCTIONS POUR LES AIRDROPS
// ============================================

/**
 * Récupérer tous les airdrops actifs
 */
export async function getActiveAirdrops() {
  const { data, error } = await supabase
    .from('airdrops')
    .select('*')
    .in('status', ['active', 'upcoming'])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching airdrops:', error)
    return []
  }

  return data
}

/**
 * Récupérer tous les airdrops (incluant terminés)
 */
export async function getAllAirdrops() {
  const { data, error } = await supabase
    .from('airdrops')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all airdrops:', error)
    return []
  }

  return data
}

/**
 * Récupérer un airdrop spécifique par ID
 */
export async function getAirdropById(id) {
  const { data, error } = await supabase
    .from('airdrops')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching airdrop:', error)
    return null
  }

  return data
}

/**
 * Ajouter un nouvel airdrop (pour admin)
 */
export async function addAirdrop(airdropData) {
  const { data, error } = await supabase
    .from('airdrops')
    .insert([airdropData])
    .select()

  if (error) {
    console.error('Error adding airdrop:', error)
    return null
  }

  return data[0]
}

/**
 * Mettre à jour un airdrop (pour admin)
 */
export async function updateAirdrop(id, updates) {
  const { data, error } = await supabase
    .from('airdrops')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating airdrop:', error)
    return null
  }

  return data[0]
}

/**
 * Supprimer un airdrop (pour admin)
 */
export async function deleteAirdrop(id) {
  const { error } = await supabase
    .from('airdrops')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting airdrop:', error)
    return false
  }

  return true
}

// ============================================
// FONCTIONS POUR LES SUGGESTIONS
// ============================================

/**
 * Soumettre une suggestion d'airdrop
 */
export async function submitSuggestion(suggestionData) {
  const { data, error } = await supabase
    .from('airdrop_suggestions')
    .insert([{
      project_name: suggestionData.projectName,
      description: suggestionData.description,
      official_link: suggestionData.officialLink,
      user_email: suggestionData.email,
      criteria_notes: suggestionData.criteria
    }])
    .select()

  if (error) {
    console.error('Error submitting suggestion:', error)
    return null
  }

  return data[0]
}

/**
 * Récupérer toutes les suggestions (pour admin)
 */
export async function getAllSuggestions() {
  const { data, error } = await supabase
    .from('airdrop_suggestions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching suggestions:', error)
    return []
  }

  return data
}

/**
 * Marquer une suggestion comme traitée (pour admin)
 */
export async function markSuggestionAsProcessed(id) {
  const { data, error } = await supabase
    .from('airdrop_suggestions')
    .update({ processed: true })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error marking suggestion:', error)
    return null
  }

  return data[0]
}

// ============================================
// TEMPS RÉEL (REAL-TIME UPDATES)
// ============================================

/**
 * S'abonner aux changements d'airdrops en temps réel
 */
export function subscribeToAirdrops(callback) {
  const subscription = supabase
    .channel('airdrops-changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'airdrops' 
      }, 
      (payload) => {
        console.log('Airdrop change:', payload)
        callback(payload)
      }
    )
    .subscribe()

  return subscription
}

/**
 * Se désabonner des changements
 */
export function unsubscribeFromAirdrops(subscription) {
  supabase.removeChannel(subscription)
}

// ============================================
// STATISTIQUES (OPTIONNEL)
// ============================================

/**
 * Compter le nombre total d'airdrops
 */
export async function countAirdrops() {
  const { count, error } = await supabase
    .from('airdrops')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error counting airdrops:', error)
    return 0
  }

  return count
}

/**
 * Compter les airdrops par statut
 */
export async function countAirdropsByStatus() {
  const { data, error } = await supabase
    .from('airdrops')
    .select('status')

  if (error) {
    console.error('Error counting by status:', error)
    return { active: 0, upcoming: 0, ended: 0 }
  }

  const counts = {
    active: data.filter(a => a.status === 'active').length,
    upcoming: data.filter(a => a.status === 'upcoming').length,
    ended: data.filter(a => a.status === 'ended').length
  }

  return counts
}

// ============================================
// EXEMPLE D'UTILISATION DANS REACT
// ============================================

/*
import { getActiveAirdrops, submitSuggestion, subscribeToAirdrops } from './supabase-integration'

function App() {
  const [airdrops, setAirdrops] = useState([])

  useEffect(() => {
    // Charger les airdrops au démarrage
    loadAirdrops()

    // S'abonner aux changements en temps réel
    const subscription = subscribeToAirdrops((payload) => {
      if (payload.eventType === 'INSERT') {
        setAirdrops(prev => [payload.new, ...prev])
      } else if (payload.eventType === 'UPDATE') {
        setAirdrops(prev => prev.map(a => 
          a.id === payload.new.id ? payload.new : a
        ))
      } else if (payload.eventType === 'DELETE') {
        setAirdrops(prev => prev.filter(a => a.id !== payload.old.id))
      }
    })

    return () => unsubscribeFromAirdrops(subscription)
  }, [])

  async function loadAirdrops() {
    const data = await getActiveAirdrops()
    setAirdrops(data)
  }

  async function handleSuggestion(formData) {
    const result = await submitSuggestion(formData)
    if (result) {
      alert('Suggestion soumise avec succès!')
    }
  }

  // ... rest of component
}
*/
