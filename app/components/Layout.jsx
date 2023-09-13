import {useParams, Form, Await, useMatches} from '@remix-run/react';
import {useWindowScroll} from 'react-use';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo} from 'react';
import {Image, CartForm} from '@shopify/hydrogen';
import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
} from '~/components';
import {useIsHomePath} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';

export function Layout({children, layout}) {
  const {headerMenu, footerMenu} = layout;
  useEffect(() => {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
  },[]);
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && (
          <Header title={layout.shop.name} menu={headerMenu} layout={layout} />
        )}
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      {footerMenu && <Footer menu={footerMenu} />}
    </>
  );
}

function Header({title, menu, layout}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        layout={layout}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        openCart={openCart}
        openMenu={openMenu}
        layout={layout}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}) {
  const [root] = useMatches();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={root.data?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({isOpen, onClose, menu}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({menu, onClose}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({layout, isHome, openCart, openMenu}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();
  const {y} = useWindowScroll();
  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-white hover:bg-opacity-100 hover:text-black -mb-nav'
          : 'bg-white text-black shadow-darkHeader'
      } ${
        isHome && y < 10
          ? 'bg-opacity-0 text-white border-b border-b-white border-opacity-50'
          : 'bg-opacity-100 text-black shadow-darkHeader'
      }
      flex lg:hidden items-center h-nav sticky z-50 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8 transition duration-300`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Image
          className=" w-auto h-[90px] object-contain"
          src={layout.shop.brand.logo.image.url}
          alt="Delics"
          aspectRatio="1"
        ></Image>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({isHome, menu, openCart, layout}) {
  const params = useParams();
  const {y} = useWindowScroll();

  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-white hover:bg-opacity-100 hover:text-black -mb-nav'
          : 'bg-white text-black shadow-darkHeader'
      } ${
        isHome && y < 10
          ? 'bg-opacity-0 text-white border-b border-b-white border-opacity-50'
          : 'bg-opacity-100 text-black shadow-darkHeader'
      } hidden h-fit lg:flex items-center sticky transition duration-300 z-50 top-0 justify-center w-full leading-none  px-12 pb-4`}
    >
      <div className="flex-col items-center w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex w-[200px] h-[80px] grow items-center basis-0"></div>
          <Link
            className="font-bold flex justify-center items-center"
            to="/"
            prefetch="intent"
          >
            {layout.shop?.brand?.logo && (
              <Image
                className=" h-20 object-contain"
                src={layout.shop.brand.logo.image.url}
                alt="Delics"
                aspectRatio="1"
              ></Image>
            )}
          </Link>
          <div className="flex items-center grow justify-end basis-0">
            <Form
              method="get"
              action={params.locale ? `/${params.locale}/search` : '/search'}
              className="flex items-center gap-2"
            >
              <Input
                className={
                  isHome
                    ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                    : 'focus:border-primary/20'
                }
                type="search"
                variant="minisearch"
                placeholder="Search"
                name="q"
              />
              <button
                type="submit"
                className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
              >
                <IconSearch />
              </button>
            </Form>
            <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
            <CartCount isHome={isHome} openCart={openCart} />
          </div>
        </div>
        <div>
          <nav className="flex gap-12 items-center justify-center">
            {/* Top level menu items */}
            {(menu?.items || []).map((item, index) => {
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  target={item.target}
                  prefetch="intent"
                  className=" font-anton text-lg"
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

function AccountLink({className}) {
  const [root] = useMatches();
  const isLoggedIn = root.data?.isLoggedIn;
  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <IconAccount />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <IconLogin />
    </Link>
  );
}

function CartCount({isHome, openCart}) {
  const [root] = useMatches();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({openCart, dark, count}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary'
          } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({menu}) {
  const isHome = useIsHomePath();
  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`min-h-[25rem] w-full py-8 px-6 md:px-8 lg:px-12 overflow-hidden bg-black`}
    >
      <FooterMenu menu={menu} />
      <div className={`pt-8 opacity-50 text-white`}>
        &copy; {new Date().getFullYear()} / Delics Retail
      </div>
    </Section>
  );
}

function FooterLink({item}) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent" className="hover:text-gray-400 text-white">
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}) {
  const tnclist = ["Terms & Conditions","Priavcy Policy","Refund Policy"]
  const helplist = ["Contact Us"]
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      <section className='flex flex-row gap-4 justify-evenly items-stretch flex-wrap pt-10'>
        <div className="flex flex-col gap-1">
          <h2 className='text-lg font-bold w-auto text-white'>T&C</h2>
          {menu.items
            .filter((item) => tnclist.includes(item.title))
            .map((item) => (
              <FooterLink item={item} key={item.id}/>
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className='text-lg font-bold text-white'>Care For You</h2>
          {menu.items
            .filter((item) => helplist.includes(item.title))
            .map((item) => (
              <FooterLink item={item} key={item.id} />
            ))}
        </div>
      </section>
    </>
  );
}
