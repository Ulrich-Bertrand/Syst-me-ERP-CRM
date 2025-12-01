import { useState } from 'react';
import { 
  Bell, User, LogOut, Settings, ChevronDown, Building2, 
  Check, Mail, Phone, MapPin, X, Languages
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

function Tooltip({ text, children }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
        {text}
        <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}

interface Agency {
  id: string;
  name: string;
  country: string;
  code: string;
}

const agencies: Agency[] = [
  { id: 'gh', name: 'JOCYDERK LOGISTICS LTD GHANA', country: 'Ghana', code: 'GH' },
  { id: 'ci', name: 'Jocyderk Cote d\'Ivoire', country: 'Côte d\'Ivoire', code: 'CI' },
  { id: 'bf', name: 'Jocyderk Burkina', country: 'Burkina Faso', code: 'BF' },
];

const getMockNotifications = (t: (key: string) => string) => [
  {
    id: '1',
    type: 'info',
    title: t('notifications.invoice.validated'),
    message: t('notifications.invoice.validatedMsg'),
    time: t('notifications.time.min'),
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: t('notifications.payment.late'),
    message: t('notifications.payment.lateMsg'),
    time: t('notifications.time.1h'),
    read: false,
  },
  {
    id: '3',
    type: 'success',
    title: t('notifications.folder.completed'),
    message: t('notifications.folder.completedMsg'),
    time: t('notifications.time.2h'),
    read: true,
  },
  {
    id: '4',
    type: 'info',
    title: t('notifications.client.new'),
    message: t('notifications.client.newMsg'),
    time: t('notifications.time.3h'),
    read: true,
  },
];

interface UserHeaderProps {
  currentAgency: string;
  onAgencyChange: (agencyId: string) => void;
}

export function UserHeader({ currentAgency, onAgencyChange }: UserHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAgencyMenu, setShowAgencyMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [notifications, setNotifications] = useState(getMockNotifications(t));

  const selectedAgency = agencies.find(a => a.id === currentAgency) || agencies[0];
  const unreadCount = notifications.filter(n => !n.read).length;

  const currentUser = {
    name: 'Consultant IC',
    email: 'consultantic@jocyderklogistics.com',
    role: t('user.role'),
    avatar: null,
  };

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Agency Selector */}
        <div className="relative">
          <button
            onClick={() => setShowAgencyMenu(!showAgencyMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Building2 className="h-4 w-4 text-blue-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{selectedAgency.name}</p>
              <p className="text-xs text-gray-500">{selectedAgency.country}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {showAgencyMenu && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setShowAgencyMenu(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-40">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium text-sm">{t('agency.select')}</h3>
                </div>
                <div className="py-2">
                  {agencies.map((agency) => (
                    <button
                      key={agency.id}
                      onClick={() => {
                        onAgencyChange(agency.id);
                        setShowAgencyMenu(false);
                      }}
                      className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{agency.name}</p>
                          <p className="text-xs text-gray-500">{agency.country}</p>
                        </div>
                      </div>
                      {agency.id === currentAgency && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right side - Language, Notifications & User */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <Tooltip text={language === 'fr' ? 'Changer de langue' : 'Change language'}>
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Languages className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">{currentLanguage.flag}</span>
                <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
              </button>
            </Tooltip>

            {showLanguageMenu && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowLanguageMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-40">
                  <div className="py-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as 'fr' | 'en');
                          setNotifications(getMockNotifications(
                            (key: string) => {
                              const translations = {
                                fr: {
                                  'notifications.invoice.validated': 'Nouvelle facture validée',
                                  'notifications.invoice.validatedMsg': 'La facture FACT-2025-045 a été validée',
                                  'notifications.payment.late': 'Paiement en retard',
                                  'notifications.payment.lateMsg': 'Le paiement de Maxam Ghana est en retard de 3 jours',
                                  'notifications.folder.completed': 'Dossier complété',
                                  'notifications.folder.completedMsg': 'Le dossier DOS-2025-123 a été complété avec succès',
                                  'notifications.client.new': 'Nouveau client',
                                  'notifications.client.newMsg': 'Un nouveau client a été ajouté au système',
                                  'notifications.time.min': 'Il y a 5 min',
                                  'notifications.time.1h': 'Il y a 1h',
                                  'notifications.time.2h': 'Il y a 2h',
                                  'notifications.time.3h': 'Il y a 3h',
                                },
                                en: {
                                  'notifications.invoice.validated': 'New invoice validated',
                                  'notifications.invoice.validatedMsg': 'Invoice FACT-2025-045 has been validated',
                                  'notifications.payment.late': 'Late payment',
                                  'notifications.payment.lateMsg': 'Payment from Maxam Ghana is 3 days overdue',
                                  'notifications.folder.completed': 'Folder completed',
                                  'notifications.folder.completedMsg': 'Folder DOS-2025-123 has been successfully completed',
                                  'notifications.client.new': 'New client',
                                  'notifications.client.newMsg': 'A new client has been added to the system',
                                  'notifications.time.min': '5 min ago',
                                  'notifications.time.1h': '1h ago',
                                  'notifications.time.2h': '2h ago',
                                  'notifications.time.3h': '3h ago',
                                }
                              };
                              return translations[lang.code as 'fr' | 'en'][key] || key;
                            }
                          ));
                          setShowLanguageMenu(false);
                        }}
                        className="w-full px-4 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-sm font-medium text-gray-900">{lang.name}</span>
                        </div>
                        {lang.code === language && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <Tooltip text="Notifications">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            </Tooltip>

            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-40">
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{t('notifications.title')}</h3>
                      {unreadCount > 0 && (
                        <p className="text-xs text-gray-500">
                          {unreadCount} {unreadCount > 1 ? t('notifications.unreadPlural') : t('notifications.unread')}
                        </p>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        {t('notifications.markAllRead')}
                      </Button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">{t('notifications.none')}</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg mt-0.5 ${getNotificationIcon(notification.type)}`}>
                              <Bell className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-blue-600 rounded-full mt-1.5" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-200">
                    <Button variant="ghost" size="sm" className="w-full text-sm">
                      {t('notifications.viewAll')}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-40">
                  {/* User Info */}
                  <div className="px-4 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                        {currentUser.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{currentUser.name}</p>
                        <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{currentUser.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Building2 className="h-3 w-3" />
                        <span>{selectedAgency.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button className="w-full px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t('user.profile')}</p>
                        <p className="text-xs text-gray-500">{t('user.manageInfo')}</p>
                      </div>
                    </button>
                    <button className="w-full px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t('user.settings')}</p>
                        <p className="text-xs text-gray-500">{t('user.preferences')}</p>
                      </div>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 py-2">
                    <button className="w-full px-4 py-2 hover:bg-red-50 transition-colors flex items-center gap-3 text-left text-red-600">
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm font-medium">{t('user.logout')}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
