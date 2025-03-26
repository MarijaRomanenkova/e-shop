import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import CategoriesDrawer from './categories-drawer';
import Search from './search';
import { Category } from '@/types';
import { getCategories } from '@/lib/actions/category.actions';
import { auth } from '@/auth';
import { LayoutDashboard } from 'lucide-react';

const Header = async ({ categories }: { categories: Category[] }) => {
  // Ensure we have categories to work with
  const safeCategories = categories || [];
  
  // Get categories for search (simpler format)
  const allCategories = await getCategories();
  
  // Get authentication session
  const session = await auth();
  const isAuthenticated = !!session?.user;
  
  return (
    <header className='w-full bg-white dark:bg-black'>
      <div className='wrapper flex-between'>
        <div className='flex-start items-center'>
           <div className="sm:hidden">
             <CategoriesDrawer initialCategories={safeCategories} />
           </div>
          <Link href='/' className='flex-start items-center ml-4'>
            <Image
              priority={true}
              src='/images/logo.svg'
              width={32}
              height={32}
              alt={`${APP_NAME} logo`}
            />
            <span className='hidden lg:block font-bold text-4xl ml-3'>
              {APP_NAME}
            </span>
          </Link>
          
          {/* Search component - moved closer to logo */}
          <div className='hidden md:block ml-6'>
            <Search initialCategories={allCategories} />
          </div>
        </div>

        <div className='flex items-center gap-6'>
          {/* User Dashboard link - only visible to authenticated users */}
          {isAuthenticated && (
            <Link 
              href='/user/dashboard' 
              className='text-base font-semibold hover:text-primary transition-colors flex items-center'
            >
              <LayoutDashboard className="h-6 w-6 mr-2" />
              Dashboard
            </Link>
          )}
          
          {/* Menu component */}
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
