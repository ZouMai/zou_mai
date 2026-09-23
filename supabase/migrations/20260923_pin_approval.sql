-- La première attribution d'un PIN reste en attente de la validation du professeur.
-- Un code classe partagé ne suffit pas à prouver l'identité du prénom choisi.
alter table public.tables_accounts
  add column if not exists pin_approved boolean not null default false;

-- Les anciens comptes de démonstration ne sont pas approuvés par défaut.
-- Aucune nouvelle autorisation directe sur cette table : accès par Edge Function uniquement.
