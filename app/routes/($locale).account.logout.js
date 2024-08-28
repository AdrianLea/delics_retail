export async function action({context}) {
  return context.customerAccount.logout();
}
