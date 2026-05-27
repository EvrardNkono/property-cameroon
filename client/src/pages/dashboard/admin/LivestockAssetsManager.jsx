// frontend/src/pages/dashboard/admin/LivestockAssetsManager.jsx
import React from 'react';
import LivestockManagement from '../livestock/LivestockManagement';

/**
 * Composant Admin pour la gestion des actifs d'élevage
 * Réutilise le composant LivestockManagement qui affichera tous les livestock
 * car le backend détecte le rôle ADMIN et retourne toutes les données
 */
const LivestockAssetsManager = () => {
  return <LivestockManagement />;
};

export default LivestockAssetsManager;