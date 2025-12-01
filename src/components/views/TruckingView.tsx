import { useState } from 'react';
import { 
  Truck, Calendar, MapPin, Package, Clock, AlertCircle, CheckCircle,
  Users, FileText, DollarSign, Navigation, Camera, Download, Upload,
  Search, Filter, Plus, Settings, MoreVertical, TrendingUp, Activity,
  Flag, Circle, XCircle, Timer, Bell, ChevronDown, Eye, Edit,
  Map, Fuel, Route, Container, Ship, Anchor, Phone, Mail,
  Building2, User, Hash, Box, Boxes, Warehouse, Target, ArrowUpRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';

interface TruckingJob {
  id: string;
  reference: string;
  dossierRef: string;
  type: 'delivery' | 'pickup' | 'intermodal' | 'drayage';
  status: 'planned' | 'dispatched' | 'in_transit' | 'delivered' | 'exception' | 'cancelled';
  priority: 'urgent' | 'normal' | 'low';
  client: string;
  origin: {
    name: string;
    address: string;
    contact: string;
    appointmentTime?: string;
  };
  destination: {
    name: string;
    address: string;
    contact: string;
    appointmentTime?: string;
  };
  cargo: {
    description: string;
    weight: number;
    volume: number;
    containerNumber?: string;
  };
  driver?: {
    name: string;
    phone: string;
    licensePlate: string;
  };
  plannedDate: string;
  actualPickupTime?: string;
  actualDeliveryTime?: string;
  eta?: string;
  distance: number;
  podStatus: 'pending' | 'captured' | 'confirmed';
  podPhotoUrl?: string;
  podSignatureUrl?: string;
  costs: {
    fuel: number;
    tolls: number;
    driver: number;
    subcontractor?: number;
    detention?: number;
    demurrage?: number;
  };
  revenue: number;
  containerFreeTimeEnd?: string;
  alerts: string[];
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  certifications: string[];
  status: 'available' | 'on_route' | 'off_duty';
  currentLocation?: string;
  assignedVehicle?: string;
}

interface Vehicle {
  id: string;
  licensePlate: string;
  type: 'truck' | 'trailer' | 'van' | 'flatbed';
  capacity: number;
  status: 'available' | 'in_use' | 'maintenance';
  lastMaintenance: string;
  nextMaintenance: string;
  fuelLevel?: number;
  gpsEnabled: boolean;
}

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
  <div className="group relative inline-block">
    {children}
    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
      {text}
      <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
    </div>
  </div>
);

export function TruckingView() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'jobs' | 'fleet' | 'containers' | 'demurrage' | 'rates' | 'portal'>('jobs');
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<TruckingJob | null>(null);

  // Mock Data
  const mockJobs: TruckingJob[] = [
    {
      id: 'TRK-001',
      reference: 'TRK-2025-001',
      dossierRef: 'DOS-2025-456',
      type: 'drayage',
      status: 'in_transit',
      priority: 'urgent',
      client: 'Maxam Ghana',
      origin: {
        name: 'Tema Port - Terminal 3',
        address: 'Tema Harbour, Greater Accra',
        contact: 'Port Operations: +233 303 206 000',
        appointmentTime: '2025-11-27 08:00'
      },
      destination: {
        name: 'Maxam Ghana Warehouse',
        address: 'Spintex Road, Accra',
        contact: 'John Mensah: +233 24 555 1234',
        appointmentTime: '2025-11-27 14:00'
      },
      cargo: {
        description: 'Mining Equipment Parts',
        weight: 18500,
        volume: 33.2,
        containerNumber: 'MSCU4567890'
      },
      driver: {
        name: 'Kwame Asante',
        phone: '+233 24 123 4567',
        licensePlate: 'GR-1234-20'
      },
      plannedDate: '2025-11-27',
      actualPickupTime: '2025-11-27 08:15',
      eta: '2025-11-27 13:45',
      distance: 28,
      podStatus: 'pending',
      costs: {
        fuel: 450,
        tolls: 35,
        driver: 200,
        detention: 0,
        demurrage: 0
      },
      revenue: 1200,
      containerFreeTimeEnd: '2025-11-29 23:59',
      alerts: ['Container free time ends in 2 days', 'Heavy traffic on route - ETA updated']
    },
    {
      id: 'TRK-002',
      reference: 'TRK-2025-002',
      dossierRef: 'DOS-2025-457',
      type: 'delivery',
      status: 'delivered',
      priority: 'normal',
      client: 'Dangote Cement',
      origin: {
        name: 'Main Warehouse - Accra',
        address: 'Industrial Area, Accra',
        contact: 'Warehouse Manager: +233 30 277 5555'
      },
      destination: {
        name: 'Dangote Plant - Tema',
        address: 'Tema Industrial Zone',
        contact: 'Plant Reception: +233 303 211 000',
        appointmentTime: '2025-11-26 10:00'
      },
      cargo: {
        description: 'Industrial Supplies',
        weight: 12000,
        volume: 24.5
      },
      driver: {
        name: 'Ama Serwaa',
        phone: '+233 24 987 6543',
        licensePlate: 'GR-5678-19'
      },
      plannedDate: '2025-11-26',
      actualPickupTime: '2025-11-26 07:30',
      actualDeliveryTime: '2025-11-26 09:45',
      distance: 35,
      podStatus: 'confirmed',
      podPhotoUrl: '/mock/pod-photo-1.jpg',
      podSignatureUrl: '/mock/signature-1.jpg',
      costs: {
        fuel: 380,
        tolls: 25,
        driver: 180,
        detention: 0,
        demurrage: 0
      },
      revenue: 950,
      alerts: []
    },
    {
      id: 'TRK-003',
      reference: 'TRK-2025-003',
      dossierRef: 'DOS-2025-458',
      type: 'drayage',
      status: 'exception',
      priority: 'urgent',
      client: 'Goldfields Ghana',
      origin: {
        name: 'Takoradi Port',
        address: 'Takoradi Harbour',
        contact: 'Port Control: +233 312 021 369',
        appointmentTime: '2025-11-27 06:00'
      },
      destination: {
        name: 'Goldfields Tarkwa Mine',
        address: 'Tarkwa, Western Region',
        contact: 'Mine Logistics: +233 312 222 000'
      },
      cargo: {
        description: 'Heavy Mining Machinery',
        weight: 24000,
        volume: 45.0,
        containerNumber: 'TEMU9876543'
      },
      driver: {
        name: 'Yaw Boateng',
        phone: '+233 24 345 6789',
        licensePlate: 'WR-9876-21'
      },
      plannedDate: '2025-11-27',
      actualPickupTime: '2025-11-27 06:20',
      distance: 89,
      podStatus: 'pending',
      costs: {
        fuel: 890,
        tolls: 65,
        driver: 450,
        detention: 150,
        demurrage: 0
      },
      revenue: 2400,
      containerFreeTimeEnd: '2025-11-28 18:00',
      alerts: [
        'URGENT: Container free time ends tomorrow!',
        'Vehicle breakdown reported - 2h delay',
        'Alternative route required - road closure'
      ]
    },
    {
      id: 'TRK-004',
      reference: 'TRK-2025-004',
      dossierRef: 'DOS-2025-459',
      type: 'pickup',
      status: 'planned',
      priority: 'normal',
      client: 'Unilever Ghana',
      origin: {
        name: 'Supplier Warehouse - Kumasi',
        address: 'Asokwa, Kumasi',
        contact: 'Warehouse: +233 322 044 000'
      },
      destination: {
        name: 'Unilever DC - Accra',
        address: 'Spintex Road, Accra',
        contact: 'DC Manager: +233 30 276 3000',
        appointmentTime: '2025-11-28 14:00'
      },
      cargo: {
        description: 'Consumer Goods - Palletized',
        weight: 8500,
        volume: 18.0
      },
      plannedDate: '2025-11-28',
      distance: 245,
      podStatus: 'pending',
      costs: {
        fuel: 650,
        tolls: 45,
        driver: 380,
        detention: 0,
        demurrage: 0
      },
      revenue: 1650,
      alerts: []
    },
    {
      id: 'TRK-005',
      reference: 'TRK-2025-005',
      dossierRef: 'DOS-2025-460',
      type: 'intermodal',
      status: 'dispatched',
      priority: 'urgent',
      client: 'Nestle Ghana',
      origin: {
        name: 'Tema Rail Terminal',
        address: 'Tema Port Area',
        contact: 'Rail Ops: +233 303 202 000',
        appointmentTime: '2025-11-27 11:00'
      },
      destination: {
        name: 'Nestle Factory - Tema',
        address: 'Community 1, Tema',
        contact: 'Factory Gate: +233 303 301 000'
      },
      cargo: {
        description: 'Raw Materials - Food Grade',
        weight: 16500,
        volume: 28.0,
        containerNumber: 'HLCU8523697'
      },
      driver: {
        name: 'Kwesi Mensah',
        phone: '+233 24 567 8901',
        licensePlate: 'GR-3456-20'
      },
      plannedDate: '2025-11-27',
      eta: '2025-11-27 12:30',
      distance: 12,
      podStatus: 'pending',
      costs: {
        fuel: 180,
        tolls: 0,
        driver: 120,
        detention: 0,
        demurrage: 0
      },
      revenue: 550,
      containerFreeTimeEnd: '2025-11-30 23:59',
      alerts: ['Rail arrival delayed by 30 minutes']
    },
    {
      id: 'TRK-006',
      reference: 'TRK-2025-006',
      dossierRef: 'DOS-2025-461',
      type: 'drayage',
      status: 'delivered',
      priority: 'low',
      client: 'Coca-Cola Ghana',
      origin: {
        name: 'Tema Port - Terminal 2',
        address: 'Tema Harbour',
        contact: 'Terminal Ops: +233 303 206 111',
        appointmentTime: '2025-11-25 09:00'
      },
      destination: {
        name: 'Coca-Cola Bottling Plant',
        address: 'Spintex Road, Accra',
        contact: 'Plant Logistics: +233 30 277 8000'
      },
      cargo: {
        description: 'Beverage Concentrates',
        weight: 14200,
        volume: 26.5,
        containerNumber: 'MAEU7412589'
      },
      driver: {
        name: 'Abena Osei',
        phone: '+233 24 678 9012',
        licensePlate: 'GR-7890-19'
      },
      plannedDate: '2025-11-25',
      actualPickupTime: '2025-11-25 09:10',
      actualDeliveryTime: '2025-11-25 11:20',
      distance: 22,
      podStatus: 'confirmed',
      podPhotoUrl: '/mock/pod-photo-2.jpg',
      podSignatureUrl: '/mock/signature-2.jpg',
      costs: {
        fuel: 320,
        tolls: 20,
        driver: 150,
        detention: 0,
        demurrage: 0
      },
      revenue: 780,
      alerts: []
    }
  ];

  const mockDrivers: Driver[] = [
    {
      id: 'DRV-001',
      name: 'Kwame Asante',
      phone: '+233 24 123 4567',
      email: 'kwame.asante@jocyderk.com',
      licenseNumber: 'DL-GH-123456',
      licenseExpiry: '2026-08-15',
      certifications: ['ADR', 'Dangerous Goods', 'Forklift'],
      status: 'on_route',
      currentLocation: 'En route to Spintex Road',
      assignedVehicle: 'GR-1234-20'
    },
    {
      id: 'DRV-002',
      name: 'Ama Serwaa',
      phone: '+233 24 987 6543',
      email: 'ama.serwaa@jocyderk.com',
      licenseNumber: 'DL-GH-234567',
      licenseExpiry: '2027-03-22',
      certifications: ['ADR', 'Tanker'],
      status: 'available',
      assignedVehicle: 'GR-5678-19'
    },
    {
      id: 'DRV-003',
      name: 'Yaw Boateng',
      phone: '+233 24 345 6789',
      email: 'yaw.boateng@jocyderk.com',
      licenseNumber: 'DL-GH-345678',
      licenseExpiry: '2025-12-10',
      certifications: ['Heavy Loads', 'Dangerous Goods'],
      status: 'on_route',
      currentLocation: 'Breakdown - awaiting assistance',
      assignedVehicle: 'WR-9876-21'
    },
    {
      id: 'DRV-004',
      name: 'Kwesi Mensah',
      phone: '+233 24 567 8901',
      email: 'kwesi.mensah@jocyderk.com',
      licenseNumber: 'DL-GH-456789',
      licenseExpiry: '2026-11-05',
      certifications: ['ADR', 'Container Handling'],
      status: 'on_route',
      currentLocation: 'Tema Rail Terminal',
      assignedVehicle: 'GR-3456-20'
    },
    {
      id: 'DRV-005',
      name: 'Abena Osei',
      phone: '+233 24 678 9012',
      email: 'abena.osei@jocyderk.com',
      licenseNumber: 'DL-GH-567890',
      licenseExpiry: '2027-06-18',
      certifications: ['ADR', 'Refrigerated Goods'],
      status: 'available',
      assignedVehicle: 'GR-7890-19'
    }
  ];

  const mockVehicles: Vehicle[] = [
    {
      id: 'VEH-001',
      licensePlate: 'GR-1234-20',
      type: 'truck',
      capacity: 20000,
      status: 'in_use',
      lastMaintenance: '2025-10-15',
      nextMaintenance: '2025-12-15',
      fuelLevel: 65,
      gpsEnabled: true
    },
    {
      id: 'VEH-002',
      licensePlate: 'GR-5678-19',
      type: 'truck',
      capacity: 15000,
      status: 'available',
      lastMaintenance: '2025-11-01',
      nextMaintenance: '2026-01-01',
      fuelLevel: 85,
      gpsEnabled: true
    },
    {
      id: 'VEH-003',
      licensePlate: 'WR-9876-21',
      type: 'flatbed',
      capacity: 25000,
      status: 'maintenance',
      lastMaintenance: '2025-11-27',
      nextMaintenance: '2026-01-27',
      fuelLevel: 45,
      gpsEnabled: true
    },
    {
      id: 'VEH-004',
      licensePlate: 'GR-3456-20',
      type: 'truck',
      capacity: 18000,
      status: 'in_use',
      lastMaintenance: '2025-10-20',
      nextMaintenance: '2025-12-20',
      fuelLevel: 70,
      gpsEnabled: true
    },
    {
      id: 'VEH-005',
      licensePlate: 'GR-7890-19',
      type: 'truck',
      capacity: 16000,
      status: 'available',
      lastMaintenance: '2025-11-10',
      nextMaintenance: '2026-01-10',
      fuelLevel: 90,
      gpsEnabled: true
    }
  ];

  const stats = {
    totalJobs: mockJobs.length,
    inTransit: mockJobs.filter(j => j.status === 'in_transit').length,
    delivered: mockJobs.filter(j => j.status === 'delivered').length,
    exceptions: mockJobs.filter(j => j.status === 'exception').length,
    onTimeRate: 94.5,
    avgCostPerKm: 25.8,
    podPending: mockJobs.filter(j => j.podStatus === 'pending').length,
    urgentJobs: mockJobs.filter(j => j.priority === 'urgent').length,
    containerAlerts: mockJobs.filter(j => j.containerFreeTimeEnd && 
      new Date(j.containerFreeTimeEnd) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)).length
  };

  const filterCategories = [
    {
      id: 'today',
      label: "Today's Jobs",
      icon: Calendar,
      count: mockJobs.filter(j => j.plannedDate === '2025-11-27').length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'in_transit',
      label: 'On Route',
      icon: Navigation,
      count: stats.inTransit,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'exceptions',
      label: 'Exceptions',
      icon: AlertCircle,
      count: stats.exceptions,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      urgent: stats.exceptions > 0
    },
    {
      id: 'awaiting_pod',
      label: 'Awaiting POD',
      icon: Camera,
      count: stats.podPending,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 'container_alerts',
      label: 'Container Alerts',
      icon: Container,
      count: stats.containerAlerts,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      urgent: stats.containerAlerts > 0
    }
  ];

  const getStatusBadge = (status: TruckingJob['status']) => {
    const badges = {
      planned: { label: 'Planned', className: 'bg-gray-100 text-gray-700' },
      dispatched: { label: 'Dispatched', className: 'bg-blue-100 text-blue-700' },
      in_transit: { label: 'In Transit', className: 'bg-green-100 text-green-700' },
      delivered: { label: 'Delivered', className: 'bg-emerald-100 text-emerald-700' },
      exception: { label: 'Exception', className: 'bg-red-100 text-red-700' },
      cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-500' }
    };
    return badges[status];
  };

  const getTypeBadge = (type: TruckingJob['type']) => {
    const badges = {
      delivery: { label: 'Delivery', icon: Truck, className: 'bg-blue-100 text-blue-700' },
      pickup: { label: 'Pickup', icon: Package, className: 'bg-purple-100 text-purple-700' },
      intermodal: { label: 'Intermodal', icon: Ship, className: 'bg-indigo-100 text-indigo-700' },
      drayage: { label: 'Drayage', icon: Container, className: 'bg-teal-100 text-teal-700' }
    };
    return badges[type];
  };

  const getPriorityBadge = (priority: TruckingJob['priority']) => {
    const badges = {
      urgent: { label: 'Urgent', className: 'bg-red-100 text-red-700' },
      normal: { label: 'Normal', className: 'bg-blue-100 text-blue-700' },
      low: { label: 'Low', className: 'bg-gray-100 text-gray-700' }
    };
    return badges[priority];
  };

  const calculateMargin = (job: TruckingJob) => {
    const totalCosts = Object.values(job.costs).reduce((sum, cost) => sum + (cost || 0), 0);
    const margin = job.revenue - totalCosts;
    const marginPercent = ((margin / job.revenue) * 100).toFixed(1);
    return { margin, marginPercent };
  };

  const formatCurrency = (amount: number, currency: string = 'GHS') => {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  };

  const renderJobsList = () => {
    let filteredJobs = mockJobs;
    
    if (selectedFilter === 'today') {
      filteredJobs = mockJobs.filter(j => j.plannedDate === '2025-11-27');
    } else if (selectedFilter === 'in_transit') {
      filteredJobs = mockJobs.filter(j => j.status === 'in_transit');
    } else if (selectedFilter === 'exceptions') {
      filteredJobs = mockJobs.filter(j => j.status === 'exception');
    } else if (selectedFilter === 'awaiting_pod') {
      filteredJobs = mockJobs.filter(j => j.podStatus === 'pending');
    } else if (selectedFilter === 'container_alerts') {
      filteredJobs = mockJobs.filter(j => j.containerFreeTimeEnd && 
        new Date(j.containerFreeTimeEnd) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
    }

    if (searchQuery) {
      filteredJobs = filteredJobs.filter(j => 
        j.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.cargo.containerNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return (
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Reference</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Route</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Driver</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">ETA</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">POD</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Revenue</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Margin</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredJobs.map((job) => {
              const statusBadge = getStatusBadge(job.status);
              const typeBadge = getTypeBadge(job.type);
              const priorityBadge = getPriorityBadge(job.priority);
              const { margin, marginPercent } = calculateMargin(job);
              
              return (
                <tr 
                  key={job.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium">{job.reference}</p>
                        <p className="text-xs text-gray-500">{job.dossierRef}</p>
                      </div>
                      {job.priority === 'urgent' && (
                        <Flag className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const TypeIcon = typeBadge.icon;
                        return <TypeIcon className="h-4 w-4 text-gray-600" />;
                      })()}
                      <Badge className={`text-xs ${typeBadge.className}`}>
                        {typeBadge.label}
                      </Badge>
                    </div>
                    {job.cargo.containerNumber && (
                      <p className="text-xs text-gray-500 mt-1">{job.cargo.containerNumber}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{job.client}</p>
                    <p className="text-xs text-gray-500">{job.cargo.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-900 truncate">{job.origin.name}</p>
                        <div className="flex items-center gap-1 my-1">
                          <ArrowUpRight className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{job.distance} km</span>
                        </div>
                        <p className="text-xs text-gray-900 truncate">{job.destination.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {job.driver ? (
                      <div>
                        <p className="text-sm font-medium">{job.driver.name}</p>
                        <p className="text-xs text-gray-500">{job.driver.licensePlate}</p>
                      </div>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                        Unassigned
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-xs ${statusBadge.className}`}>
                      {statusBadge.label}
                    </Badge>
                    {job.alerts.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Bell className="h-3 w-3 text-red-600" />
                        <span className="text-xs text-red-600">{job.alerts.length}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {job.eta ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-xs">{job.eta.split(' ')[1]}</span>
                      </div>
                    ) : job.actualDeliveryTime ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs">{job.actualDeliveryTime.split(' ')[1]}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {job.podStatus === 'confirmed' ? (
                      <Tooltip text="POD Confirmed">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </Tooltip>
                    ) : job.podStatus === 'captured' ? (
                      <Tooltip text="POD Captured - Pending Review">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </Tooltip>
                    ) : (
                      <Tooltip text="POD Pending">
                        <Camera className="h-5 w-5 text-gray-400" />
                      </Tooltip>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{formatCurrency(job.revenue)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-sm font-medium ${margin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(margin)}
                    </div>
                    <p className="text-xs text-gray-500">{marginPercent}%</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Tooltip text="View Details">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip text="Edit">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip text="More">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFleetDrivers = () => (
    <div className="space-y-6">
      {/* Drivers Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Drivers ({mockDrivers.length})</h3>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Driver
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockDrivers.map((driver) => (
            <div key={driver.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{driver.name}</p>
                    <p className="text-xs text-gray-500">{driver.licenseNumber}</p>
                  </div>
                </div>
                <Badge className={`text-xs ${
                  driver.status === 'available' ? 'bg-green-100 text-green-700' :
                  driver.status === 'on_route' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {driver.status === 'available' ? 'Available' :
                   driver.status === 'on_route' ? 'On Route' : 'Off Duty'}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-xs">{driver.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-xs">{driver.email}</span>
                </div>
                {driver.assignedVehicle && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Truck className="h-4 w-4" />
                    <span className="text-xs">{driver.assignedVehicle}</span>
                  </div>
                )}
                {driver.currentLocation && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Navigation className="h-4 w-4" />
                    <span className="text-xs">{driver.currentLocation}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Certifications:</p>
                <div className="flex flex-wrap gap-1">
                  {driver.certifications.map((cert, idx) => (
                    <Badge key={idx} className="bg-blue-50 text-blue-700 text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicles Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Fleet ({mockVehicles.length})</h3>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.licensePlate}</p>
                    <p className="text-xs text-gray-500 capitalize">{vehicle.type}</p>
                  </div>
                </div>
                <Badge className={`text-xs ${
                  vehicle.status === 'available' ? 'bg-green-100 text-green-700' :
                  vehicle.status === 'in_use' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {vehicle.status === 'available' ? 'Available' :
                   vehicle.status === 'in_use' ? 'In Use' : 'Maintenance'}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{vehicle.capacity.toLocaleString()} kg</span>
                </div>
                {vehicle.fuelLevel !== undefined && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Fuel:</span>
                      <span className="font-medium">{vehicle.fuelLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          vehicle.fuelLevel > 70 ? 'bg-green-500' :
                          vehicle.fuelLevel > 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${vehicle.fuelLevel}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Next Service:</span>
                  <span className="text-xs">{vehicle.nextMaintenance}</span>
                </div>
                {vehicle.gpsEnabled && (
                  <div className="flex items-center gap-2 text-green-600 text-xs">
                    <Navigation className="h-4 w-4" />
                    <span>GPS Enabled</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContainers = () => {
    const containerJobs = mockJobs.filter(j => j.cargo.containerNumber);
    
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Container & Drayage Jobs ({containerJobs.length})</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Container #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Job Reference</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Route</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Free Time Ends</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">D&D Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {containerJobs.map((job) => {
                const freeTimeDate = job.containerFreeTimeEnd ? new Date(job.containerFreeTimeEnd) : null;
                const now = new Date();
                const hoursRemaining = freeTimeDate ? Math.floor((freeTimeDate.getTime() - now.getTime()) / (1000 * 60 * 60)) : null;
                const daysRemaining = hoursRemaining !== null ? Math.floor(hoursRemaining / 24) : null;
                
                return (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Container className="h-4 w-4 text-gray-600" />
                        <span className="font-mono text-sm font-medium">{job.cargo.containerNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{job.reference}</p>
                      <p className="text-xs text-gray-500">{job.dossierRef}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{job.client}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-900">{job.origin.name}</p>
                      <p className="text-xs text-gray-500">→ {job.destination.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      {freeTimeDate && (
                        <div>
                          <p className="text-sm">{job.containerFreeTimeEnd?.split(' ')[0]}</p>
                          {daysRemaining !== null && (
                            <p className={`text-xs ${
                              daysRemaining < 1 ? 'text-red-600 font-medium' :
                              daysRemaining < 2 ? 'text-orange-600' :
                              'text-gray-500'
                            }`}>
                              {daysRemaining < 1 ? `${hoursRemaining}h remaining` : `${daysRemaining}d remaining`}
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${getStatusBadge(job.status).className}`}>
                        {getStatusBadge(job.status).label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {daysRemaining !== null && (
                        <Badge className={`text-xs ${
                          daysRemaining < 1 ? 'bg-red-100 text-red-700' :
                          daysRemaining < 2 ? 'bg-orange-100 text-orange-700' :
                          daysRemaining < 3 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {daysRemaining < 1 ? 'Critical' :
                           daysRemaining < 2 ? 'High' :
                           daysRemaining < 3 ? 'Medium' : 'Low'}
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar - Filters */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium mb-4">Quick Filters</h3>
          <div className="space-y-1">
            {filterCategories.map((category) => {
              const CategoryIcon = category.icon;
              const isSelected = selectedFilter === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedFilter(category.id === selectedFilter ? null : category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? category.bgColor : 'bg-gray-100'}`}>
                      <CategoryIcon className={`h-4 w-4 ${isSelected ? category.color : 'text-gray-600'}`} />
                    </div>
                    <div className="text-left">
                      <span className="text-sm block">{category.label}</span>
                      {category.urgent && (
                        <span className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="h-3 w-3" />
                          Requires attention
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* KPI Summary */}
        <div className="p-4 space-y-3 border-b border-gray-200">
          <h3 className="text-sm font-medium mb-3">Performance</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">On-Time Rate</span>
              <span className="font-medium text-green-600">{stats.onTimeRate}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Avg Cost/km</span>
              <span className="font-medium">{formatCurrency(stats.avgCostPerKm)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Active Jobs</span>
              <Badge className="bg-blue-100 text-blue-700">{stats.inTransit + stats.exceptions}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Trucking & TMS</h2>
              <p className="text-sm text-gray-500">Transport Management System</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Job
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Alert Bar */}
          {(stats.exceptions > 0 || stats.containerAlerts > 0) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Active Alerts</p>
                  <div className="flex items-center gap-4 mt-1">
                    {stats.exceptions > 0 && (
                      <span className="text-xs text-red-700">
                        {stats.exceptions} job exception{stats.exceptions > 1 ? 's' : ''}
                      </span>
                    )}
                    {stats.containerAlerts > 0 && (
                      <span className="text-xs text-red-700">
                        {stats.containerAlerts} container{stats.containerAlerts > 1 ? 's' : ''} near free time limit
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-200">
            {[
              { id: 'jobs', label: 'Jobs & Planning', icon: Truck },
              { id: 'fleet', label: 'Fleet & Drivers', icon: Users },
              { id: 'containers', label: 'Containers', icon: Container },
              { id: 'demurrage', label: 'D&D Management', icon: Timer },
              { id: 'rates', label: 'Rates & Tariffs', icon: DollarSign },
              { id: 'portal', label: 'Client Portal', icon: Activity }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Statistics Cards */}
        {activeTab === 'jobs' && (
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-700">Total Jobs</span>
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-900">{stats.totalJobs}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-700">In Transit</span>
                  <Navigation className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-900">{stats.inTransit}</p>
                <p className="text-xs text-green-600 mt-1">Active deliveries</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-emerald-700">Delivered</span>
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-emerald-900">{stats.delivered}</p>
                <p className="text-xs text-emerald-600 mt-1">{stats.onTimeRate}% on-time</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-red-700">Exceptions</span>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-900">{stats.exceptions}</p>
                {stats.exceptions > 0 && (
                  <p className="text-xs text-red-600 mt-1">Requires action</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-orange-700">POD Pending</span>
                  <Camera className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-900">{stats.podPending}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {activeTab === 'jobs' && (
          <div className="px-6 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by reference, client, container number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                >
                  Kanban
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'jobs' && viewMode === 'list' && renderJobsList()}
          {activeTab === 'fleet' && renderFleetDrivers()}
          {activeTab === 'containers' && renderContainers()}
          {activeTab === 'demurrage' && (
            <div className="text-center text-gray-500 py-12">
              <Timer className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Demurrage & Detention Management</p>
              <p className="text-sm mt-1">Free time tracking and D&D calculation module</p>
            </div>
          )}
          {activeTab === 'rates' && (
            <div className="text-center text-gray-500 py-12">
              <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Rate Management</p>
              <p className="text-sm mt-1">Tariffs, contracts, and pricing rules</p>
            </div>
          )}
          {activeTab === 'portal' && (
            <div className="text-center text-gray-500 py-12">
              <Activity className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Client Portal</p>
              <p className="text-sm mt-1">Public tracking links and customer access logs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
