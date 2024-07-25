import {useParams, Form, Await, useMatches} from '@remix-run/react';
import {useWindowScroll} from 'react-use';
import {Suspense, useEffect, useMemo} from 'react';
import {Image, CartForm} from '@shopify/hydrogen';

import {Loading} from '~/components/Loading';
import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  IconMenu,
  Cart,
  CartLoading,
  Link,
} from '~/components';
import {useIsHomePath} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';

export async function loader({params, context}) {
  const {shop} = await context.storefront.query(ANNOUNCEMENT_QUERY);

  return defer({
    shop,
  });
}

export function Layout({children, layout}) {
  const {headerMenu, footerMenu} = layout;
  useEffect(() => {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
  }, []);
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <Loading />
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

function AnnouncementBar({isHome}) {
  const {y} = useWindowScroll();
  return (
    <div
      className={`announcement-bar w-full h-fit p-1 text-center font-bold text-sm transition duration-300 ${
        y < 10 && isHome
          ? ' bg-none text-white'
          : 'opacity-100 text-white bg-black'
      }`}
    >
      FREE SHIPPING ABOVE MYR 300
    </div>
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
              isActive
                ? 'pb-1 border-b -mb-px font-intrepid'
                : 'pb-1 font-nimbus'
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
      className="flex lg:hidden sticky top-0 flex-col z-50 h-auto"
    >
      <div
        className={`${
          isHome
            ? 'bg-white hover:bg-opacity-100 hover:text-blacks'
            : 'bg-white text-black shadow-darkHeader'
        } ${
          isHome && y < 10
            ? 'bg-opacity-0 text-white border-b border-b-white border-opacity-50'
            : 'bg-opacity-100 text-black shadow-darkHeader'
        }
      flex items-center justify-between w-full leading-none gap-4 px-4 md:px-8 transition duration-300 p-4`}
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
            className=" w-auto h-[30px] object-contain"
            src={layout.shop.brand.logo.image.url}
            alt="Delics"
            aspectRatio="3/1"
          ></Image>
        </Link>

        <div className="flex items-center justify-end w-full gap-4">
          <AccountLink className="relative flex items-center justify-center w-8 h-8" />
          <CartCount isHome={isHome} openCart={openCart} />
        </div>
      </div>
      <AnnouncementBar isHome={isHome} />
    </header>
  );
}

function DesktopHeader({isHome, menu, openCart, layout}) {
  const params = useParams();
  const {y} = useWindowScroll();

  return (
    <header className="hidden lg:flex flex-col sticky z-50 top-0">
      <div
        role="banner"
        className={`${
          isHome
            ? 'bg-white hover:bg-opacity-100 hover:text-black'
            : 'bg-white text-black'
        } ${
          isHome && y < 10
            ? 'bg-opacity-0 text-white border-b border-b-white border-opacity-50 hover:text-black'
            : 'bg-opacity-100 text-black'
        } items-center transition duration-300  justify-center w-full leading-none  px-12`}
      >
        <div className="flex-col items-center w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex w-[200px] h-[80px] grow items-center basis-0"></div>
            <Link
              className="font-bold flex justify-center items-center h-10"
              to="/"
              prefetch="intent"
            >
              {layout.shop?.brand?.logo && (
                <Image
                  className=" h-10 object-contain"
                  src={layout.shop.brand.logo.image.url}
                  alt="Delics"
                  aspectRatio="3/1"
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
          <div className="py-1">
            <nav className="flex gap-12 items-center justify-center pt-2">
              {/* Top level menu items */}
              {(menu?.items || []).map((item, index) => {
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    target={item.target}
                    prefetch="intent"
                    className=" font-nimubs text-[1rem] font-bold "
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      <AnnouncementBar isHome={isHome} />
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
    <Suspense fallback={<Badge count={0} openCart={openCart} />}>
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <Badge
            openCart={openCart}
            count={cart?.totalQuantity || 0}
            dark={isHome}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({openCart, dark, count}) {
  const isHydrated = useIsHydrated();
  const {y} = useWindowScroll();
  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark && y < 10 ? 'text-black bg-white' : 'text-white bg-black'
          } transition duration-300 absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, y, dark],
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
  return (
    <footer
      className={`h-fit w-full py-4 px-8 overflow-hidden bg-black border-t-[1px] border-t-gray-800`}
    >
      <FooterMenu menu={menu} />
      <div className={`opacity-50 text-white text-center py-4`}>
        &copy; {new Date().getFullYear()} / Delics Retail
      </div>
      <ul className="list-disc py-2 mx-auto text-center">
        <li className="bg-white inline-block rounded mx-1">
          <svg
            viewBox="0 0 38 24"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            width="38"
            height="24"
            aria-labelledby="pi-visa"
          >
            <title id="pi-visa">Visa</title>
            <path
              opacity=".07"
              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
            ></path>
            <path
              fill="#fff"
              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
            ></path>
            <path
              d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
              fill="#142688"
            ></path>
          </svg>
        </li>
        <li className="bg-white inline-block rounded mx-1">
          <svg
            viewBox="0 0 38 24"
            xmlns="http://www.w3.org/2000/svg"
            width="38"
            height="24"
            role="img"
            aria-labelledby="pi-paypal"
          >
            <title id="pi-paypal">PayPal</title>
            <path
              opacity=".07"
              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
            ></path>
            <path
              fill="#fff"
              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
            ></path>
            <path
              fill="#003087"
              d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"
            ></path>
            <path
              fill="#3086C8"
              d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"
            ></path>
            <path
              fill="#012169"
              d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"
            ></path>
          </svg>
        </li>
        <li className="bg-white inline-block rounded mx-1">
          <svg
            viewBox="0 0 38 24"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            width="38"
            height="24"
            aria-labelledby="pi-master"
          >
            <title id="pi-master">Mastercard</title>
            <path
              opacity=".07"
              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
            ></path>
            <path
              fill="#fff"
              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
            ></path>
            <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
            <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
            <path
              fill="#FF5F00"
              d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
            ></path>
          </svg>
        </li>
        <li className="bg-white inline-block rounded mx-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            id="Layer_1"
            x={0}
            y={0}
            role="img"
            width="38"
            height="24"
            style={{
              enableBackground: 'new 0 0 595.28 602.45',
            }}
            viewBox="0 0 595.28 602.45"
          >
            <style>{'.st0{fill:#f3f6f4} .st2{fill:#fddb00}'}</style>
            <g id="eWallet_RGB_1_">
              <g id="eWallet_8_">
                <path
                  d="M454.52 13.03H140.58C68.32 13.03 9.52 71.82 9.52 144.09v313.93c0 72.27 58.8 131.06 131.06 131.06h313.94c72.27 0 131.05-58.8 131.05-131.06V144.09c0-72.27-58.78-131.06-131.05-131.06"
                  style={{
                    fill: '#fff',
                  }}
                />
                <path
                  d="M455.49 35.39H139.62c-59.41 0-107.74 48.33-107.74 107.73v315.87c0 59.41 48.33 107.73 107.74 107.73h315.87c59.39 0 107.73-48.33 107.73-107.73V143.12c0-59.4-48.34-107.73-107.73-107.73"
                  style={{
                    fill: '#295daa',
                  }}
                />
                <path
                  d="M242.42 255.3H214.9c-8.07 0-18.53 5.71-21.55 13.31l2.76-14.57h-33.63l-14.94 83.77h33.67l9.3-53.03h36.22s-4.63 26.26-6.69 38.02c-2.06 11.76 5.93 14.62 9.87 14.62h17.61L259 272.27c-.95-9.34-7.25-16.97-16.58-16.97M138.24 254.04l-6.32 35.95 25.58-35.95zM178.17 122.83H65.54l-4.89 27.76h39.31l-15.75 89.44h33.91l15.83-89.44h39.32z"
                  style={{
                    fill: '#fff',
                  }}
                />
                <path
                  d="m201.47 212.57 4.94-27.99h-30.18l-4.91 27.99h30.15m-47.54 27.46c-9.33 0-15.61-7.64-13.97-16.98l8.66-48.98c1.62-9.33 10.63-16.97 19.93-16.97h55.22c9.33 0 15.63 7.64 13.93 16.97l-8.6 48.98c-1.66 9.34-10.64 16.98-19.96 16.98h-55.21zM376.07 212.57l4.95-27.99h43.71l4.85-27.46h-56.23c-9.33 0-18.36 7.62-19.99 16.95l-8.63 48.98c-1.65 9.34 4.64 16.97 14 16.97h54.67l4.82-27.45h-42.15zM307.34 212.57h-37l9.76-55.46h-29.48l-11.59 65.94c-1.65 9.34 4.63 16.97 13.96 16.97h28.74c9.33 0 16.96-5.55 22.99-12.73 0 0 3.29 9.6 8.02 11.75 4.76 2.18 19.14 1.67 19.14 1.67l14.76-83.59h-29.5l-9.8 55.45zM519.91 157.52h-27.5c-8.09 0-15.9 5.72-18.93 13.31l7.92-45.04h-31l-20.14 114.23h31.03l9.33-53.01h33.63s-4.62 26.24-6.68 38.02c-2.08 11.73 5.93 14.61 9.82 14.61h15.02l11.48-65.15c1.63-9.34-4.64-16.97-13.98-16.97M409.37 365.68c-12.54 0-21-10.32-18.81-22.85l11.63-65.84c2.19-12.58 14.3-22.85 26.89-22.85h70.24c12.51 0 21.02 10.27 18.8 22.85l-11.62 65.84c-2.22 12.52-14.31 22.85-26.86 22.85h-70.27m65.44-30.78 8.86-49.99h-49.79l-8.84 49.99h49.77zM341.26 334.9h-49.83l8.83-49.99h80.77l5.33-30.78h-90.88c-12.58 0-24.64 10.27-26.85 22.85L257 342.82c-2.2 12.52 6.23 22.85 18.79 22.85h70.28c12.57 0 24.67-10.32 26.86-22.85l7.11-40.41h-33.08l-5.7 32.49z"
                  style={{
                    fill: '#fff',
                  }}
                />
                <path
                  d="m272.26 405.14-42.33 87.25h-26.86l-3.19-52.81-25.64 52.81h-27.01l-5.16-87.25h19.12l3.34 68.43 32.93-68.43h19.42l3.34 68.43 32.93-68.43h19.11zM352.22 492.39h-18.66l18.51-87.25h18.66l-18.51 87.25zM382.87 492.39h-18.66l18.51-87.25h18.66l-18.51 87.25zM511.85 492.39h-15.02c-6.98 0-11.83-.68-14.57-2.05-2.73-1.37-4.1-4.12-4.1-8.27 0-2.33.35-5.06 1.06-8.19l14.57-68.74h18.66l-4.7 21.7h18.06l-3.49 15.78h-17.75l-5.31 24.89c-.51 2.53-.76 4.2-.76 5.01 0 1.72.58 2.83 1.74 3.34 1.16.51 3.51.76 7.06.76h7.89l-3.34 15.77z"
                  className="st2"
                />
                <path
                  d="m272.26 405.14-42.33 87.25h-26.86l-3.19-52.81-25.64 52.81h-27.01l-5.16-87.25h19.12l3.34 68.43 32.93-68.43h19.42l3.34 68.43 32.93-68.43h19.11zM352.22 492.39h-18.66l18.51-87.25h18.66l-18.51 87.25zM382.87 492.39h-18.66l18.51-87.25h18.66l-18.51 87.25zM511.85 492.39h-15.02c-6.98 0-11.83-.68-14.57-2.05-2.73-1.37-4.1-4.12-4.1-8.27 0-2.33.35-5.06 1.06-8.19l14.57-68.74h18.66l-4.7 21.7h18.06l-3.49 15.78h-17.75l-5.31 24.89c-.51 2.53-.76 4.2-.76 5.01 0 1.72.58 2.83 1.74 3.34 1.16.51 3.51.76 7.06.76h7.89l-3.34 15.77z"
                  className="st2"
                />
                <path
                  d="m272.26 405.14-42.33 87.25h-26.86l-3.19-52.81-25.64 52.81h-27.01l-5.16-87.25h19.12l3.34 68.43 32.93-68.43h19.42l3.34 68.43 32.93-68.43h19.11zM352.22 492.39h-18.66l18.51-87.25h18.66l-18.51 87.25zM382.87 492.39h-18.66l18.51-87.25h18.66l-18.51 87.25zM511.85 492.39h-15.02c-6.98 0-11.83-.68-14.57-2.05-2.73-1.37-4.1-4.12-4.1-8.27 0-2.33.35-5.06 1.06-8.19l14.57-68.74h18.66l-4.7 21.7h18.06l-3.49 15.78h-17.75l-5.31 24.89c-.51 2.53-.76 4.2-.76 5.01 0 1.72.58 2.83 1.74 3.34 1.16.51 3.51.76 7.06.76h7.89l-3.34 15.77zM130.43 428.81c-2.73-1.42-7.59-2.12-14.57-2.12h-26.7c-7.69 0-13.53 1.44-17.53 4.32-4 2.88-6.7 7.66-8.12 14.34l-5.92 28.38a53.39 53.39 0 0 0-.91 4.63c-.2 1.37-.3 2.61-.3 3.72 0 2.03.3 3.67.91 4.93.61 1.27 1.62 2.3 3.03 3.11 1.42.81 3.34 1.36 5.77 1.67 2.43.3 5.46.46 9.1.46h45.37l3.34-15.63H85.67c-3.54 0-5.89-.28-7.06-.83-1.16-.56-1.74-1.69-1.74-3.42 0-1.21.2-2.83.61-4.85l.01-.05h7.89l-.01.05h43.4l4.7-22.15c.71-3.24 1.06-6.02 1.06-8.35 0-4.06-1.37-6.79-4.1-8.21zm-16.39 22.91H93.18v-.02H80.81c.4-2.01.88-3.63 1.44-4.84.56-1.21 1.26-2.15 2.13-2.81.86-.66 1.97-1.09 3.34-1.29 1.37-.2 3.06-.3 5.08-.3h14.87c4.86 0 7.28 1.52 7.28 4.55 0 .31-.3 1.88-.91 4.71zM330.9 431.99c-.66-1.31-1.72-2.35-3.19-3.11-1.46-.76-3.39-1.29-5.76-1.59-2.38-.3-5.34-.46-8.88-.46h-45.22l-3.34 15.78h38.24c3.54 0 5.89.25 7.06.76 1.16.51 1.75 1.62 1.75 3.34 0 .81-.25 2.47-.76 4.99h-14.95v.02h-14.64c-4.35 0-7.97.23-10.85.68-2.88.45-5.29 1.34-7.21 2.65-1.92 1.32-3.44 3.19-4.55 5.62-1.11 2.43-2.12 5.61-3.03 9.56l-.76 3.64c-.71 3.14-1.06 5.87-1.06 8.19 0 2.12.33 3.85.99 5.16.66 1.32 1.72 2.35 3.19 3.11 1.46.76 3.39 1.29 5.77 1.59 2.38.3 5.33.46 8.88.46h48.25l10.02-47.04c.7-3.13 1.06-5.86 1.06-8.19-.02-2.12-.35-3.84-1.01-5.16zm-53.48 44.62c-2.73 0-4.1-1.16-4.1-3.49 0-1.42.55-2.71 1.67-3.87 1.11-1.16 2.58-1.75 4.4-1.75h20.18l.01-.05h7.86l-1.95 9.15h-28.07zM471.34 428.81c-2.73-1.42-7.59-2.12-14.57-2.12h-26.71c-7.69 0-13.53 1.44-17.53 4.32-4 2.88-6.7 7.66-8.12 14.34l-5.92 28.38a53.39 53.39 0 0 0-.91 4.63c-.2 1.37-.3 2.61-.3 3.72 0 2.03.3 3.67.91 4.93.61 1.27 1.62 2.3 3.03 3.11 1.42.81 3.34 1.36 5.77 1.67 2.43.3 5.46.46 9.11.46h45.37l3.34-15.63h-38.24c-3.54 0-5.9-.28-7.06-.83-1.16-.56-1.75-1.69-1.75-3.42 0-1.21.2-2.83.61-4.85l.01-.05h7.89l-.01.05h43.4l4.7-22.15c.71-3.24 1.06-6.02 1.06-8.35.01-4.06-1.35-6.79-4.08-8.21zm-16.39 22.91H435.3v-.02h-13.58c.4-2.01.88-3.63 1.44-4.84.55-1.21 1.26-2.15 2.12-2.81.86-.66 1.97-1.09 3.34-1.29 1.37-.2 3.06-.3 5.08-.3h14.87c4.85 0 7.28 1.52 7.28 4.55.01.31-.29 1.88-.9 4.71z"
                  className="st2"
                />
              </g>
            </g>
          </svg>
        </li>
        <li className="bg-white inline-block rounded mx-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            id="layer"
            x={0}
            y={0}
            role="img"
            width="38"
            height="24"
            style={{
              enableBackground: 'new 0 0 652 652',
            }}
            viewBox="0 0 652 652"
          >
            <style>{'.st0{fill:#ee3124}'}</style>
            <path
              d="M167.3 332.3c-4.1-8-11.2-13-21.1-15-.8-.2-1.6-.2-2.4-.3l-1.1-.1c-.7-.1-1.6-.2-3.1-.2H122.7v-16c0-2.1-.1-3.2-.2-4l-.1-1.1c-.1-.8-.2-1.7-.3-2.4-2-9.9-7-17.1-15-21.1-6.1-3.1-11.7-3.2-11.8-3.2h-.9c-1.6 0-2.7.1-4.1.3-26.2 3.5-25.9 28.7-25.8 29.7v46.6c0 9.4 2.6 16.8 7.6 22 5.2 5 12.6 7.5 21.9 7.5h46.9c2.6 0 26.1-.7 29.5-25.8.2-1.6.3-2.9.3-5-.1-.1-.2-5.7-3.4-11.9"
              className="st0"
            />
            <path
              d="M183.5 371.4c-8.2 15.3-24.9 20.8-29.8 22.1-2.9.8-5.4 1.1-10.1 1.4H87.4s-3.8 0-7.7-1c-2.7-.7-6.1-1.8-8.9-3-3.3-1.5-7.1-3.6-12.3-8.8l-.8-.8c-4.1-4.2-8.1-10.1-10.1-15.1-1.1-2.8-1.5-4.2-2.1-6.9-.9-3.7-.9-7.7-.9-8v-55.4c.3-4.8.7-7.4 1.4-10.2 1.3-4.9 6.7-21.6 22.1-29.8 8.7-4.9 17.6-7.4 26.5-7.4 13.7 0 22.7 6 23 6.3 24.2 14.6 24.9 38.7 24.9 42.1 3.5-.1 27.5.6 42.2 25.1.1 0 14.6 21.3-1.2 49.4m-2.6-144.1h-132c-15.6 0-28.3 12.7-28.3 28.3v131.9c0 15.6 12.7 28.3 28.3 28.3h131.9c15.6 0 28.3-12.7 28.3-28.3V255.7c.1-15.7-12.6-28.4-28.2-28.4M598.3 273.2h-6.1v15.9h-3.7v-15.9h-6.1v-3.3h15.9zM616.9 289.1v-12.7l-5 9.4h-2l-4.9-9.4v12.7h-3.7v-19.2h4l5.6 10.9 5.7-10.9h4v19.2zM268.4 317.3c-3.8 0-7.3.8-10.7 2.5-3.4 1.7-6.3 3.9-8.8 6.7-2.5 2.8-4.5 6.2-6 10s-2.2 8-2.2 12.3c0 4.5.7 8.7 2.1 12.4 1.4 3.8 3.4 7.1 5.8 9.8 2.5 2.8 5.4 5 8.8 6.5 3.3 1.6 7 2.4 10.9 2.4 3.9 0 7.5-.8 10.9-2.4 3.3-1.6 6.3-3.8 8.8-6.6 2.5-2.8 4.4-6.2 5.8-9.9 1.4-3.8 2.1-8 2.1-12.4s-.7-8.5-2.1-12.3c-1.4-3.8-3.4-7.2-5.8-10-2.5-2.8-5.4-5.1-8.8-6.6-3.3-1.6-7-2.4-10.8-2.4m0 80.5c-7.5 0-14.3-1.3-20.2-4-6-2.6-11.1-6.3-15.3-10.7-4.2-4.5-7.5-9.7-9.8-15.7-2.3-6-3.4-12.3-3.4-18.8s1.1-12.8 3.4-18.8 5.6-11.3 9.9-15.7c4.3-4.5 9.5-8.1 15.4-10.7 6-2.6 12.7-4 20.1-4 7.3 0 14.1 1.4 20.1 4 6 2.6 11.2 6.3 15.4 10.7 4.3 4.5 7.6 9.7 9.9 15.7 2.3 6 3.5 12.3 3.5 18.8s-1.2 12.8-3.5 18.8-5.6 11.3-9.9 15.7c-4.3 4.5-9.5 8.1-15.4 10.7-6.1 2.7-12.9 4-20.2 4M376.2 317.3c-3.8 0-7.3.8-10.7 2.5-3.4 1.7-6.3 3.9-8.8 6.7-2.5 2.8-4.5 6.2-6 10s-2.2 8-2.2 12.3c0 4.5.7 8.7 2.1 12.4 1.4 3.8 3.4 7.1 5.8 9.8 2.5 2.8 5.4 5 8.8 6.5 3.3 1.6 7 2.4 10.9 2.4 3.9 0 7.5-.8 10.9-2.4 3.3-1.6 6.3-3.8 8.8-6.6 2.5-2.8 4.5-6.2 5.9-9.9 1.4-3.8 2.1-8 2.1-12.4s-.7-8.5-2.1-12.3c-1.4-3.8-3.4-7.2-5.9-10-2.5-2.8-5.4-5.1-8.8-6.6-3.3-1.6-6.9-2.4-10.8-2.4m0 80.5c-7.5 0-14.3-1.3-20.2-4-6-2.6-11.1-6.3-15.3-10.7-4.2-4.5-7.5-9.7-9.8-15.7-2.3-6-3.4-12.3-3.4-18.8s1.1-12.8 3.4-18.8 5.6-11.3 9.9-15.7c4.3-4.5 9.5-8.1 15.4-10.7 6-2.6 12.7-4 20.1-4 7.3 0 14.1 1.4 20.1 4 6 2.6 11.2 6.3 15.4 10.7 4.3 4.5 7.6 9.7 9.9 15.7 2.3 6 3.5 12.3 3.5 18.8s-1.2 12.8-3.5 18.8-5.6 11.3-9.9 15.7c-4.3 4.5-9.5 8.1-15.4 10.7-6.1 2.7-12.9 4-20.2 4M475.6 397.8c-3.8 0-7.8-.3-11.7-.9-3.9-.6-7.8-1.5-11.6-2.6s-7.4-2.5-10.9-4.2c-3.4-1.6-6.5-3.5-9.2-5.5l-.3-.3 8.7-14 .4.3c11.4 7.9 22.8 12 34.1 12 5.9 0 10.6-1.1 14-3.3 3.4-2.2 5-5.3 5-9.3 0-3.8-1.8-6.5-5.6-8.3-3.9-1.8-10.1-3.8-18.5-5.8-5.9-1.4-11-2.9-15.2-4.4-4.2-1.5-7.7-3.2-10.4-5.1-2.7-1.9-4.7-4.2-5.9-6.8-1.2-2.6-1.8-5.8-1.8-9.4 0-4.8 1-9.2 2.9-13 1.9-3.8 4.6-7 7.9-9.6 3.3-2.6 7.3-4.6 11.8-5.9 4.5-1.3 9.4-2 14.6-2 6.8 0 13.6 1.1 19.9 3.3 6.4 2.2 12.2 5.1 17.2 8.9l.4.3-9 12.8-.4-.3c-8.9-6.6-18.5-10-28.5-10-4.9 0-9.1 1-12.5 3.1-3.4 2-5 5.2-5 9.6 0 1.8.3 3.4 1 4.6.7 1.2 1.8 2.3 3.3 3.2 1.6.9 3.7 1.8 6.3 2.6 2.6.8 5.9 1.6 9.7 2.6 6.4 1.6 12.1 3.1 16.8 4.7 4.7 1.6 8.6 3.4 11.7 5.5 3.1 2.1 5.4 4.7 6.9 7.6 1.5 2.9 2.2 6.3 2.2 10.4 0 4.5-.9 8.6-2.7 12.2-1.8 3.6-4.4 6.8-7.8 9.3-3.3 2.5-7.4 4.5-12.2 5.9-4.5 1.1-9.8 1.8-15.6 1.8M557.6 397.5c-3.1 0-6.1-.4-8.9-1.3-2.7-.8-5.2-2.1-7.3-3.9-2.1-1.7-3.9-4-5.1-6.7-1.2-2.7-1.8-6.1-1.8-10v-58.4h-12.6V301h12.6v-30.9h20.7V301h20.5v16.2h-20.5v52.1c0 3.2.9 5.5 2.7 6.9 1.8 1.4 4.1 2.2 6.7 2.2 2.7 0 5.3-.5 7.8-1.4 2.5-.9 4.4-1.7 5.5-2.3l.5-.2L583 391l-.4.2c-2.6 1.2-6.2 2.6-10.6 4.1-4.4 1.4-9.2 2.2-14.4 2.2"
              className="st0"
            />
          </svg>
        </li>
        <li className="bg-white inline-block rounded mx-1">
          <svg
            role="img"
            width="38"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="90 75 100 150"
          >
            <defs>
              <style>{'.cls-1{fill:#252c57}'}</style>
            </defs>
            <title>{'FPX Logo'}</title>
            <path
              d="M60.22 181.44a5.17 5.17 0 0 1 .38-2.05 4.38 4.38 0 0 1 1-1.56 4.86 4.86 0 0 1 1.62-1 6.26 6.26 0 0 1 4.07 0 4.81 4.81 0 0 1 1.61 1 4.54 4.54 0 0 1 1.1 1.56 5.72 5.72 0 0 1 0 4.1 4.5 4.5 0 0 1-2.66 2.51 6.09 6.09 0 0 1-4.07 0 4.68 4.68 0 0 1-1.62-1 4.47 4.47 0 0 1-1-1.56 5.17 5.17 0 0 1-.38-2.05m2.15 0a3.43 3.43 0 0 0 .21 1.22 2.92 2.92 0 0 0 .59 1 2.73 2.73 0 0 0 .93.63 3.27 3.27 0 0 0 2.41 0 2.69 2.69 0 0 0 1.44-1.58 3.62 3.62 0 0 0 0-2.43 2.67 2.67 0 0 0-.59-1 2.6 2.6 0 0 0-.92-.63 3.27 3.27 0 0 0-2.41 0 2.73 2.73 0 0 0-.93.63 3 3 0 0 0-.59 1 3.42 3.42 0 0 0-.21 1.21M71.54 179.68h1.92v.88a1.67 1.67 0 0 1 .26-.37 1.7 1.7 0 0 1 .42-.33 2.69 2.69 0 0 1 .54-.25 2.41 2.41 0 0 1 .67-.09 2.67 2.67 0 0 1 1.22.24 1.75 1.75 0 0 1 .73.64 2.67 2.67 0 0 1 .35 1 7.73 7.73 0 0 1 .09 1.21v3.57h-2V182.42a2.44 2.44 0 0 0-.12-.55 1 1 0 0 0-.31-.41.92.92 0 0 0-.59-.16 1.28 1.28 0 0 0-.63.14.91.91 0 0 0-.36.37 1.5 1.5 0 0 0-.17.53 5.86 5.86 0 0 0 0 .61v3.22h-2ZM79.21 176.09h2v10.06h-2zM82.51 177.65a1.09 1.09 0 0 1 .34-.82 1.16 1.16 0 0 1 1.64 0 1.13 1.13 0 0 1 .34.82 1.16 1.16 0 0 1-2 .81 1.07 1.07 0 0 1-.34-.81m.16 2h2v6.47h-2ZM86.11 179.68H88v.88a1.45 1.45 0 0 1 .27-.37 1.49 1.49 0 0 1 .41-.33 2.69 2.69 0 0 1 .54-.25 2.41 2.41 0 0 1 .67-.09 2.67 2.67 0 0 1 1.22.24 1.75 1.75 0 0 1 .73.64 2.67 2.67 0 0 1 .35 1 7.69 7.69 0 0 1 .1 1.21v3.57h-2V182.42a1.69 1.69 0 0 0-.12-.55 1 1 0 0 0-.31-.41.92.92 0 0 0-.59-.16 1.28 1.28 0 0 0-.63.14.91.91 0 0 0-.36.37 1.5 1.5 0 0 0-.17.53 5.86 5.86 0 0 0 0 .61v3.22h-2ZM99.87 185a3.15 3.15 0 0 1-1.21.95 3.68 3.68 0 0 1-1.52.33 4 4 0 0 1-1.4-.24 3.47 3.47 0 0 1-1.15-.68 3.2 3.2 0 0 1-.76-1.08 3.29 3.29 0 0 1-.28-1.39 3.33 3.33 0 0 1 .28-1.4 3.16 3.16 0 0 1 .76-1.07 3.33 3.33 0 0 1 1.15-.69 4 4 0 0 1 1.4-.24 3.22 3.22 0 0 1 1.26.24 2.65 2.65 0 0 1 1 .69 3.1 3.1 0 0 1 .6 1.07 4.37 4.37 0 0 1 .22 1.4v.62h-4.68a1.6 1.6 0 0 0 .52.91 1.64 1.64 0 0 0 1.82.12 2.23 2.23 0 0 0 .59-.56Zm-1.69-2.85a1.15 1.15 0 0 0-.33-.86A1.19 1.19 0 0 0 97 181a1.34 1.34 0 0 0-.58.11 1.43 1.43 0 0 0-.43.27 1.08 1.08 0 0 0-.28.39 1.16 1.16 0 0 0-.12.45ZM105.58 176.73h3.51a10.16 10.16 0 0 1 1.23.08 3.5 3.5 0 0 1 1.12.35 2.13 2.13 0 0 1 .79.73 2.16 2.16 0 0 1 .31 1.23 2 2 0 0 1-.45 1.33 2.43 2.43 0 0 1-1.17.75 2.5 2.5 0 0 1 .84.26 2.1 2.1 0 0 1 .65.49 2 2 0 0 1 .42.7 2.37 2.37 0 0 1 .15.85 2.26 2.26 0 0 1-.32 1.24 2.54 2.54 0 0 1-.82.81 3.81 3.81 0 0 1-1.14.44 6 6 0 0 1-1.26.13h-3.86Zm2.08 3.76h1.5a1.83 1.83 0 0 0 .47-.05 1.13 1.13 0 0 0 .42-.17.84.84 0 0 0 .3-.32.9.9 0 0 0 .11-.48.91.91 0 0 0-.12-.49 1 1 0 0 0-.33-.3 1.49 1.49 0 0 0-.45-.15 2.81 2.81 0 0 0-.49-.05h-1.41Zm0 3.9h1.86a2 2 0 0 0 .48 0 1.29 1.29 0 0 0 .45-.18 1.23 1.23 0 0 0 .33-.35 1.05 1.05 0 0 0 .12-.52.85.85 0 0 0-.16-.54 1 1 0 0 0-.42-.31 2.34 2.34 0 0 0-.55-.15 3.44 3.44 0 0 0-.54 0h-1.57ZM118 185.34a2 2 0 0 1-.89.75 3.08 3.08 0 0 1-1.17.22 2.82 2.82 0 0 1-.87-.13 2.17 2.17 0 0 1-.74-.38 1.69 1.69 0 0 1-.5-.62 1.86 1.86 0 0 1-.19-.87 2 2 0 0 1 .21-.94 1.82 1.82 0 0 1 .56-.64 2.59 2.59 0 0 1 .8-.39 5.83 5.83 0 0 1 .94-.21c.32 0 .65-.07 1-.08h.9a1.05 1.05 0 0 0-.38-.85 1.4 1.4 0 0 0-.9-.31 1.89 1.89 0 0 0-.89.21 2.2 2.2 0 0 0-.73.56l-1.15-1.1a3.93 3.93 0 0 1 1.31-.78 4.74 4.74 0 0 1 1.54-.26 4.21 4.21 0 0 1 1.45.22 2.08 2.08 0 0 1 .9.65 2.31 2.31 0 0 1 .47 1 6.72 6.72 0 0 1 .14 1.43v3.29H118Zm-.49-2h-.57a2.85 2.85 0 0 0-.65.11 1.41 1.41 0 0 0-.53.28.63.63 0 0 0-.22.52.57.57 0 0 0 .3.53 1.25 1.25 0 0 0 .64.17 1.79 1.79 0 0 0 .57-.08 2 2 0 0 0 .49-.22 1 1 0 0 0 .33-.38 1 1 0 0 0 .13-.53v-.42ZM121.1 179.68h1.9v.88a1.45 1.45 0 0 1 .27-.37 1.49 1.49 0 0 1 .41-.33 2.54 2.54 0 0 1 .55-.25 2.29 2.29 0 0 1 .66-.09 2.69 2.69 0 0 1 1.23.24 1.73 1.73 0 0 1 .72.64 2.5 2.5 0 0 1 .35 1 6.66 6.66 0 0 1 .1 1.21v3.57h-2V182.42a1.69 1.69 0 0 0-.12-.55.85.85 0 0 0-.9-.57 1.24 1.24 0 0 0-.62.14.94.94 0 0 0-.37.37 1.74 1.74 0 0 0-.17.53 5.93 5.93 0 0 0 0 .61v3.22h-2ZM128.74 176.09h2v6.15l2.21-2.56h2.44l-2.57 2.92 2.64 3.55h-2.51l-2.19-3.27h-.02v3.27h-2v-10.06zM136 177.65a1.09 1.09 0 0 1 .34-.82 1.07 1.07 0 0 1 .81-.34 1.16 1.16 0 0 1 1.16 1.16 1.07 1.07 0 0 1-.34.81 1.09 1.09 0 0 1-.82.34 1.16 1.16 0 0 1-1.15-1.15m.16 2h2v6.47h-2ZM139.6 179.68h1.92v.88a1.74 1.74 0 0 1 .27-.37 1.49 1.49 0 0 1 .41-.33 2.54 2.54 0 0 1 .55-.25 2.29 2.29 0 0 1 .66-.09 2.69 2.69 0 0 1 1.23.24 1.73 1.73 0 0 1 .72.64 2.68 2.68 0 0 1 .36 1 7.73 7.73 0 0 1 .09 1.21v3.57h-2V182.42a1.69 1.69 0 0 0-.12-.55.85.85 0 0 0-.9-.57 1.26 1.26 0 0 0-.62.14 1 1 0 0 0-.37.37 1.49 1.49 0 0 0-.16.53 4 4 0 0 0 0 .61v3.22h-2ZM154 185.61a3.81 3.81 0 0 1-.93 2.78 3.72 3.72 0 0 1-2.81 1 7.54 7.54 0 0 1-1.71-.2 3.88 3.88 0 0 1-1.54-.75l1.1-1.65a4.08 4.08 0 0 0 1 .61 2.78 2.78 0 0 0 1.13.23 1.8 1.8 0 0 0 1.35-.45A1.54 1.54 0 0 0 152 186v-.62a2 2 0 0 1-.86.66 2.77 2.77 0 0 1-1 .19 3.21 3.21 0 0 1-1.3-.25 2.84 2.84 0 0 1-1-.69 3 3 0 0 1-.64-1.06 3.92 3.92 0 0 1 0-2.59 3.3 3.3 0 0 1 .58-1.08 2.85 2.85 0 0 1 .93-.75 2.61 2.61 0 0 1 1.24-.29 2.78 2.78 0 0 1 .78.1 2.94 2.94 0 0 1 .63.24 2.36 2.36 0 0 1 .48.32 1.66 1.66 0 0 1 .31.36v-.86H154Zm-5-2.73a1.53 1.53 0 0 0 .12.6 1.57 1.57 0 0 0 .34.51 1.61 1.61 0 0 0 .5.35 1.45 1.45 0 0 0 .63.13 1.48 1.48 0 0 0 .63-.13 1.78 1.78 0 0 0 .51-.35 1.57 1.57 0 0 0 .34-.51 1.53 1.53 0 0 0 .12-.6 1.58 1.58 0 0 0-.12-.61 1.43 1.43 0 0 0-.34-.5 1.82 1.82 0 0 0-.51-.36 1.48 1.48 0 0 0-.63-.13 1.45 1.45 0 0 0-.63.13 1.64 1.64 0 0 0-.5.36 1.43 1.43 0 0 0-.34.5 1.58 1.58 0 0 0-.12.61M159.82 176.73h3.5a6.74 6.74 0 0 1 1.38.13 3.07 3.07 0 0 1 1.14.46 2.27 2.27 0 0 1 .77.88 3 3 0 0 1 .29 1.39 3.14 3.14 0 0 1-.27 1.38 2.24 2.24 0 0 1-.73.9 3.13 3.13 0 0 1-1.1.47 6.75 6.75 0 0 1-1.39.14h-1.52v3.67h-2.07Zm2.07 4h1.39a3.29 3.29 0 0 0 .54-.05 1.58 1.58 0 0 0 .46-.18 1 1 0 0 0 .34-.35 1.12 1.12 0 0 0 .12-.55 1 1 0 0 0-.16-.58 1.1 1.1 0 0 0-.43-.34 1.7 1.7 0 0 0-.58-.15H161.89ZM172 185.34a1.89 1.89 0 0 1-.88.75 3.08 3.08 0 0 1-1.17.22 2.82 2.82 0 0 1-.87-.13 2.17 2.17 0 0 1-.74-.38 1.69 1.69 0 0 1-.5-.62 1.86 1.86 0 0 1-.19-.87 2 2 0 0 1 .21-.94 1.82 1.82 0 0 1 .56-.64 2.59 2.59 0 0 1 .8-.39 5.83 5.83 0 0 1 .94-.21c.32 0 .65-.07 1-.08h.9a1.05 1.05 0 0 0-.38-.85 1.4 1.4 0 0 0-.9-.31 2 2 0 0 0-.9.21 2.27 2.27 0 0 0-.72.56l-1.16-1.1a3.93 3.93 0 0 1 1.31-.78 4.7 4.7 0 0 1 1.54-.26 4.21 4.21 0 0 1 1.45.22 2.08 2.08 0 0 1 .9.65 2.31 2.31 0 0 1 .47 1 6.72 6.72 0 0 1 .14 1.43v3.29H172Zm-.49-2h-.57a2.76 2.76 0 0 0-.65.11 1.41 1.41 0 0 0-.53.28.63.63 0 0 0-.22.52.57.57 0 0 0 .3.53 1.25 1.25 0 0 0 .64.17 1.79 1.79 0 0 0 .57-.08 2 2 0 0 0 .49-.22 1 1 0 0 0 .33-.38 1 1 0 0 0 .13-.53v-.42ZM178.83 187.2c-.14.35-.27.65-.39.92a2.23 2.23 0 0 1-.47.67 2 2 0 0 1-.73.42 4 4 0 0 1-1.16.14 4.7 4.7 0 0 1-1.49-.24l.27-1.64a2.32 2.32 0 0 0 .93.2 1.65 1.65 0 0 0 .54-.07.81.81 0 0 0 .36-.22 1.07 1.07 0 0 0 .23-.34c.06-.13.13-.28.2-.46l.15-.38-2.84-6.52h2.16l1.66 4.28 1.42-4.28h2.05ZM182.5 179.68h1.92v.88a1.45 1.45 0 0 1 .27-.37 1.65 1.65 0 0 1 .41-.33 2.54 2.54 0 0 1 .55-.25 2.29 2.29 0 0 1 .66-.09 2.49 2.49 0 0 1 1.21.28 1.8 1.8 0 0 1 .79.88 2.14 2.14 0 0 1 .84-.89 2.49 2.49 0 0 1 1.21-.27 2.6 2.6 0 0 1 1.1.22 1.87 1.87 0 0 1 .7.6 2.47 2.47 0 0 1 .38.89 5.54 5.54 0 0 1 .11 1.1v3.82h-2v-3.76a1.46 1.46 0 0 0-.19-.78.73.73 0 0 0-.69-.33 1.43 1.43 0 0 0-.58.11 1 1 0 0 0-.37.32 1.29 1.29 0 0 0-.2.46 2.6 2.6 0 0 0-.06.56v3.42h-2v-3.84a1.86 1.86 0 0 0-.09-.48.87.87 0 0 0-.26-.39.76.76 0 0 0-.53-.16 1.26 1.26 0 0 0-.62.14 1 1 0 0 0-.37.37 1.74 1.74 0 0 0-.17.53 5.93 5.93 0 0 0 0 .61v3.22h-2ZM200.2 185a3.15 3.15 0 0 1-1.2 1 3.65 3.65 0 0 1-1.52.33 4.08 4.08 0 0 1-1.4-.24 3.57 3.57 0 0 1-1.15-.68 3.35 3.35 0 0 1-.76-1.08 3.29 3.29 0 0 1-.28-1.39 3.28 3.28 0 0 1 1-2.47 3.43 3.43 0 0 1 1.15-.69 4.08 4.08 0 0 1 1.4-.24 3.18 3.18 0 0 1 1.26.24 2.57 2.57 0 0 1 1 .69 3.29 3.29 0 0 1 .61 1.07 4.38 4.38 0 0 1 .21 1.4v.62h-4.63a1.54 1.54 0 0 0 .52.91 1.43 1.43 0 0 0 1 .34 1.45 1.45 0 0 0 .83-.22 2 2 0 0 0 .59-.56Zm-1.69-2.85a1.15 1.15 0 0 0-.33-.86 1.18 1.18 0 0 0-.89-.36 1.38 1.38 0 0 0-.59.11 1.43 1.43 0 0 0-.43.27 1.21 1.21 0 0 0-.28.39 1.15 1.15 0 0 0-.11.45ZM201.72 179.68h1.92v.88a1.45 1.45 0 0 1 .27-.37 1.49 1.49 0 0 1 .41-.33 2.54 2.54 0 0 1 .55-.25 2.29 2.29 0 0 1 .66-.09 2.69 2.69 0 0 1 1.23.24 1.73 1.73 0 0 1 .72.64 2.68 2.68 0 0 1 .36 1 7.73 7.73 0 0 1 .09 1.21v3.57h-2V182.42a1.69 1.69 0 0 0-.12-.55.85.85 0 0 0-.9-.57 1.24 1.24 0 0 0-.62.14.94.94 0 0 0-.37.37 1.49 1.49 0 0 0-.16.53 4 4 0 0 0 0 .61v3.22h-2ZM213.77 181.28H212v2.64a1.06 1.06 0 0 0 .12.38.6.6 0 0 0 .29.25 1.24 1.24 0 0 0 .51.08h.42a.73.73 0 0 0 .4-.15v1.66a2.84 2.84 0 0 1-.7.16 5.58 5.58 0 0 1-.7 0 4 4 0 0 1-.94-.11 2.17 2.17 0 0 1-.74-.33 1.66 1.66 0 0 1-.5-.61 2.08 2.08 0 0 1-.18-.91v-3.07h-1.28v-1.6h1.3v-1.91h2v1.91h1.76ZM218.44 181.58a1.43 1.43 0 0 0-1.16-.54 1.07 1.07 0 0 0-.49.12.42.42 0 0 0-.24.41.38.38 0 0 0 .24.36 4.29 4.29 0 0 0 .63.2l.81.18a3.16 3.16 0 0 1 .81.31 2.05 2.05 0 0 1 .63.58 1.78 1.78 0 0 1 .24 1 1.81 1.81 0 0 1-.27 1 2 2 0 0 1-.7.65 2.92 2.92 0 0 1-.95.35 5.51 5.51 0 0 1-1.06.1 5 5 0 0 1-1.37-.19 2.57 2.57 0 0 1-1.17-.69l1.21-1.34a1.87 1.87 0 0 0 .62.52 1.67 1.67 0 0 0 .79.18 1.81 1.81 0 0 0 .63-.1.35.35 0 0 0 .28-.36.4.4 0 0 0-.25-.38 2.46 2.46 0 0 0-.62-.22l-.82-.18a3.74 3.74 0 0 1-.81-.3 1.61 1.61 0 0 1-.62-.57 1.66 1.66 0 0 1-.25-1 2 2 0 0 1 .23-1 2.12 2.12 0 0 1 .62-.68 2.66 2.66 0 0 1 .87-.39 4.22 4.22 0 0 1 1-.13 4.53 4.53 0 0 1 1.29.19 2.29 2.29 0 0 1 1.1.67ZM118.57 117.39h25.98v7.87H127.1v7.88h16.14v7.87H127.1v15.1h-8.53v-38.72zM150.68 117.39h14.38a28.67 28.67 0 0 1 5.68.54 13.08 13.08 0 0 1 4.68 1.89 9.51 9.51 0 0 1 3.17 3.61 12.28 12.28 0 0 1 1.18 5.72 13.13 13.13 0 0 1-1.1 5.68 9.3 9.3 0 0 1-3 3.67 12.2 12.2 0 0 1-4.54 1.94 26.83 26.83 0 0 1-5.69.57h-6.23v15.1h-8.53Zm8.53 16.4h5.69a11.43 11.43 0 0 0 2.21-.21 6.08 6.08 0 0 0 1.91-.74 4 4 0 0 0 1.37-1.42 4.49 4.49 0 0 0 .52-2.27 3.8 3.8 0 0 0-.69-2.38 4.43 4.43 0 0 0-1.74-1.4 7.52 7.52 0 0 0-2.38-.63 24.75 24.75 0 0 0-2.52-.13h-4.37ZM194.75 135.87l-12.79-18.48h10.71l8.26 13.56 7.93-13.56h10.34l-12.53 18.32 14 20.4h-10.72l-9.45-15.59-9.19 15.59h-10.12l13.56-20.24z"
              className="cls-1"
            />
            <path
              d="m81.21 148.84-5.4-7.31c-.8-1.09-2.18-2.52-2.18-3.95s1.37-2.87 2.18-4l5.4-7.32a4.11 4.11 0 0 1 .75-.79v-8.42c0-6.77-2.83-8.47-6.29-3.79L64 129.06c-1.73 2.35-4.69 5.43-4.69 8.52s3 6.17 4.69 8.52l11.65 15.75c3.46 4.68 6.29 3 6.29-3.78v-8.43a3.67 3.67 0 0 1-.75-.8"
              style={{
                fill: '#0e86c8',
              }}
            />
            <path
              d="M104.09 129.06 92.44 113.3c-3.46-4.69-6.29-3-6.29 3.79v8.42a3.82 3.82 0 0 1 .74.79l5.41 7.32c.81 1.09 2.18 2.53 2.18 4s-1.37 2.86-2.18 3.95l-5.41 7.31a4 4 0 0 1-.74.81v8.42c0 6.78 2.83 8.46 6.29 3.78l11.65-15.75c1.73-2.36 4.69-5.45 4.69-8.53s-3-6.16-4.69-8.51"
              className="cls-1"
            />
          </svg>
        </li>
      </ul>
    </footer>
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
    <Link
      to={item.to}
      target={item.target}
      prefetch="intent"
      className="hover:text-gray-400 text-white"
    >
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}) {
  const tnclist = ['Terms & Conditions', 'Priavcy Policy', 'Refund Policy'];
  const helplist = ['Contact Us', 'Sustainability & Ethicality'];
  const aboutlist = ['About Us', 'Our Community'];

  return (
    <>
      <section className="flex flex-row gap-10 lg:gap-20 justify-start flex-wrap py-6 border-b border-gray-800">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold w-auto text-white">T&C</h2>
          {menu.items
            .filter((item) => tnclist.includes(item.title))
            .map((item) => (
              <FooterLink item={item} key={item.id} />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-white">Care For You</h2>
          {menu.items
            .filter((item) => helplist.includes(item.title))
            .map((item) => (
              <FooterLink item={item} key={item.id} />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-white">About Us</h2>
          {menu.items
            .filter((item) => aboutlist.includes(item.title))
            .map((item) => (
              <FooterLink item={item} key={item.id} />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-white">Follow Us</h2>
          <ul className="py-2">
            <li className="inline-block pr-2">
              <a
                className="w-[18px] h-[18px]"
                href="https://www.instagram.com/delicsworld"
              >
                <svg
                  width={18}
                  height={18}
                  aria-hidden="true"
                  focusable="false"
                  role="presentation"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="#ffff"
                    d="M16 3.094c4.206 0 4.7.019 6.363.094 1.538.069 2.369.325 2.925.544.738.287 1.262.625 1.813 1.175s.894 1.075 1.175 1.813c.212.556.475 1.387.544 2.925.075 1.662.094 2.156.094 6.363s-.019 4.7-.094 6.363c-.069 1.538-.325 2.369-.544 2.925-.288.738-.625 1.262-1.175 1.813s-1.075.894-1.813 1.175c-.556.212-1.387.475-2.925.544-1.663.075-2.156.094-6.363.094s-4.7-.019-6.363-.094c-1.537-.069-2.369-.325-2.925-.544-.737-.288-1.263-.625-1.813-1.175s-.894-1.075-1.175-1.813c-.212-.556-.475-1.387-.544-2.925-.075-1.663-.094-2.156-.094-6.363s.019-4.7.094-6.363c.069-1.537.325-2.369.544-2.925.287-.737.625-1.263 1.175-1.813s1.075-.894 1.813-1.175c.556-.212 1.388-.475 2.925-.544 1.662-.081 2.156-.094 6.363-.094zm0-2.838c-4.275 0-4.813.019-6.494.094-1.675.075-2.819.344-3.819.731-1.037.4-1.913.944-2.788 1.819S1.486 4.656 1.08 5.688c-.387 1-.656 2.144-.731 3.825-.075 1.675-.094 2.213-.094 6.488s.019 4.813.094 6.494c.075 1.675.344 2.819.731 3.825.4 1.038.944 1.913 1.819 2.788s1.756 1.413 2.788 1.819c1 .387 2.144.656 3.825.731s2.213.094 6.494.094 4.813-.019 6.494-.094c1.675-.075 2.819-.344 3.825-.731 1.038-.4 1.913-.944 2.788-1.819s1.413-1.756 1.819-2.788c.387-1 .656-2.144.731-3.825s.094-2.212.094-6.494-.019-4.813-.094-6.494c-.075-1.675-.344-2.819-.731-3.825-.4-1.038-.944-1.913-1.819-2.788s-1.756-1.413-2.788-1.819c-1-.387-2.144-.656-3.825-.731C20.812.275 20.275.256 16 .256z"
                  ></path>
                  <path
                    fill="#ffff"
                    d="M16 7.912a8.088 8.088 0 0 0 0 16.175c4.463 0 8.087-3.625 8.087-8.088s-3.625-8.088-8.088-8.088zm0 13.338a5.25 5.25 0 1 1 0-10.5 5.25 5.25 0 1 1 0 10.5zM26.294 7.594a1.887 1.887 0 1 1-3.774.002 1.887 1.887 0 0 1 3.774-.003z"
                  ></path>
                </svg>
              </a>
            </li>
            <li className="inline-block px-2">
              <a
                className="w-[18px] h-[18px]"
                href="https://www.tiktok.com/@delicsworld"
              >
                <svg
                  width={18}
                  height={18}
                  aria-hidden="true"
                  focusable="false"
                  role="presentation"
                  enableBackground="new 0 0 32 32"
                  viewBox="0 0 32 32"
                >
                  <g>
                    <path
                      fill="#ffff"
                      d="M30,8c-1.8,0-3.5-0.6-4.9-1.6c-1.6-1.2-2.7-2.9-3.1-4.9C22,1,21.9,0.5,21.9,0h-5.2v14.3l0,7.8c0,2.1-1.4,3.9-3.2,4.5
                    c-0.5,0.2-1.1,0.3-1.8,0.2c-0.8,0-1.5-0.3-2.2-0.7c-1.4-0.8-2.3-2.3-2.3-4c0-2.6,2.1-4.8,4.7-4.8c0.5,0,1,0.1,1.5,0.2v-3.9v-1.4
                    c-0.5-0.1-1-0.1-1.5-0.1c-2.9,0-5.6,1.2-7.5,3.4C3,17.2,2.1,19.3,2,21.5c-0.2,2.9,0.9,5.6,2.9,7.6c0.3,0.3,0.6,0.6,0.9,0.8
                    C7.6,31.3,9.7,32,12,32c0.5,0,1,0,1.5-0.1c2.1-0.3,4-1.3,5.6-2.8c1.9-1.9,2.9-4.3,2.9-7l0-11.7c0.9,0.7,1.9,1.3,2.9,1.7
                    c1.6,0.7,3.4,1,5.2,1V9.4L30,8C30.1,8,30,8,30,8L30,8z"
                    ></path>
                  </g>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
