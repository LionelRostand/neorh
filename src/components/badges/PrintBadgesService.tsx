
import React from 'react';
import { Badge } from '@/types/firebase';

export const printBadges = (badges: Badge[]) => {
  if (badges.length === 0) return;

  // Créer une nouvelle fenêtre pour l'impression
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error("Impossible d'ouvrir une fenêtre d'impression");
    return;
  }

  // En-tête du document HTML pour l'impression
  let printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Liste des badges</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
          .badges-list {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
          }
          .badge-container {
            width: 85mm;
            height: 54mm;
            border: 1px solid #000;
            padding: 10px;
            box-sizing: border-box;
            position: relative;
            display: flex;
            flex-direction: column;
            page-break-inside: avoid;
          }
          .badge-header {
            text-align: center;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          .badge-number {
            position: absolute;
            top: 5px;
            right: 5px;
            font-size: 10px;
            color: #666;
          }
          .badge-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .employee-name {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 5px;
          }
          .badge-type {
            font-size: 12px;
            text-align: center;
            margin-bottom: 5px;
            color: #666;
          }
          .badge-status {
            width: fit-content;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 10px;
            margin: 0 auto;
            color: white;
            text-align: center;
          }
          .badge-footer {
            margin-top: 10px;
            border-top: 1px solid #ccc;
            padding-top: 5px;
            font-size: 10px;
            text-align: center;
            color: #666;
          }

          /* Status styles */
          .status-active {
            background-color: #10b981;
          }
          .status-inactive {
            background-color: #6b7280;
          }
          .status-pending {
            background-color: #f59e0b;
          }
          .status-lost {
            background-color: #ef4444;
          }

          @media print {
            .print-button {
              display: none;
            }
            body {
              padding: 0;
            }
            h1 {
              margin-top: 0;
            }
          }
        </style>
      </head>
      <body>
        <h1>Liste des badges</h1>
        <div class="badges-list">
  `;

  // Ajouter chaque badge au contenu HTML
  badges.forEach(badge => {
    printContent += `
      <div class="badge-container">
        <div class="badge-number">N° ${badge.number}</div>
        <div class="badge-header">
          <h2>BADGE D'ACCÈS</h2>
        </div>
        <div class="badge-content">
          <div class="employee-name">${badge.employeeName}</div>
          <div class="badge-type">${badge.type.toUpperCase()}</div>
          <div class="badge-status status-${badge.status}">${
            badge.status === 'active' ? 'ACTIF' :
            badge.status === 'inactive' ? 'INACTIF' :
            badge.status === 'pending' ? 'EN ATTENTE' :
            badge.status === 'lost' ? 'PERDU' : 'INCONNU'
          }</div>
        </div>
        <div class="badge-footer">
          <div>Date d'émission: ${badge.issueDate}</div>
          <div>Date d'expiration: ${badge.expiryDate || "Non définie"}</div>
        </div>
      </div>
    `;
  });

  // Fermer le document HTML
  printContent += `
        </div>
        <div class="print-button" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print(); setTimeout(function(){ window.close(); }, 500);">
            Imprimer tous les badges
          </button>
        </div>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();
};
