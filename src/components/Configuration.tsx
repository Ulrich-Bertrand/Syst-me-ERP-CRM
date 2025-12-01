import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Plus, Settings, FileText, Hash } from 'lucide-react';
import { dossierTypes, numerotationSchemas } from '../lib/mockData';
import { Badge } from './ui/badge';

export function Configuration() {
  const [activeTab, setActiveTab] = useState('types');

  return (
    <div className="space-y-6">
      <div>
        <h2>Configuration système</h2>
        <p className="text-muted-foreground">Paramétrage complet du système ERP/CRM</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="types">Types de dossier</TabsTrigger>
          <TabsTrigger value="numerotation">Numérotation</TabsTrigger>
          <TabsTrigger value="regles">Règles métier</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Configurez les types de dossiers et leurs paramètres</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau type
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dossierTypes.map((type) => (
              <Card key={type.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: type.color }} />
                      <CardTitle className="text-base">{type.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">{type.code}</Badge>
                  </div>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Transport & Trafic</p>
                      <p className="capitalize">{type.transportMode} - {type.trafficDirection}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Activités</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {type.activities.map((activity) => (
                          <Badge key={activity} variant="secondary" className="text-xs capitalize">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Plan opérationnel</p>
                      <p>{type.planOperationnel.length} étapes</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Règles métier</p>
                      <p>{type.businessRules.length} règle(s)</p>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-muted-foreground text-xs mb-2">Modules actifs</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(type.modulesActifs)
                          .filter(([_, actif]) => actif)
                          .map(([module]) => (
                            <Badge key={module} variant="outline" className="text-xs">
                              {module}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="numerotation" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Configurez les schémas de numérotation automatique</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau schéma
            </Button>
          </div>

          <div className="grid gap-4">
            {numerotationSchemas.map((schema) => (
              <Card key={schema.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{schema.name}</CardTitle>
                      <CardDescription>Format: {schema.example}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Préfixe</p>
                      <p className="font-mono">{schema.prefix}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Séparateur</p>
                      <p className="font-mono">{schema.separator}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Format année</p>
                      <p className="font-mono">{schema.yearFormat}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Longueur compteur</p>
                      <p className="font-mono">{schema.counterLength}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Compteur actuel</p>
                      <p className="font-mono">{schema.counter}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regles" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Configurez les règles métier paramétrables</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle règle
            </Button>
          </div>

          <div className="space-y-4">
            {dossierTypes.map((type) => (
              <Card key={type.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: type.color }} />
                    <CardTitle>{type.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {type.businessRules.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{rule.label}</p>
                          <p className="text-sm text-muted-foreground">Code: {rule.code}</p>
                        </div>
                        <Badge variant={
                          rule.type === 'obligatoire' ? 'destructive' :
                          rule.type === 'validation' ? 'default' :
                          'secondary'
                        }>
                          {rule.type}
                        </Badge>
                      </div>
                    ))}
                    {type.businessRules.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">Aucune règle configurée</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <p className="text-sm text-muted-foreground">Activez ou désactivez les modules pour chaque type de dossier</p>

          <div className="space-y-4">
            {dossierTypes.map((type) => (
              <Card key={type.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: type.color }} />
                    <CardTitle>{type.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(type.modulesActifs).map(([module, actif]) => (
                      <div
                        key={module}
                        className={`p-3 border rounded-lg ${actif ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm capitalize">{module}</span>
                          <div className={`w-2 h-2 rounded-full ${actif ? 'bg-green-500' : 'bg-gray-300'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
