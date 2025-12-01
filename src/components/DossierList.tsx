import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { dossiers, dossierTypes } from '../lib/mockData';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DossierListProps {
  onSelectDossier: (dossierId: string) => void;
}

export function DossierList({ onSelectDossier }: DossierListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('tous');
  const [filterType, setFilterType] = useState<string>('tous');

  const filteredDossiers = dossiers.filter((dossier) => {
    const matchesSearch = 
      dossier.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'tous' || dossier.statut === filterStatus;
    const matchesType = filterType === 'tous' || dossier.typeId === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (statut: string) => {
    const variants: Record<string, string> = {
      brouillon: 'bg-gray-100 text-gray-800',
      ouvert: 'bg-yellow-100 text-yellow-800',
      en_cours: 'bg-blue-100 text-blue-800',
      termine: 'bg-green-100 text-green-800',
      facture: 'bg-purple-100 text-purple-800',
      cloture: 'bg-gray-100 text-gray-800'
    };
    return variants[statut] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestion des dossiers</h2>
          <p className="text-muted-foreground">Liste de tous les dossiers opérationnels</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau dossier
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par numéro, titre, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="ouvert">Ouvert</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
                <SelectItem value="facture">Facturé</SelectItem>
                <SelectItem value="cloture">Clôturé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les types</SelectItem>
                {dossierTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDossiers.map((dossier) => {
              const type = dossierTypes.find(t => t.id === dossier.typeId);
              return (
                <div
                  key={dossier.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => onSelectDossier(dossier.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-1 h-16 rounded"
                      style={{ backgroundColor: type?.color }}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{dossier.numero}</p>
                        <Badge variant="outline" className="text-xs">{type?.code}</Badge>
                      </div>
                      <p>{dossier.titre}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Client: {dossier.client}</span>
                        <span>•</span>
                        <span>Responsable: {dossier.responsable}</span>
                        <span>•</span>
                        <span>Ouvert le {new Date(dossier.dateOuverture).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${getStatusBadge(dossier.statut)}`}>
                      {dossier.statut.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Affichage de {filteredDossiers.length} dossier(s) sur {dossiers.length} au total
      </div>
    </div>
  );
}
