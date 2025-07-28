'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, LogOut, ChevronDown, Menu } from 'lucide-react'; 
import { useTranslation } from 'react-i18next';


interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [searchQuery, setSearchQuery] = useState('');

 
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('Guest');

  
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserRole = localStorage.getItem('userRole');

    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []); 


  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getStaticPageTitle = () => {
    const currentPath = pathname.split('/')[1] || 'dashboard';
    switch (currentPath) {
      case 'employees': return t('pageTitles.employees', 'All Employees');
      case 'departments': return t('pageTitles.departments', 'All Departments');
      case 'attendance': return t('pageTitles.attendance', 'Attendance');
      case 'payroll': return t('pageTitles.payroll', 'Payroll');
      case 'jobs': return t('pageTitles.jobs', 'Jobs');
      case 'candidates': return t('pageTitles.candidates', 'Candidates');
      case 'leaves': return t('pageTitles.leaves', 'Leaves');
      case 'holidays': return t('pageTitles.holidays', 'Holidays');
      case 'settings': return t('pageTitles.settings', 'Settings');
      case 'profile': return t('pageTitles.profile', 'My Profile');
      case 'search': return t('pageTitles.search', 'Search Results');
      default: return t('pageTitles.dashboard', 'Dashboard');
    }
  };

  const getGreeting = () => {
    if (currentHour < 12) return t('header.goodMorning', 'Good Morning');
    if (currentHour < 17) return t('header.goodAfternoon', 'Good Afternoon');
    return t('header.goodEvening', 'Good Evening');
  };

 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('employeeId');
    router.push('/'); 
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(timer);
  }, []);

  const userInitials = userName.includes(' ')
    ? userName.split(' ').map((n: string) => n[0]).join('')
    : userName.slice(0, 2);

  return (
    <>
      {dropdownOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
      )}

      <header className="relative z-30 flex justify-between items-center gap-4 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        
       
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuToggle} 
            className="p-2 rounded-md lg:hidden text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

         
          <div>
            {pathname.startsWith('/dashboard') ? (
              <>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                 
                  {t('header.helloUser', { name: userName, defaultValue: `Hello, ${userName}` })} 👋
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{getGreeting()}</p>
              </>
            ) : (
              <>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  {getStaticPageTitle()}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('header.manageRecordsSubtitle', 'View and manage all records for this section.')}
                </p>
              </>
            )}
          </div>
        </div>

       
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative w-full max-w-xs md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('header.searchPlaceholder', 'Search...')}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className="relative">
            <div onClick={() => setDropdownOpen((prev) => !prev)} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 flex-shrink-0">
                {userInitials.toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
               
                <span className="text-sm font-medium text-gray-900 dark:text-white">{userName}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{userRole}</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 hidden sm:block" />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 border rounded-lg shadow-lg p-2 z-50 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm text-left rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('header.logout', 'Logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
