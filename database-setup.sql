-- ============================================
-- SOLANA AIRDROP CHECKER - DATABASE SCHEMA
-- Configuration complète pour Supabase
-- ============================================

-- ============================================
-- 1. TABLE: airdrops
-- Stocke tous les airdrops disponibles
-- ============================================

CREATE TABLE IF NOT EXISTS airdrops (
  id BIGSERIAL PRIMARY KEY,
  project_name TEXT NOT NULL,
  description TEXT,
  logo TEXT DEFAULT '🪙',
  status TEXT CHECK (status IN ('active', 'upcoming', 'ended')) DEFAULT 'active',
  criteria_type TEXT,
  criteria_details JSONB,
  claim_url TEXT,
  website_url TEXT,
  twitter_url TEXT,
  discord_url TEXT,
  telegram_url TEXT,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_airdrops_status ON airdrops(status);
CREATE INDEX idx_airdrops_created_at ON airdrops(created_at DESC);

-- ============================================
-- 2. TABLE: airdrop_suggestions
-- Stocke les suggestions d'airdrops des utilisateurs
-- ============================================

CREATE TABLE IF NOT EXISTS airdrop_suggestions (
  id BIGSERIAL PRIMARY KEY,
  project_name TEXT NOT NULL,
  description TEXT,
  official_link TEXT,
  user_email TEXT,
  criteria_notes TEXT,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les suggestions non traitées
CREATE INDEX idx_suggestions_processed ON airdrop_suggestions(processed);
CREATE INDEX idx_suggestions_created_at ON airdrop_suggestions(created_at DESC);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- Définit les permissions d'accès
-- ============================================

-- Activer RLS sur les tables
ALTER TABLE airdrops ENABLE ROW LEVEL SECURITY;
ALTER TABLE airdrop_suggestions ENABLE ROW LEVEL SECURITY;

-- Politique: Tout le monde peut lire les airdrops
CREATE POLICY "Airdrops sont publics"
  ON airdrops
  FOR SELECT
  USING (true);

-- Politique: Tout le monde peut insérer des suggestions
CREATE POLICY "Suggestions publiques en insertion"
  ON airdrop_suggestions
  FOR INSERT
  WITH CHECK (true);

-- Politique: Tout le monde peut lire les suggestions (optionnel - pour admin uniquement)
CREATE POLICY "Lecture suggestions publique"
  ON airdrop_suggestions
  FOR SELECT
  USING (true);

-- ============================================
-- 4. FONCTIONS & TRIGGERS
-- Automatisation de mise à jour
-- ============================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour la table airdrops
CREATE TRIGGER update_airdrops_updated_at
  BEFORE UPDATE ON airdrops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. DONNÉES EXEMPLE
-- Airdrops populaires sur Solana
-- ============================================

INSERT INTO airdrops (
  project_name,
  description,
  logo,
  status,
  criteria_type,
  criteria_details,
  claim_url,
  website_url,
  twitter_url,
  discord_url
) VALUES 
(
  'Jupiter',
  'Leading DEX aggregator on Solana. Check your JUP allocation based on trading volume and frequency.',
  '🪐',
  'active',
  'token_holder',
  '{"min_transactions": 10, "min_volume": 1000}',
  'https://jup.ag/airdrop',
  'https://jup.ag',
  'https://twitter.com/JupiterExchange',
  'https://discord.gg/jup'
),
(
  'Jito',
  'MEV infrastructure for Solana. Rewards for JitoSOL stakers and validators.',
  '⚡',
  'active',
  'staking',
  '{"token": "JitoSOL", "min_stake": 5}',
  'https://jito.network/airdrop',
  'https://jito.network',
  'https://twitter.com/jito_sol',
  NULL
),
(
  'Marginfi',
  'DeFi lending protocol on Solana. Early users and liquidity providers eligible.',
  '📊',
  'active',
  'protocol_interaction',
  '{"protocol": "marginfi", "min_interactions": 5}',
  'https://app.marginfi.com',
  'https://marginfi.com',
  'https://twitter.com/marginfi',
  'https://discord.gg/marginfi'
),
(
  'Kamino',
  'Automated liquidity manager. Rewards for liquidity providers and KMNO holders.',
  '🌊',
  'upcoming',
  'liquidity_provider',
  '{"protocol": "kamino", "min_liquidity": 100}',
  '#',
  'https://kamino.finance',
  'https://twitter.com/KaminoFinance',
  NULL
),
(
  'Drift Protocol',
  'Perpetual DEX on Solana. Active traders eligible for allocation based on trading volume.',
  '🎯',
  'active',
  'trading_volume',
  '{"min_volume": 1000, "min_trades": 20}',
  'https://app.drift.trade',
  'https://drift.trade',
  'https://twitter.com/DriftProtocol',
  'https://discord.gg/drift'
),
(
  'Tensor',
  'Leading NFT marketplace on Solana. Traders and collectors get rewards.',
  '🖼️',
  'active',
  'nft_trader',
  '{"min_nft_trades": 10, "min_volume": 5}',
  'https://tensor.trade/airdrop',
  'https://tensor.trade',
  'https://twitter.com/tensor_hq',
  'https://discord.gg/tensor'
),
(
  'Phoenix',
  'On-chain order book DEX. Traders and liquidity providers eligible.',
  '🔥',
  'upcoming',
  'dex_trader',
  '{"min_trades": 15}',
  '#',
  'https://phoenix.trade',
  'https://twitter.com/Phoenix_Trade',
  NULL
),
(
  'Sanctum',
  'Liquid staking infrastructure. LST holders and stakers eligible.',
  '⛪',
  'upcoming',
  'lst_holder',
  '{"supported_lst": ["mSOL", "jitoSOL", "bSOL"]}',
  '#',
  'https://sanctum.so',
  'https://twitter.com/sanctumso',
  NULL
),
(
  'Marinade Finance',
  'Liquid staking protocol. mSOL holders and early users eligible.',
  '🥘',
  'active',
  'token_holder',
  '{"token": "mSOL", "min_amount": 1}',
  'https://marinade.finance/airdrop',
  'https://marinade.finance',
  'https://twitter.com/MarinadeFinance',
  'https://discord.gg/marinade'
),
(
  'Raydium',
  'AMM and liquidity provider on Solana. LP providers and traders eligible.',
  '☀️',
  'active',
  'liquidity_provider',
  '{"min_liquidity": 100, "protocol": "raydium"}',
  'https://raydium.io/airdrop',
  'https://raydium.io',
  'https://twitter.com/RaydiumProtocol',
  NULL
);

-- ============================================
-- 6. VUES (VIEWS) UTILES
-- Vues pour faciliter les requêtes
-- ============================================

-- Vue: Airdrops actifs uniquement
CREATE OR REPLACE VIEW active_airdrops AS
SELECT * FROM airdrops
WHERE status = 'active'
ORDER BY created_at DESC;

-- Vue: Airdrops à venir
CREATE OR REPLACE VIEW upcoming_airdrops AS
SELECT * FROM airdrops
WHERE status = 'upcoming'
ORDER BY created_at DESC;

-- Vue: Suggestions non traitées
CREATE OR REPLACE VIEW pending_suggestions AS
SELECT * FROM airdrop_suggestions
WHERE processed = FALSE
ORDER BY created_at DESC;

-- ============================================
-- 7. FONCTIONS UTILITAIRES
-- Fonctions pour faciliter la gestion
-- ============================================

-- Fonction: Marquer un airdrop comme terminé automatiquement
CREATE OR REPLACE FUNCTION mark_expired_airdrops()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE airdrops
  SET status = 'ended'
  WHERE end_date < NOW() AND status != 'ended';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Obtenir les statistiques des airdrops
CREATE OR REPLACE FUNCTION get_airdrop_stats()
RETURNS TABLE (
  total_airdrops BIGINT,
  active_count BIGINT,
  upcoming_count BIGINT,
  ended_count BIGINT,
  pending_suggestions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM airdrops) as total_airdrops,
    (SELECT COUNT(*) FROM airdrops WHERE status = 'active') as active_count,
    (SELECT COUNT(*) FROM airdrops WHERE status = 'upcoming') as upcoming_count,
    (SELECT COUNT(*) FROM airdrops WHERE status = 'ended') as ended_count,
    (SELECT COUNT(*) FROM airdrop_suggestions WHERE processed = FALSE) as pending_suggestions;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. SCHEDULED JOBS (via pg_cron extension)
-- Automatisation des tâches
-- ============================================

-- Note: Nécessite l'extension pg_cron (disponible sur Supabase Pro)
-- Pour activer: CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Job: Marquer les airdrops expirés chaque jour à minuit
-- SELECT cron.schedule(
--   'mark-expired-airdrops',
--   '0 0 * * *',
--   'SELECT mark_expired_airdrops();'
-- );

-- ============================================
-- 9. REQUÊTES UTILES POUR L'ADMIN
-- Exemples de requêtes pratiques
-- ============================================

-- Voir tous les airdrops avec statistiques
-- SELECT 
--   status,
--   COUNT(*) as count,
--   AVG(EXTRACT(EPOCH FROM (NOW() - created_at))/86400)::INTEGER as avg_days_since_creation
-- FROM airdrops
-- GROUP BY status;

-- Voir les suggestions récentes non traitées
-- SELECT * FROM airdrop_suggestions
-- WHERE processed = FALSE
-- ORDER BY created_at DESC
-- LIMIT 10;

-- Trouver les airdrops sans liens sociaux
-- SELECT project_name, website_url
-- FROM airdrops
-- WHERE twitter_url IS NULL OR discord_url IS NULL;

-- ============================================
-- 10. BACKUP & MAINTENANCE
-- Commandes de maintenance
-- ============================================

-- Sauvegarder les données (via CLI Supabase)
-- supabase db dump -f backup.sql

-- Restaurer depuis une sauvegarde
-- supabase db reset
-- psql -h [host] -U postgres -d postgres -f backup.sql

-- ============================================
-- NOTES IMPORTANTES
-- ============================================

/*
1. SÉCURITÉ:
   - Les clés API Supabase doivent être gardées secrètes
   - Utiliser RLS pour restreindre l'accès aux données sensibles
   - Ne jamais exposer les clés service_role côté client

2. PERFORMANCE:
   - Les index sont créés sur les colonnes fréquemment interrogées
   - Utiliser les vues pour les requêtes complexes répétitives
   - Considérer la pagination pour les grandes listes

3. MONITORING:
   - Vérifier régulièrement les suggestions non traitées
   - Surveiller les airdrops expirés
   - Analyser les statistiques d'utilisation

4. ÉVOLUTIVITÉ:
   - Schema flexible avec JSONB pour criteria_details
   - Facile d'ajouter de nouveaux types de critères
   - Structure prête pour l'ajout de nouvelles fonctionnalités
*/

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Vérifier que tout est bien créé
SELECT 
  'Tables créées:' as message,
  COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('airdrops', 'airdrop_suggestions');
